<?php
// This file is used to set a new password for the user
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require __DIR__ . '/config.php';
session_start();

$conn = connectToDatabase();
$email = $_SESSION['user-email'];
$password = $_REQUEST['password'];
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

$req = "UPDATE `main` SET `password` = ? WHERE `main`.`email` = ?";
$delete_temp = "DELETE FROM `users_temp` WHERE `users_temp`.`email` = ?";
$stmt = $conn->prepare($req);
$stmt->bind_param("ss", $hashed_password, $email);
$delete_stmt = $conn->prepare($delete_temp);
$delete_stmt->bind_param("s", $email);
$delete_stmt->execute();

if ($stmt->execute() === TRUE) {
    $toast_type = 'success';
    $toast_title = 'Réinitialisation du mot de passe';
    $toast_message = "Votre mot de passe a bien été mis à jour.";

    $conn->close();
    $stmt->close();
    session_destroy();

    echo "<script type='text/javascript'>
            window.location.href = window.location.origin + '/login.html?toast=" . urlencode('true') . "&toast-type=" . urlencode($toast_type) . "&toast-title=" . urlencode($toast_title) . "&toast-message=" . urlencode($toast_message) . "';
    </script>";
    exit();
} else {
    $toast_type = 'error';
    $toast_title = 'Réinitialisation du mot de passe';
    $toast_message = "Une erreur est survenue lors de la mise à jour du mot de passe. Veuillez réessayer.";

    $conn->close();
    $stmt->close();
    session_destroy();

    echo "<script type='text/javascript'>
            window.location.href = window.location.origin + '/index.html?toast=" . urlencode('true') . "&toast-type=" . urlencode($toast_type) . "&toast-title=" . urlencode($toast_title) . "&toast-message=" . urlencode($toast_message) . "';
    </script>";
    exit();
}