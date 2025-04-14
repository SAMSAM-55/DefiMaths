<?php

require __DIR__ . '/config.php';

session_start();

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    if ($_SESSION['user-id']) {

        $user_id = $_SESSION['user-id'];
        $conn = new mysqli($server_name, $id, $database_password, $database_name);
        $req = "DELETE FROM `main` WHERE `main`.`id` = $user_id";

        if ($conn -> query($req)) {
            $conn -> close();
            session_destroy();
            exit(0);
        } else {
            $conn -> close();
            exit(1);
        }
    }
}

?>