<?php
require_once __DIR__ . '/config.php';

error_reporting(E_ALL);
ini_set('display_errors', '1');

$email = $_GET['email'];
$token = $_GET['token'];
$conn = connectToDatabase();
$req = "SELECT * FROM `users_temp` WHERE `email` = ?";
$del = "DELETE FROM `users_temp` WHERE `email` = ?";
$stmt = $conn->prepare($req);
$stmt->bind_param("s", $email);
$del_stmt = $conn->prepare($del);
$del_stmt->bind_param("s", $email);

if ($stmt->execute()) {
    $result = $stmt->get_result();

    if ($result->num_rows > 0 && $row = $result->fetch_assoc()) {
        $validation_token = $row["verification_token"];

        if ($validation_token === $token && $validation_token !== "" && ((new DateTime())->getTimestamp() - (new DateTime($row['created_at']))->getTimestamp()) < 750) { // Verify that the token is valid and that the link was sent less than 15 minutes ago.
            $password_hash = $row["password_hash"];
            $username = $row["username"];

            $create_account_req = "INSERT INTO `main` (user_name, email, password) VALUES(?, ?, ?)";
            $stmt = $conn->prepare($create_account_req);
            $stmt->bind_param("sss", $username, $email, $password_hash);

            if ($stmt->execute()) {
                http_response_code(200);
                $del_stmt->execute();
                $del_stmt->close();
                $stmt->close();
                $conn->close();
                $toast_type = 'success';
                $toast_title = "Creation du compte";
                $toast_message = "Votre compte chez DéfiMaths a bien été créé.";
                echo "<script type='text/javascript'>
                    window.location.href = window.location.origin + '/login.html?toast=" . urlencode('true') . "&toast-type=" . urlencode($toast_type) . "&toast-title=" . urlencode($toast_title) . "&toast-message=" . urlencode($toast_message) . "';
                  </script>";
                exit(0);
            }
        } else {
            http_response_code(400);
            $del_stmt->execute();
            $del_stmt->close();
            $conn->close();
            $stmt->close();
            $toast_type = 'error';
            $toast_title = "Creation du compte";
            $toast_message = "Le lien a expiré veuillez recommencer.";
            echo "<script type='text/javascript'>
                    window.location.href = window.location.origin + '/register.html?toast=" . urlencode('true') . "&toast-type=" . urlencode($toast_type) . "&toast-title=" . urlencode($toast_title) . "&toast-message=" . urlencode($toast_message) . "';
                  </script>";
            exit(1);
        }
    } else {
        http_response_code(400);
        $del_stmt->execute();
        $del_stmt->close();
        $conn->close();
        $stmt->close();
        $toast_type = 'error';
        $toast_title = "Creation du compte";
        $toast_message = "Ce lien n'existe pas. Veuillez recommencer.";
        echo "<script type='text/javascript'>
                    window.location.href = window.location.origin + '/register.html?toast=" . urlencode('true') . "&toast-type=" . urlencode($toast_type) . "&toast-title=" . urlencode($toast_title) . "&toast-message=" . urlencode($toast_message) . "';
                  </script>";
        exit(1);
    }
} else {
    http_response_code(403);
    $del_stmt->execute();
    $del_stmt->close();
    $conn->close();
    $stmt->close();
    $toast_type = 'error';
    $toast_title = "Creation du compte";
    $toast_message = "Ce lien n'existe pas. Veuillez recommencer.";
    echo "<script type='text/javascript'>
                    window.location.href = window.location.origin + '/register.html?toast=" . urlencode('true') . "&toast-type=" . urlencode($toast_type) . "&toast-title=" . urlencode($toast_title) . "&toast-message=" . urlencode($toast_message) . "';
                  </script>";
    exit(1);
}
