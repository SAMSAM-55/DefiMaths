<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require __DIR__ . '/config.php';

$email = $_REQUEST['email'];
$password = $_REQUEST['password'];

$conn = new mysqli($server_name, $id, $database_password, $database_name);
$sql = "SELECT * FROM `main` WHERE `main`.`email` = '$email';";
$result = $conn -> query($sql);
$response = $result->fetch_assoc();
$hashed_password = $response['password'];

if (password_verify($password, $hashed_password)) {
    $message = "connexion...";
} else {
    $message = "<script type='text/javascript'>alert('Le mot de passe ou l email saisi est incorrect');</script>";
    header("Location: https://defimaths.net/login.html");
}

$user = $response;
header("Location: https://defimaths.net/index.html?userid=" . urlencode($user['id']));
$conn->close();
exit();

echo $message;
?>