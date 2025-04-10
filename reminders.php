<?php
// ems_backend/reminders.php

function handleReminders($pdo, $method) {
    if ($method === 'GET') {
        $stmt = $pdo->query("SELECT * FROM reminders ORDER BY date_time ASC");
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));

    } elseif ($method === 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);
        if (!isset($data['title'], $data['date_time'], $data['notes'])) {
            http_response_code(400);
            echo json_encode(["error" => "Missing fields"]);
            return;
        }

        $stmt = $pdo->prepare("INSERT INTO reminders (title, date_time, notes, completed) VALUES (?, ?, ?, 0)");
        $stmt->execute([$data['title'], $data['date_time'], $data['notes']]);
        echo json_encode(["message" => "Reminder added successfully"]);

    } elseif ($method === 'DELETE') {
        $data = json_decode(file_get_contents("php://input"), true);
        if (!isset($data['id'])) {
            http_response_code(400);
            echo json_encode(["error" => "Missing reminder ID"]);
            return;
        }

        $stmt = $pdo->prepare("DELETE FROM reminders WHERE id = ?");
        $stmt->execute([$data['id']]);
        echo json_encode(["message" => "Reminder deleted"]);
    } else {
        http_response_code(405);
        echo json_encode(["error" => "Method not allowed"]);
    }
}
