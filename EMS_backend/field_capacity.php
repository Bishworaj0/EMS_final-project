<?php
function handleFieldCapacity($pdo, $method) {
  if ($method === 'GET') {
    $stmt = $pdo->query("SELECT * FROM field_capacity ORDER BY id DESC");
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($data);
    return;
  }

  if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    $user_id = $data['user_id'] ?? null;
    $field_name = $data['field_name'] ?? '';
    $soil_type = $data['soil_type'] ?? '';
    $area = $data['area_ha'] ?? 0;
    $capacity = $data['capacity_mm'] ?? 0;
    $notes = $data['notes'] ?? '';

    if (!$user_id || !$field_name) {
      http_response_code(400);
      echo json_encode(["error" => "Missing user_id or field_name"]);
      return;
    }

    $stmt = $pdo->prepare("INSERT INTO field_capacity (user_id, field_name, soil_type, area_ha, capacity_mm, notes) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([$user_id, $field_name, $soil_type, $area, $capacity, $notes]);

    echo json_encode(["message" => "Field capacity added successfully"]);
    return;
  }

  http_response_code(405);
  echo json_encode(["error" => "Method not allowed"]);
}
