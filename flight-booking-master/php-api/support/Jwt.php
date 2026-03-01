<?php
// Minimal JWT implementation for HS256 only
// Usage: Jwt::encode($payload, $secret), Jwt::decode($jwt, $secret)

namespace App\support;

class Jwt
{
    /**
     * Encode a payload as a JWT string using HS256.
     *
     * @param array $payload
     * @param string $secret
     * @return string
     */
    public static function encode(array $payload, string $secret): string
    {
        $header = [
            'alg' => 'HS256',
            'typ' => 'JWT'
        ];

        $headerEncoded = self::urlsafeB64(json_encode($header));
        $payloadEncoded = self::urlsafeB64(json_encode($payload));
        $signingInput = $headerEncoded . '.' . $payloadEncoded;
        $signature = hash_hmac('sha256', $signingInput, $secret, true);
        $signatureEncoded = self::urlsafeB64($signature);

        return $headerEncoded . '.' . $payloadEncoded . '.' . $signatureEncoded;
    }

    /**
     * Decode a JWT string and verify its signature and expiration.
     *
     * @param string $jwt
     * @param string $secret
     * @return array|false
     */
    public static function decode(string $jwt, string $secret)
    {
        $parts = explode('.', $jwt);
        if (count($parts) !== 3) {
            return false;
        }

        list($headerEncoded, $payloadEncoded, $signatureEncoded) = $parts;

        $payload = json_decode(self::urlsafeB64Decode($payloadEncoded), true);
        $signature = self::urlsafeB64Decode($signatureEncoded);
        $expectedSignature = hash_hmac('sha256', "$headerEncoded.$payloadEncoded", $secret, true);

        if (!hash_equals($expectedSignature, $signature)) {
            return false;
        }

        if (isset($payload['exp']) && time() > $payload['exp']) {
            return false;
        }

        return $payload;
    }

    /**
     * Encode data to URL-safe Base64.
     *
     * @param string $data
     * @return string
     */
    private static function urlsafeB64($data): string
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    /**
     * Decode URL-safe Base64 data.
     *
     * @param string $b64
     * @return string|false
     */
    private static function urlsafeB64Decode($b64)
    {
        $b64 = strtr($b64, '-_', '+/');
        $padding = strlen($b64) % 4;
        if ($padding) {
            $b64 .= str_repeat('=', 4 - $padding);
        }
        return base64_decode($b64);
    }
}
