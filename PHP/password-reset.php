<?php
// This file is used to check if the password reset link is correct and then redirect the user to the page to set a new password

require __DIR__ . '/config.php';
session_start();

$email = $_GET['email'];
$token = $_GET['token'];

$conn = connectToDatabase();
$req = "SELECT * FROM `users_temp` WHERE `users_temp`.`email` = ?";
$stmt = $conn->prepare($req);
$stmt->bind_param("s", $email);
$stmt->execute();

if (!($stmt->execute()) || $stmt->affected_rows == 0) {
    $toast_type = 'error';
    $toast_title = 'Rénitialisation du mot de passe';
    $toast_message = 'Le lien est invalide';
    $conn->close();
    $stmt->close();

    echo "<script type='text/javascript'>
        window.location.href = window.location.origin + '/index.html?toast=" . urlencode('true') . "&toast-type=" . urlencode($toast_type) . "&toast-title=" . urlencode($toast_title) . "&toast-message=" . urlencode($toast_message) . "';
    </script>";
    exit(1);
}

$result = $stmt->get_result()->fetch_assoc();
$validation_token = $result['verification_token'];

if ($validation_token != $token) {
    $toast_type = 'error';
    $toast_title = 'Rénitialisation du mot de passe';
    $toast_message = 'Le lien est invalide';
    $conn->close();
    $stmt->close();

    echo "<script type='text/javascript'>
        window.location.href = window.location.origin + '/index.html?toast=" . urlencode('true') . "&toast-type=" . urlencode($toast_type) . "&toast-title=" . urlencode($toast_title) . "&toast-message=" . urlencode($toast_message) . "';
    </script>";
    exit(1);
}

$created_at = $result['created_at'];

if (((new DateTime())->getTimestamp() - (new DateTime($created_at))->getTimestamp()) > 750) {
    $toast_type = 'error';
    $toast_title = 'Rénitialisation du mot de passe';
    $toast_message = 'Le lien a expiré';
    
    $delete_temp = "DELETE `users_temp` WHERE `users_temp`.`email` = ?";
    $delete_stmt = $conn->prepare($delete_temp);
    $delete_stmt->execute();
    $delete_stmt->close();
    
    $stmt->close();
    $conn->close();

    echo "<script type='text/javascript'>
        window.location.href = window.location.origin + '/index.html?toast=" . urlencode('true') . "&toast-type=" . urlencode($toast_type) . "&toast-title=" . urlencode($toast_title) . "&toast-message=" . urlencode($toast_message) . "';
    </script>";
    exit(1);
}

$toast_type = 'success';
$toast_title = 'Rénitialisation du mot de passe';
$toast_message = 'Le lien est valide, veuillez entrer votre nouveau mot de passe';
$_SESSION['user-email'] = $email;
$conn->close();
$stmt->close();

echo "<script type='text/javascript'>
    window.location.href = window.location.origin + '/reset-password.html?toast=" . urlencode('true') . "&toast-type=" . urlencode($toast_type) . "&toast-title=" . urlencode($toast_title) . "&toast-message=" . urlencode($toast_message) . "';
</script>";
exit(1);