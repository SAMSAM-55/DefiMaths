<?php
require __DIR__ . '/config.php';

$email = $_REQUEST['email'];
$password = $_REQUEST['password'];
$user_name = $_REQUEST['user-name'];

if (empty("$email") || empty("$password") || empty("$user_name")) {
    echo "<script type='text/javascript'>
        alert('Veuillez remplir tous les champs.');
        window.location.href = 'https://defimaths.net/register.html';
    </script>";
    exit();
}

$conn = new mysqli($server_name, $id, $database_password, $database_name);
$check_email_avalaible = $conn -> query("SELECT * FROM `main` WHERE `main`.`email` = '$email'");
$hashed_password = password_hash($password, PASSWORD_DEFAULT);
$create_account = "INSERT INTO `main` (user_name, email, password, progress) VALUES('$user_name', '$email', '$hashed_password', '{}')";

if (filter_var($email, FILTER_VALIDATE_EMAIL)) {} else {
    echo "<script type='text/javascript'>
        alert('Veuillez entrer une adresse email valide.');
        window.location.href = 'https://defimaths.net/register.html';
    </script>";
    $conn -> close();
    exit();
}

if (preg_match("/^[a-zA-Z0-9-_]*$/", "$user_name")) {} else {
    echo "<script type='text/javascript'>
        alert('Le nom d\'utilisateur doit seulement contenir des tirets, des underscores, des lettres ou des chiffres.');
        window.location.href = 'https://defimaths.net/register.html';
    </script>";
    $conn -> close();
    exit();
}
    
if ($check_email_avalaible -> num_rows == 0) {} else {
    echo "<script type='text/javascript'>
        alert('Cette adresse email est déjà utilisée.');
        window.location.href = 'https://defimaths.net/register.html';
    </script>";
    $conn -> close();
    exit();
}

if ($conn -> query($create_account) === TRUE) {
    echo "<script type='text/javascript'>
        alert('Votre compte a été créé avec succès !');
        window.location.href = 'https://defimaths.net/login.html';
    </script>";
    $conn -> close();
    exit();
} else {
    echo "<script type='text/javascript'>
        alert('Une erreur s\'est produite lors de la création de votre compte. Veuillez réessayer.');
        window.location.href = 'https://defimaths.net/register.html';
    </script>";
    $conn -> close();
    exit();
}

?>