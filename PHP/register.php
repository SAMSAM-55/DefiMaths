<?php
require __DIR__ . '/config.php';

$email = $_REQUEST['email'];
$password = $_REQUEST['password'];
$user_name = $_REQUEST['user-name'];

if (empty("$email") || empty("$password") || empty("$user_name")) {
    header("Location: https://defimaths.net/register.html");
    echo "<script type='text/javascript'>alert('Tous les champs ne sont pas rempli');</script>";
    exit();
}

$conn = new mysqli($server_name, $id, $database_password, $database_name);
$check_email_avalaible = $conn -> query("SELECT * FROM `main` WHERE `main`.`email` = '$email'");
$hashed_password = password_hash($password, PASSWORD_DEFAULT);
$create_account = "INSERT INTO `main` (user_name, email, password, progress) VALUES('$user_name', '$email', '$hashed_password', '{}')";

if (filter_var($email, FILTER_VALIDATE_EMAIL)) {} else {
    header("Location: https://defimaths.net/register.html");
    echo "<script type='text/javascript'>alert('Veuillez saisir un email valide');</script>";
    $conn -> close();
    exit();
}

if (preg_match("/^[a-zA-Z0-9-_]*$/", "$user_name")) {} else {
    header("Location: https://defimaths.net/register.html");
    echo "<script type='text/javascript'>alert('Le nom d utilisateur doit seulement contenir des tirets ou des underscore et des lettres ou chiffres');</script>";
    $conn -> close();
    exit();
}
    
if ($check_email_avalaible -> num_rows == 0) {} else {
    header("Location: https://defimaths.net/register.html");
    echo "<script type='text/javascript'>alert('Un compte existe déjà pour cet email');</script>";
    $conn -> close();
    exit();
}

if ($conn -> query($create_account) === TRUE) {
    header("Location: https://defimaths.net/login.html");
    echo "<script type='text/javascript'>alert('Compte créé avec succès');</script>";
} else {
    header("Location: https://defimaths.net/register.html");
    $conn -> close();
    echo "<script type='text/javascript'>alert('Echec lors de la création du compte');</script>";
}

?>