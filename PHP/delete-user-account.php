<?php

require __DIR__ . '/config.php';

session_start(); // Start the session

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    if (!empty($_SESSION['user-id'])) { // Check if the user is authenticated
        $user_id = $_SESSION['user-id']; // Get the user ID from the session
        $conn = connectToDatabase();
        $req = "DELETE FROM `main` WHERE `id` = ?;"; // Prepare the SQL statement to delete the user account
        $stmt = $conn -> prepare($req);
        $stmt -> bind_param("i", $user_id); // Bind the user ID to the prepared statement

        if ($stmt -> execute()) {
            http_response_code(200); // OK
            $stmt -> close();
            $conn -> close();
            session_destroy();
            exit(0);
        } else {
            error_log("Error deleting user account: " . $stmt -> error); // Log the error
            http_response_code(500); // Internal Server Error
            $stmt -> close();
            $conn -> close();
            exit(1);
        }
    } else {
        http_response_code(403); // Access unauthorized
        error_log("Unauthorized access attempt to delete user account.");
        exit(1);
    }
}

?>