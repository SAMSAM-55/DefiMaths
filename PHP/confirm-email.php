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

try {
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
                    $stmt->close();
                    $del_stmt->execute();
                    $del_stmt->close();
                    $toast_type = 'success';
                    $toast_title = "Creation du compte";
                    $toast_message = "Votre compte chez DéfiMaths a bien été créé.";
                    $conn->close();
                    echo "<script type='text/javascript'>
                        window.location.href = window.location.origin + '/login.html?toast=" . urlencode('true') . "&toast-type=" . urlencode($toast_type) . "&toast-title=" . urlencode($toast_title) . "&toast-message=" . urlencode($toast_message) . "';
                      </script>";
                    exit(0);
                }
            } else {
                http_response_code(400);
                $conn->close();
                $stmt->close();
                $del_stmt->execute();
                $del_stmt->close();
                $toast_type = 'error';
                $toast_title = "Creation du compte";
                $toast_message = "Le lien a expiré veuillez recommencer.";
            }
        } else {
            throw new Exception("An error occured while trying to create an account.");
        }
    } else {
        throw new Exception("An error occured while trying to connect to database.");
    }
} catch (Exception $e) {
    http_response_code(500);
    $toast_type = 'error';
    $toast_title = "Erreur";
    $toast_message = "Une erreur interne est survenue. Veuillez recommencer la création de votre compte.";
    $conn->close();
    $stmt->close();
    $del_stmt->execute();
    $del_stmt->close();
    echo "<script type='text/javascript'>
                        window.location.href = window.location.origin + '/register.html?toast=" . urlencode('true') . "&toast-type=" . urlencode($toast_type) . "&toast-title=" . urlencode($toast_title) . "&toast-message=" . urlencode($toast_message) . "';
                      </script>";
    exit(1);
}
