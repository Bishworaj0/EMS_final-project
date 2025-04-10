<?php
session_start(); // required for sessions

function handleLogin($pdo, $method) {
    if ($method !== 'POST') {
        http_response_code(405);
        echo json_encode(["error" => "Only POST allowed"]);
        return;
    }

    $data = json_decode(file_get_contents("php://input"), true);
    $username = trim($data['username'] ?? '');
    $password = $data['password'] ?? '';

    if (!$username || !$password) {
        http_response_code(400);
        echo json_encode(["error" => "Missing username or password"]);
        return;
    }

    // 🔍 SQL query to get user
    $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
    $stmt->execute([$username]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

   
    
    
    // 🔐 Check password
    if (!password_verify($password, $user['password_hash'])) {
        echo json_encode(["error" => "Password does not match"]);
        return;
    }
    

    // ✅ Login success
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['role'] = $user['role'];

    echo json_encode([
        "message" => "Login successful",
        "user" => [
            "id" => $user['id'],
            "username" => $user['username'],
            "role" => $user['role']
        ]
    ]);
}
