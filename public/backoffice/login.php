<?php
session_start();
header('Content-Type: application/json');

// Разрешени потребители
$users = [
    'hr@itrb.org' => password_hash('hr2025', PASSWORD_DEFAULT),
    'ux@itrb.org' => password_hash('ux2025', PASSWORD_DEFAULT)
];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';
    
    if (isset($users[$email]) && password_verify($password, $users[$email])) {
        $_SESSION['logged_in'] = true;
        $_SESSION['user'] = $email;
        $_SESSION['login_time'] = time();
        echo json_encode(['success' => true, 'user' => $email]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Invalid email or password']);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Проверка дали е логнат
    $logged_in = isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true;
    echo json_encode(['logged_in' => $logged_in, 'user' => $_SESSION['user'] ?? null]);
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Logout
    session_destroy();
    echo json_encode(['success' => true]);
}
?>