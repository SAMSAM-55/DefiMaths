<?php

require __DIR__ . '/config.php';

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $data = file_get_contents("php://input");
    $user = json_decode($data, true);

    if ($user["user_id"]) {
        
        $user_id = $user["user_id"];

        $conn = new mysqli($server_name, $id, $database_password, $database_name);
        $user_data = $conn -> query("SELECT * FROM `main` WHERE `main`.`id` = $user_id;");

        if ($user_data && $user_data->num_rows > 0) {
            $row = $user_data->fetch_assoc();
            echo json_encode($row);
            $conn -> close();
        } else {
            echo json_encode(["error" => "User Not Found"]);
        }

    } else {
        echo json_encode(["error" => "User ID missing."]);
    }
} else {
    echo json_encode(["error" => "Invalid request."]);
}

exit();

?>