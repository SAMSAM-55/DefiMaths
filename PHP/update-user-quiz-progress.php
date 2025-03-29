<?php

require __DIR__ . '/config.php';

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $data = file_get_contents("php://input");
    $input = json_decode($data, true);

    if ($input["user-id"]) {

        $user_id = $input["user-id"];
        $quiz_id = $input["quiz-id"];
        $quiz_progress = $input["quiz-progress"];
        $conn = new mysqli($server_name, $id, $database_password, $database_name);
        $req = "UPDATE main 
        SET progress = COALESCE(progress, '{}'),
        progress = JSON_SET(progress, '$.$quiz_id', $quiz_progress)
        WHERE id = $user_id;";

        if ($conn -> query($req)) {
            echo json_encode(["result" => "Updated quiz progress successfuly"]);
            exit(0);
        } else {
            echo json_encode(["error" => "Error updating quiz progress"]);
            exit(1);
        }

    } else {
        echo json_encode(["error" => "No ID found"]);
        exit(1);
    }
}

?>