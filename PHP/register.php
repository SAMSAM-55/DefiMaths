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
    $toast_type = 'warning';
    $toast_title = 'Email incorrecte';
    $toast_message = 'Veuillez entrer un email valide';
    $conn->close();
    echo "<script type='text/javascript'>
        window.location.href = 'https://defimaths.net/register.html?toast=" . urlencode('true') . "&toast-type=" . urlencode($toast_type) . "&toast-title=" . urlencode($toast_title) . "&toast-message=" . urlencode($toast_message) . "';
    </script>";
    $conn -> close();
    exit();
}

if (preg_match("/^[a-zA-Z0-9-._]*$/", "$user_name")) {} else {
    $toast_type = 'warning';
    $toast_title = "Nom d'utilisateur incorrect";
    $toast_message = "Le nom d'utilisateur doit uniquement contenir des lettres, des chiffres, des points, des tirets et des underscores";
    $conn->close();
    echo "<script type='text/javascript'>
        window.location.href = 'https://defimaths.net/register.html?toast=" . urlencode('true') . "&toast-type=" . urlencode($toast_type) . "&toast-title=" . urlencode($toast_title) . "&toast-message=" . urlencode($toast_message) . "';
    </script>";
    $conn -> close();
    exit();
}
    
if ($check_email_avalaible -> num_rows == 0) {} else {
    $toast_type = 'warning';
    $toast_title = 'Email indisponnible';
    $toast_message = 'Un compte utilise déjà cet email.';
    $conn->close();
    echo "<script type='text/javascript'>
        window.location.href = 'https://defimaths.net/register.html?toast=" . urlencode('true') . "&toast-type=" . urlencode($toast_type) . "&toast-title=" . urlencode($toast_title) . "&toast-message=" . urlencode($toast_message) . "';
    </script>";
    $conn -> close();
    exit();
}

if ($conn -> query($create_account) === TRUE) {
    $toast_type = 'success';
    $toast_title = 'Création du compte';
    $toast_message = 'Votre compte a été créé avec succès. Vous pouvez maintenant vous y connecter';
    $conn->close();
    echo "<script type='text/javascript'>
        window.location.href = 'https://defimaths.net/login.html?toast=" . urlencode('true') . "&toast-type=" . urlencode($toast_type) . "&toast-title=" . urlencode($toast_title) . "&toast-message=" . urlencode($toast_message) . "';
    </script>";
    $conn -> close();
    exit();
} else {
    $toast_type = 'error';
    $toast_title = 'Erreur';
    $toast_message = "Votre compte n'a pas pu être créé. Veuillez réessayer.";
    $conn->close();
    echo "<script type='text/javascript'>
        window.location.href = 'https://defimaths.net/register.html?toast=" . urlencode('true') . "&toast-type=" . urlencode($toast_type) . "&toast-title=" . urlencode($toast_title) . "&toast-message=" . urlencode($toast_message) . "';
    </script>";
    $conn -> close();
    exit();
}

?>