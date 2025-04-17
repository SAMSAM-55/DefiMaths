<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require __DIR__ . '/config.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

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

$conn = connectToDatabase();
$check_email_avalaible = "SELECT * FROM `main` WHERE `main`.`email` = ?";
$check_email_stmt = $conn -> prepare($check_email_avalaible);
$check_email_stmt -> bind_param("s", $email);
$hashed_password = password_hash($password, PASSWORD_DEFAULT);
$token = bin2hex(random_bytes(32));
$create_account = "INSERT INTO `users_temp` (username, email, password_hash, verification_token) VALUES('$user_name', '$email', '$hashed_password', '$token')";

if ($conn -> query("SELECT * FROM `users_temp` WHERE `users_temp`.email = '$email'")->num_rows > 0) {
    $delete_temp = "DELETE FROM `users_temp` WHERE `users_temp`.`email` = ?";
    $delete_stmt = $conn -> prepare($delete_temp);
    $delete_stmt -> bind_param("s", $email);
    $delete_stmt -> execute();
    $delete_stmt->close();
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $toast_type = 'warning';
    $toast_title = 'Email incorrecte';
    $toast_message = 'Veuillez entrer un email valide';
    $conn->close();
    echo "<script type='text/javascript'>
        window.location.href = window.location.origin + '/register.html?toast=" . urlencode('true') . "&toast-type=" . urlencode($toast_type) . "&toast-title=" . urlencode($toast_title) . "&toast-message=" . urlencode($toast_message) . "';
    </script>";
    $conn -> close();
    exit();
}

if (!preg_match("/^[a-zA-Z0-9-._]*$/", "$user_name")) {
    $toast_type = 'warning';
    $toast_title = "Nom d'utilisateur incorrect";
    $toast_message = "Le nom d'utilisateur doit uniquement contenir des lettres, des chiffres, des points, des tirets et des underscores";
    $conn->close();
    echo "<script type='text/javascript'>
        window.location.href = window.location.origin + '/register.html?toast=" . urlencode('true') . "&toast-type=" . urlencode($toast_type) . "&toast-title=" . urlencode($toast_title) . "&toast-message=" . urlencode($toast_message) . "';
    </script>";
    $conn -> close();
    exit();
}
    
if (!($check_email_stmt -> execute() && $check_email_stmt -> get_result() -> num_rows === 0)) {
    $toast_type = 'warning';
    $toast_title = 'Email indisponnible';
    $toast_message = 'Un compte utilise déjà cet email.';
    $conn->close();
    echo "<script type='text/javascript'>
        window.location.href = window.location.origin + '/register.html?toast=" . urlencode('true') . "&toast-type=" . urlencode($toast_type) . "&toast-title=" . urlencode($toast_title) . "&toast-message=" . urlencode($toast_message) . "';
    </script>";
    $conn -> close();
    exit();
}

if ($conn -> query($create_account) === TRUE) {
    $toast_type = 'info';
    $toast_title = 'Création du compte';
    $toast_message = 'Pour finaliser la création de votre compte, veuillez vérifier votre email. Consulter votre boite de réception.';
    $conn->close();

    $mail = new PHPMailer(true);
    $link = "https://dev.defimaths.net/PHP/confirm-email.php?token=" . urlencode($token) . "&email=" . urlencode($email);

    try {
        // Setup for the email (replace the placeholders values with valid ones)
        $mail->isSMTP();
        $mail->Host = 'your_mail_domain';
        $mail->SMTPAuth = true;
        $mail->Username = 'your_email';
        $mail->Password = 'your_password';
        $mail->SMTPSecure = 'ssl';
        $mail->Port = 465;

        $mail->setFrom('your_email', 'Your site name');
        $mail->addAddress($email);

        $mail->Subject = 'Verification de votre compte';
        $mail->Body    = "Bonjour $user_name,\nMerci de votre inscription à DéfiMaths. Pour finaliser la création de votre compte veuillez cliquer sur le lien ci-dessous : \n$link\nCe lien expirera dans quinze minutes\n\nMerci de ne pas répondre à cet e-mail.";

        $mail->send();
    } catch (Exception $e) {
        $toast_type = 'error';
        $toast_title = 'Création du compte';
        $toast_message = "Une erreur est lors de l'envoie de l'email de confirmation";
    }

    echo "<script type='text/javascript'>
        window.location.href = window.location.origin + '/index.html?toast=" . urlencode('true') . "&toast-type=" . urlencode($toast_type) . "&toast-title=" . urlencode($toast_title) . "&toast-message=" . urlencode($toast_message) . "';
    </script>";
    exit();
} else {
    $toast_type = 'error';
    $toast_title = 'Erreur';
    $toast_message = "Votre compte n'a pas pu être créé. Veuillez réessayer.";
    $conn->close();

    echo "<script type='text/javascript'>
        window.location.href = window.location.origin + '/register.html?toast=" . urlencode('true') . "&toast-type=" . urlencode($toast_type) . "&toast-title=" . urlencode($toast_title) . "&toast-message=" . urlencode($toast_message) . "';
    </script>";
    $conn -> close();
    exit();
}
