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
    echo "<script type='text/javascript'>
        alert('Identifiant ou mot de passe incorrect.');
        window.location.href = 'https://defimaths.net/login.html';
    </script>";
}

$user = $response;
header("Location: https://defimaths.net/index.html?userid=" . urlencode($user['id']));
$conn->close();
exit();

echo $message;
?>