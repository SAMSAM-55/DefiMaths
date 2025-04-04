<?php

require __DIR__ . '/config.php';

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $data = file_get_contents("php://input");
    $user = json_decode($data, true);

    if ($user['user-id']) {

        $user_id = $user['user-id'];
        $conn = new mysqli($server_name, $id, $database_password, $database_name);
        $req = "DELETE FROM `main` WHERE `main`.`id` = $user_id"

        $conn -> query($req);
    }
}

?>