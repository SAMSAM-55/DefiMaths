<?php

require __DIR__ . '/config.php';

session_start();

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $data = file_get_contents("php://input");
    $input = json_decode($data, true);

    if ($_SESSION["user-id"]) {

        $user_id = $_SESSION["user-id"];
        $quiz_id = $input["quiz-id"];
        $conn = new mysqli($server_name, $id, $database_password, $database_name);
        $req = "SELECT JSON_UNQUOTE(JSON_EXTRACT(progress, '$.$quiz_id')) AS progress
        FROM main
        WHERE id = $user_id;";
        $response = $conn -> query($req);

        if ($result = $response -> fetch_assoc()) {
            echo json_encode(["progress" => $result["progress"]]);
            exit(0);
        } else {
            echo json_encode(["error" => "Error updating quiz progress"]);
            exit(1);
        }

    } else {
        echo json_encode(["progress" => "No ID found"]);
    }
}

?>