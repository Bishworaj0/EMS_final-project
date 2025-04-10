<?php
function handleEquipmentStatus($pdo, $method) {
  if ($method === 'GET') {
    $stmt = $pdo->query("SELECT * FROM equipment_status ORDER BY created_at DESC");
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($data);
    return;
  }

  if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    $user_id = $data['user_id'] ?? null;
    $name = $data['name'] ?? '';
    $type = $data['type'] ?? '';
    $status = $data['status'] ?? 'Unknown';
    $last_serviced = $data['last_serviced'] ?? null;
    $notes = $data['notes'] ?? '';

    if (!$user_id || !$name) {
      http_response_code(400);
      echo json_encode(["error" => "Missing user_id or name"]);
      return;
    }

    $stmt = $pdo->prepare("INSERT INTO equipment_status (user_id, name, type, status, last_serviced, notes) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([$user_id, $name, $type, $status, $last_serviced, $notes]);

    echo json_encode(["message" => "Equipment added successfully"]);
    return;
  }

  http_response_code(405);
  echo json_encode(["error" => "Method not allowed"]);
}