<?php

require __DIR__ . '/config.php';

session_start();

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Get the JSON data from the request body sent by the client
    $data = file_get_contents("php://input");
    $input = json_decode($data, true);

    if (!empty($_SESSION["user-id"]) && !empty($input["quiz-id"])) { // Check if the user is authenticated and quiz ID is provided

        // Get the user ID from the session and quiz ID from the input
        $user_id = $_SESSION["user-id"];
        $quiz_id = $input["quiz-id"];

        // Connect to the database and prepare the request
        $conn = connectToDatabase();
        $req = "SELECT JSON_UNQUOTE(JSON_EXTRACT(progress, '$.$quiz_id')) AS progress
        FROM main
        WHERE id = ?;";
        $stmt = $conn -> prepare($req);
        $stmt -> bind_param("i", $user_id);
        $response = $stmt -> execute();
        $result = $stmt -> get_result();

        if ($info = $result -> fetch_assoc()) {
            http_response_code(200);
            $stmt -> close();
            $conn -> close();
            echo json_encode(["progress" => $info["progress"]]);
            exit(0);
        } else {
            http_response_code(400);
            $stmt -> close();
            $conn -> close();
            echo json_encode(["error" => "Error updating quiz progress"]);
            exit(1);
        }

    } else {
        http_response_code(403); // Access unauthorized
        echo json_encode(["progress" => "No ID found"]);
    }
}

?>