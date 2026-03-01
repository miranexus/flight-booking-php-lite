<?php
// Front controller for PHP API

declare(strict_types=1);

// --- CORS HEADERS ---
/**
 * Sends CORS and security headers.
 */
function send_cors_headers(): void {
    $allowed_origins = [
        'https://miranexus.com',
        'https://www.miranexus.com',
        'http://localhost:4200',
    ];
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if (in_array($origin, $allowed_origins)) {
        header("Access-Control-Allow-Origin: $origin");
    }
    header('Vary: Origin');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: DENY');
    header('Referrer-Policy: no-referrer');
}

send_cors_headers();
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
// --- END CORS HEADERS ---

require_once __DIR__ . '/support/Autoload.php';
require_once __DIR__ . '/support/Jwt.php';

use App\controllers\HealthController;
use App\controllers\PrimeNgDataController;
use App\config\Database;
use App\support\Jwt;

header('Content-Type: application/json');

$path = $_GET['path'] ?? ($_SERVER['PATH_INFO'] ?? '/health');

// --- JWT secret (should be in .env in production) ---
$jwtSecret = getenv('API_JWT_SECRET');
if ($jwtSecret === false || $jwtSecret === '') {
    $envPath = __DIR__ . '/.env';
    if (file_exists($envPath)) {
        $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            if (strpos(trim($line), 'API_JWT_SECRET=') === 0) {
                $jwtSecret = trim(substr($line, strlen('API_JWT_SECRET=')));
                break;
            }
        }
    }
}
if (!$jwtSecret) {
    http_response_code(500);
    echo json_encode(['error' => 'JWT secret not configured']);
    exit();
}

// --- Demo login endpoint ---
if ($path === '/login' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $username = $input['username'] ?? '';
    $password = $input['password'] ?? '';
    // DEMO: Replace with real user lookup
    if ($username === 'admin' && $password === 'password123') {
        $payload = [
            'sub' => $username,
            'iat' => time(),
            'exp' => time() + 3600 // 1 hour expiry
        ];
        $jwt = Jwt::encode($payload, $jwtSecret);
        echo json_encode(['token' => $jwt]);
        exit;
    }
    http_response_code(401);
    echo json_encode(['error' => 'Invalid credentials']);
    exit;
}

// --- Health endpoint ---
if ($path === '/health') {
    $controller = new HealthController();
    $controller->index();
    exit;
}

$pdo = Database::connect();

// --- CRUD for /prime-ng-data and /prime-ng-data/{id} ---
if (preg_match('#^/prime-ng-data/?$#', $path)) {
    $controller = new PrimeNgDataController($pdo);
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $controller->index();
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $controller->store();
    }
    exit;
}

if (preg_match('#^/prime-ng-data/(\d+)$#', $path, $matches)) {
    $controller = new PrimeNgDataController($pdo);
    $id = $matches[1];
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $controller->show($id);
    } elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        $controller->update($id);
    } elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        $controller->destroy($id);
    }
    exit;
}

// --- Simple Bearer Token Authentication (replace with real auth in production) ---
$public_paths = ['/health', '/login'];

// Load API token from environment variable or .env file
$expectedToken = getenv('API_BEARER_TOKEN');
if ($expectedToken === false) {
    $envPath = __DIR__ . '/.env';
    if (file_exists($envPath)) {
        $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            if (strpos(trim($line), 'API_BEARER_TOKEN=') === 0) {
                $expectedToken = trim(substr($line, strlen('API_BEARER_TOKEN=')));
                break;
            }
        }
    }
}

if (!in_array($path, $public_paths)) {
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (preg_match('/^Bearer (.+)$/', $authHeader, $matches)) {
        $jwt = $matches[1];
        $payload = Jwt::decode($jwt, $jwtSecret);
        if (!$payload) {
            send_cors_headers();
            http_response_code(401);
            echo json_encode(['error' => 'Invalid or expired token']);
            exit();
        }
        // Optionally, set user info in global scope for controllers
        $GLOBALS['jwt_user'] = $payload['sub'] ?? null;
    } else {
        send_cors_headers();
        http_response_code(401);
        echo json_encode(['error' => 'Missing or invalid Authorization header']);
        exit();
    }
}

// --- Rate Limiting ---
/**
 * Simple file-based rate limiting by IP address.
 *
 * @param int $limit
 * @param int $window
 */
function rate_limit(int $limit = 100, int $window = 600): void {
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $key = md5($ip);
    $file = sys_get_temp_dir() . "/api_rate_{$key}.json";
    $now = time();
    $data = ['start' => $now, 'count' => 0];
    if (file_exists($file)) {
        $data = json_decode(file_get_contents($file), true) ?: $data;
        if ($now - $data['start'] < $window) {
            if ($data['count'] >= $limit) {
                send_cors_headers();
                http_response_code(429);
                echo json_encode(['error' => 'Too Many Requests']);
                exit();
            }
            $data['count']++;
        } else {
            $data = ['start' => $now, 'count' => 1];
        }
    } else {
        $data = ['start' => $now, 'count' => 1];
    }
    file_put_contents($file, json_encode($data));
}
rate_limit();

// --- Error Logging ---
/**
 * Log an error message to error.log.
 *
 * @param string $message
 */
function log_error(string $message): void {
    $logFile = __DIR__ . '/error.log';
    $date = date('Y-m-d H:i:s');
    file_put_contents($logFile, "[$date] $message\n", FILE_APPEND);
}

set_exception_handler(function($e) {
    send_cors_headers();
    log_error($e . "\n" . $e->getTraceAsString());
    http_response_code(500);
    echo json_encode(['error' => 'Internal server error']);
    exit();
});

set_error_handler(function($errno, $errstr, $errfile, $errline) {
    send_cors_headers();
    log_error("Error [$errno] $errstr in $errfile on line $errline");
    http_response_code(500);
    echo json_encode(['error' => 'Internal server error']);
    exit();
});

// --- IMPORTANT: Ensure all input is validated and sanitized in controllers! ---
