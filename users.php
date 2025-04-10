<?php

function handleUsers($pdo, $method) {
  $data = json_decode(file_get_contents("php://input"), true);

  // ✅ Admin check
  $isAdmin = isset($data['admin_role_check']) && $data['admin_role_check'] === 'admin';
  if (!$isAdmin) {
    http_response_code(403);
    echo json_encode(["error" => "Admins only"]);
    return;
  }

  // ✅ Move switch inside the function
  switch ($method) {
    case 'GET':
      $stmt = $pdo->query("SELECT id, username, role FROM users ORDER BY id DESC");
      echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
      break;

    case 'POST':
      $username = $data['username'] ?? '';
      $password = $data['password'] ?? '';
      $role = $data['role'] ?? 'user';

      if (!$username || !$password) {
        http_response_code(400);
        echo json_encode(["error" => "Username and password required"]);
        return;
      }

      $hash = password_hash($password, PASSWORD_DEFAULT);
      $stmt = $pdo->prepare("INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)");
      $stmt->execute([$username, $hash, $role]);

      echo json_encode(["message" => "User added"]);
      break;

    case 'PUT':
      $id = $data['id'] ?? null;
      $username = $data['username'] ?? '';
      $role = $data['role'] ?? '';

      if (!$id || !$username || !$role) {
        http_response_code(400);
        echo json_encode(["error" => "Missing fields"]);
        return;
      }

      $stmt = $pdo->prepare("UPDATE users SET username = ?, role = ? WHERE id = ?");
      $stmt->execute([$username, $role, $id]);

      echo json_encode(["message" => "User updated"]);
      break;

    case 'DELETE':
      $id = $data['id'] ?? null;

      if (!$id) {
        http_response_code(400);
        echo json_encode(["error" => "Missing user ID"]);
        return;
      }

      $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
      $stmt->execute([$id]);

      echo json_encode(["message" => "User deleted"]);
      break;

    default:
      http_response_code(405);
      echo json_encode(["error" => "Method not allowed"]);
      break;
  }
}
