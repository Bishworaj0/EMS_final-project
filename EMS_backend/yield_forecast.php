<?php
function handleYieldForecast($pdo, $method) {
  if ($method === 'GET') {
    $stmt = $pdo->query("SELECT * FROM crop_yields ORDER BY created_at DESC");
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($data);
    return;
  }

  if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    $user_id = $data['user_id'] ?? null;
    $crop_name = $data['crop_name'] ?? '';
    $season = $data['season'] ?? '';
    $estimated_yield = $data['estimated_yield'] ?? 0;
    $actual_yield = $data['actual_yield'] ?? 0;
    $unit = $data['unit'] ?? '';
    $field_name = $data['field_name'] ?? '';
    $notes = $data['notes'] ?? '';

    // Validation
    if (!$user_id || !$crop_name) {
      http_response_code(400);
      echo json_encode(["error" => "Missing required user_id or crop_name"]);
      return;
    }

    try {
      $stmt = $pdo->prepare("INSERT INTO crop_yields (
        user_id, crop_name, season, estimated_yield, actual_yield, unit, field_name, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");

      $stmt->execute([
        $user_id,
        $crop_name,
        $season,
        $estimated_yield,
        $actual_yield,
        $unit,
        $field_name,
        $notes
      ]);

      echo json_encode(["message" => "Yield forecast saved"]);
    } catch (PDOException $e) {
      http_response_code(500);
      echo json_encode([
        "error" => "Database error: " . $e->getMessage()
      ]);
    }

    return;
  }

  http_response_code(405);
  echo json_encode(["error" => "Method not allowed"]);
}