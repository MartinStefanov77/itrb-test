<?php
/**
 * ITRB Contact Form Handler
 *
 * POST /contact.php — validates input, captcha, sends email (JSON)
 *
 * ⚠️ Change RECIPIENT_EMAIL before deploying.
 */

// ── Configuration ────────────────────────────────────────────────────────────
define('RECIPIENT_EMAIL',   'polina.lozanova@itrb.org');
define('SENDER_DOMAIN',     'itrb.org');
define('RATE_LIMIT_MAX',    5);
define('RATE_LIMIT_WINDOW', 3600);
define('CAPTCHA_TTL_MS',    600000);

// ── Headers ──────────────────────────────────────────────────────────────────
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin) {
    $allowed = [
        'http://localhost',
        'https://' . SENDER_DOMAIN,
        'https://www.' . SENDER_DOMAIN
    ];

    if (in_array($origin, $allowed, true)) {
        header('Access-Control-Allow-Origin: ' . $origin);
    }
}

// ── Routing ──────────────────────────────────────────────────────────────────
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'POST') {
    handlePost();
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
}

// ── POST Handler ─────────────────────────────────────────────────────────────
function handlePost(): void
{
    // 1. Honeypot
    if (!empty($_POST['website'])) {
        respond(400, false, 'Spam detected.');
    }

    // 2. Detect client IP safely
    $ip = $_SERVER['HTTP_CF_CONNECTING_IP']
        ?? $_SERVER['HTTP_X_FORWARDED_FOR']
        ?? $_SERVER['REMOTE_ADDR']
        ?? 'unknown';

    $ip = preg_replace('/[^0-9a-fA-F\.:,_ ]/', '', $ip);

    // 3. Rate limiting
    $rateFile = sys_get_temp_dir() . '/itrb_rate_' . md5($ip) . '.json';
    $now = time();
    $history = [];

    if (file_exists($rateFile)) {
        $json = file_get_contents($rateFile);
        $history = json_decode($json, true);

        if (!is_array($history)) {
            $history = [];
        }
    }

    $history = array_values(array_filter(
        $history,
        fn($t) => $now - $t < RATE_LIMIT_WINDOW
    ));

    if (count($history) >= RATE_LIMIT_MAX) {
        respond(429, false, 'Too many requests. Please try again later.');
    }

    // 4. Captcha validation
    $rawToken   = $_POST['captcha_token'] ?? '';
    $userAnswer = intval($_POST['captcha_answer'] ?? -999);

    $decoded = base64_decode($rawToken, true);
    if ($decoded === false) {
        respond(400, false, 'Invalid captcha token.');
    }

    $parts = explode(':', $decoded);

    if (count($parts) !== 3) {
        respond(400, false, 'Invalid captcha token format.');
    }

    [$a, $b, $expiresMs] = $parts;

    if ((int)$expiresMs < (int)(microtime(true) * 1000)) {
        respond(400, false, 'Captcha expired. Please refresh and try again.');
    }

    if (intval($a) < 2 || intval($a) > 9 || intval($b) < 1 || intval($b) > 9) {
        respond(400, false, 'Invalid captcha values.');
    }

    if ($userAnswer !== intval($a) + intval($b)) {
        respond(400, false, 'Incorrect captcha answer. Please try again.');
    }

    // 5. Sanitize inputs
    $name    = trim($_POST['name'] ?? '');
    $email   = trim($_POST['email'] ?? '');
    $subject = trim($_POST['subject'] ?? '');
    $message = trim($_POST['message'] ?? '');

    $name    = strip_tags($name);
    $subject = strip_tags($subject);
    $message = strip_tags($message);

    $email = filter_var($email, FILTER_SANITIZE_EMAIL);

    if (!$name || !$email || !$subject || !$message) {
        respond(400, false, 'All fields are required.');
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        respond(400, false, 'Invalid email address.');
    }

    if (
        mb_strlen($name) > 120 ||
        mb_strlen($subject) > 200 ||
        mb_strlen($message) > 5000
    ) {
        respond(400, false, 'Input exceeds maximum allowed length.');
    }

    // Prevent header injection
    if (preg_match("/[\r\n]/", $email)) {
        respond(400, false, 'Invalid email format.');
    }

    // 6. Save rate limit record
    $history[] = $now;
    file_put_contents($rateFile, json_encode($history), LOCK_EX);

    // 7. Build email
    $emailSubject = '[ITRB Contact] ' . $subject;

    $body  = "You have received a new message from the ITRB website contact form.\n\n";
    $body .= "Name:    $name\n";
    $body .= "Email:   $email\n";
    $body .= "Subject: $subject\n";
    $body .= str_repeat('-', 60) . "\n";
    $body .= $message . "\n";
    $body .= str_repeat('-', 60) . "\n";
    $body .= "Sent from: " . SENDER_DOMAIN . "\n";
    $body .= "IP: $ip\n";

    $headers  = "From: noreply@" . SENDER_DOMAIN . "\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $headers .= "X-Mailer: PHP/" . PHP_VERSION . "\r\n";

    $sent = mail(RECIPIENT_EMAIL, $emailSubject, $body, $headers);

    if ($sent) {
        respond(
            200,
            true,
            'Thank you! Your message has been sent. We will get back to you shortly.'
        );
    } else {
        respond(
            500,
            false,
            'Failed to send the message. Please try again or email us directly at ' . RECIPIENT_EMAIL . '.'
        );
    }
}

// ── Helper ───────────────────────────────────────────────────────────────────
function respond(int $code, bool $success, string $message): never
{
    http_response_code($code);
    echo json_encode([
        'success' => $success,
        'message' => $message
    ]);
    exit;
}