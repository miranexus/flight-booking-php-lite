# Flight Booking PHP Lite API

This repository contains the PHP API files for the Flight Booking project. These files are intended to be uploaded directly to your HostGator cPanel File Manager for deployment.

## Deployment Instructions

### 1. Upload API Files
Upload the contents of this directory (`php-api/`) to your server at:
```
public_html/api/flight-booking-php-lite/
```

**Folder structure:**
```
public_html/
  api/
    flight-booking-php-lite/
      index.php
      config/
        Database.php
      controllers/
        HealthController.php
        PrimeNgDataController.php
      models/
        PrimeNgData.php
      support/
        Autoload.php
```

### 2. Upload the .env File
Upload your `.env` file (containing database credentials, API Bearer token, and CORS settings) to:
```
public_html/envs/flight-booking-php-lite/.env
```

**Example .env:**
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
API_BEARER_TOKEN=your_secure_token_here
CORS_ORIGIN=https://miranexus.com,https://www.miranexus.com
```

### 3. Database Table
**IMPORTANT:** The MySQL table name is case-sensitive and must be exactly:

- `primeNgData` (camelCase)

With at least the following columns:
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT)
- `title` (VARCHAR)
- `description` (TEXT)
- `published` (TINYINT or BOOLEAN)
- `createdAt` (DATETIME)
- `updatedAt` (DATETIME)

### 4. Endpoints
- Health: `/index.php` (GET)
- CRUD: `/index.php?path=/prime-ng-data` (GET, POST)
- CRUD: `/index.php?path=/prime-ng-data/{id}` (GET, PUT, DELETE)

### 5. Authentication (Bearer Token)

All endpoints except `/health` require a Bearer token for authentication. Set your token in the `.env` file as `API_BEARER_TOKEN`.

**How to use:**
- Add an `Authorization` header to your requests:
  ```
  Authorization: Bearer your_secure_token_here
  ```
- If the token is missing or incorrect, the API will return `401 Unauthorized`.

### 6. Angular Integration

**API Base Path for Angular:**

In your Angular application, set the API base URL to:

```
https://miranexus.com/api/flight-booking-php-lite/index.php
```

All requests should use the `?path=` query parameter, for example:

- Get all: `https://miranexus.com/api/flight-booking-php-lite/index.php?path=/prime-ng-data`
- Get by ID: `https://miranexus.com/api/flight-booking-php-lite/index.php?path=/prime-ng-data/123`

**Example Angular usage:**
```typescript
const apiBaseUrl = 'https://miranexus.com/api/flight-booking-php-lite/index.php';
const baseUrl = `${apiBaseUrl}?path=/prime-ng-data`;
```

### 7. CORS (Cross-Origin Resource Sharing) & Security Headers

The PHP API now restricts CORS to trusted origins (see `CORS_ORIGIN` in your `.env`).

The following headers are sent for all responses:
```
Access-Control-Allow-Origin: <your allowed origin>
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Vary: Origin
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: no-referrer
```
If you are still seeing CORS errors:
- Make sure you have deployed the latest `index.php` with the CORS code at the top.
- Ensure there is no whitespace or output before the `<?php` tag.
- If using a proxy, CDN, or .htaccess, ensure it does not strip or override these headers.

---

## JWT Authentication

This API uses JWT (JSON Web Token) for authentication on protected endpoints. The JWT is generated and validated using the minimal implementation in `support/Jwt.php`.

### How JWT Works in This API
- When a user logs in via the `/login` endpoint, a JWT is issued if credentials are valid.
- The JWT contains the username (`sub`), issued-at (`iat`), and expiration (`exp`) claims.
- For all protected endpoints, the API expects an `Authorization: Bearer <token>` header. The token is validated for signature and expiration.

### Example: Logging In and Using JWT
1. **Login Request:**
   ```http
   POST /index.php?path=/login
   Content-Type: application/json

   {
     "username": "admin",
     "password": "password123"
   }
   ```
   **Response:**
   ```json
   { "token": "<your_jwt_token_here>" }
   ```
2. **Authenticated Request:**
   ```http
   GET /index.php?path=/prime-ng-data
   Authorization: Bearer <your_jwt_token_here>
   ```

### JWT Secret Management
- The secret used to sign and verify JWTs is set via the `API_JWT_SECRET` variable in your `.env` file.
- **Example .env:**
  ```
  API_JWT_SECRET=your_super_secret_key_here
  ```

### Production Security Notes
- **Never commit your `.env` file or secrets to version control.**
- In production, use a strong, random value for `API_JWT_SECRET`.
- Store your `.env` file outside the web root if possible, or restrict access to it via server configuration.
- Rotate your JWT secret if you suspect it has been compromised.
- Always use HTTPS in production to protect tokens in transit.

---

**These are the only files you need to upload to cPanel. Do not upload the `.env` file to GitHub.**

---

## Changelog

- Added Bearer token authentication for all endpoints except `/health`.
- CORS now restricts to trusted origins and adds security headers.
- Table name for CRUD endpoints is now `primeNgData` (camelCase, case-sensitive).
- Endpoints and model updated to match this table name.
