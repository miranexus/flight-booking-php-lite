<?php
namespace App\controllers;

class HealthController {
    public function index() {
        echo json_encode([
            'status' => 'ok',
            'timestamp' => gmdate('c'),
        ]);
    }
}

