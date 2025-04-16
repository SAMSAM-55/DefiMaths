<?php

require __DIR__ . '/config.php';

session_start(); // Start the session

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $data = file_get_contents("php://input");
    $input = json_decode($data, true);

    if (!empty($_SESSION['user-id']) && !empty($input['quiz-id']) && !empty($input["quiz-progress"])) {

        $user_id = $_SESSION["user-id"];
        $quiz_id = '$.'.$input["quiz-id"];
        $quiz_progress = $input["quiz-progress"];
        $conn = connectToDatabase();
        $req = "UPDATE main 
                SET progress = JSON_SET(COALESCE(progress, '{}'), ?, CAST(? AS UNSIGNED))
                WHERE id = ?;
        ";
        $stmt = $conn -> prepare($req);
        $stmt -> bind_param("ssi", $quiz_id, $quiz_progress, $user_id);

        if ($stmt -> execute()) {
            http_response_code(200);
            echo json_encode(["type" => "info", "title" => "Mise à jour de la progression", "message" => "Votre progression sur ce quiz a bien été mise à jour."]);
            exit(0);
        } else {
            http_response_code(500);
            echo json_encode(["type" => "error", "title" => "Mise à jour de la progression", "message" => "Une erreur est survenue lors de la mise à jour de votre progression."]);
            exit(1);
        }

    } else {
        http_response_code(403);
        echo json_encode(["type" => "error", "title" => "Erreur", "message" => "Utilisateur introuvable."]);
        exit(1);
    }
}

