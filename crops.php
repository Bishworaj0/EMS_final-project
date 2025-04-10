<?php
function handleCrops($pdo, $method) {
  if ($method === 'GET') {
    // Return all crops (later filter by user_id if needed)
    $stmt = $pdo->query("SELECT * FROM crops ORDER BY planted_on DESC");
    $crops = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($crops);
    return;
  }

  if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $user_id = $data['user_id'] ?? null;
    $crop_name = $data['crop_name'] ?? '';
    $season = $data['season'] ?? '';
    $quantity = $data['quantity'] ?? 0;
    $planted_on = $data['planted_on'] ?? null;
    $harvested_on = $data['harvested_on'] ?? null;
    $notes = $data['notes'] ?? '';

    if (!$user_id || !$crop_name) {
      http_response_code(400);
      echo json_encode(["error" => "Missing crop_name or user_id"]);
      return;
    }

    $stmt = $pdo->prepare("INSERT INTO crops (user_id, crop_name, season, quantity, planted_on, harvested_on, notes) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([$user_id, $crop_name, $season, $quantity, $planted_on, $harvested_on, $notes]);

    echo json_encode(["message" => "Crop added successfully"]);
    return;
  }

  http_response_code(405);
  echo json_encode(["error" => "Method not allowed"]);
}
