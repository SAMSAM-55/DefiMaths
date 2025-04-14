<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require __DIR__ . '/config.php';
session_start();

$email = $_REQUEST['email'];
$password = $_REQUEST['password'];

$conn = new mysqli($server_name, $id, $database_password, $database_name);
$sql = "SELECT * FROM `main` WHERE `main`.`email` = '$email';";
$result = $conn -> query($sql);
$response = $result->fetch_assoc();
$hashed_password = $response['password'];

if (password_verify($password, $hashed_password)) {
    $user = $response;
    $_SESSION['user-email'] = $user['email'];
    $_SESSION['user-id'] = $user['id'];
    $_SESSION['user-name'] = $user['user_name'];
    $_SESSION['logged-in'] = "true";

    $toast_type = 'success';
    $toast_title = 'Connexion réussie';
    $toast_message = 'Vous avez bien été connecté à votre compte.';
    $conn->close();
    echo "<script type='text/javascript'>
        window.location.href = 'https://defimaths.net/index.html?toast=" . urlencode('true') . "&toast-type=" . urlencode($toast_type) . "&toast-title=" . urlencode($toast_title) . "&toast-message=" . urlencode($toast_message) . "';
    </script>";
} else {
    $toast_type = 'error';
    $toast_title = 'Erreur';
    $toast_message = 'Mot de passe ou email invalide.';
    $conn->close();
    echo "<script type='text/javascript'>
        window.location.href = 'https://defimaths.net/login.html?email=" . urlencode($email) . "&toast=" . urlencode('true') . "&toast-type=" . urlencode($toast_type) . "&toast-title=" . urlencode($toast_title) . "&toast-message=" . urlencode($toast_message) . "';
    </script>";
}

exit();
?>