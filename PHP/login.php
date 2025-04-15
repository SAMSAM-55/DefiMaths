<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require __DIR__ . '/config.php';
session_start();

$email = $_REQUEST['email'];
$password = $_REQUEST['password'];

$conn = connectToDatabase();
$sql = "SELECT * FROM `main` WHERE `main`.`email` = ?;";
$stmt = $conn -> prepare($sql);
$stmt -> bind_param("s", $email);

if ($stmt->execute()) {
    $result = $stmt -> get_result();
    $response = $result -> fetch_assoc();
    $hashed_password = $response['password'];
} else {
    http_response_code(403); // Access unauthorized
    error_log("An error occured while trying to connect to database");
    echo json_encode(["progress" => "No ID found"]);
}

if (password_verify($password, $hashed_password)) {
    $user = $response;
    $_SESSION['user-email'] = $user['email'];
    $_SESSION['user-id'] = $user['id'];
    $_SESSION['user-name'] = $user['user_name'];
    $_SESSION['logged-in'] = "true";

    $toast_type = 'success';
    $toast_title = 'Connexion réussie';
    $toast_message = 'Vous avez bien été connecté à votre compte.';
    $stmt -> close();
    $conn->close();
    http_response_code(200);
    echo "<script type='text/javascript'>
        window.location.href = 'https://defimaths.net/index.html?toast=" . urlencode('true') . "&toast-type=" . urlencode($toast_type) . "&toast-title=" . urlencode($toast_title) . "&toast-message=" . urlencode($toast_message) . "';
    </script>";
} else {
    $toast_type = 'error';
    $toast_title = 'Erreur';
    $toast_message = 'Mot de passe ou email invalide.';
    $stmt -> close();
    $conn->close();
    http_response_code(200);
    echo "<script type='text/javascript'>
        window.location.href = 'https://defimaths.net/login.html?email=" . urlencode($email) . "&toast=" . urlencode('true') . "&toast-type=" . urlencode($toast_type) . "&toast-title=" . urlencode($toast_title) . "&toast-message=" . urlencode($toast_message) . "';
    </script>";
}

exit();
?>