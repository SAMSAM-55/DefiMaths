<?php
// This file is used to send a link via email to the user to reset his password
ini_set("display_errors", 1);
error_reporting(E_ALL);

require __DIR__ . '/config.php';

require 'vendor/autoload.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$email = $_REQUEST['email'];
$token = bin2hex(random_bytes(32));

$conn = connectToDatabase();
$req = "INSERT INTO `users_temp` (email, password_hash, verification_token) VALUES (?, '', ?)";
$delete_temp = "DELETE FROM `users_temp` WHERE `users_temp`.`email` = ?";
$stmt = $conn->prepare($req);
$stmt->bind_param("ss",$email,  $token);
$delete_stmt = $conn->prepare($delete_temp);
$delete_stmt->bind_param("s",$email, );
$delete_stmt->execute();
$delete_stmt->close();

if ($user = getUserInformationFromEmail($email)) {
    $user_name = $user['user_name'];

    $mail = new PHPMailer(true);

    $link = "https://dev.defimaths.net/PHP/password-reset.php?email=" . urlencode($email) . "&token=" . urlencode($token);

    try {
        $mail->isSMTP();
        $mail->CharSet = "UTF-8";
        $mail->Host = $mail_domain;
        $mail->SMTPAuth = true;
        $mail->Username = $mail_user;
        $mail->Password = $mail_password;
        $mail->SMTPSecure = 'ssl';
        $mail->Port = 465;

        $mail->setFrom($mail_user, 'DéfiMaths');
        $mail->addAddress($email);

        $mail->Subject = 'Réinitialisation du mot de passe';
        $mail->Body    = "Bonjour $user_name,\nPour réinitialiser votre mot passe, veuillez cliquer sur le lien ci-dessous : \n$link\nCe lien expirera dans quinze minutes\n\nMerci de ne pas répondre à cet e-mail.";

        $mail->send();
        $stmt->execute();
        $stmt->close();
        $conn->close();
    } catch (Exception $e) {
        die($e->getMessage());
    }
}

$toast_type = 'info';
$toast_title = 'Réinitialisation du mot de passe';
$toast_message = "Un lien de réinitialisation vous a été envoyé si votre compte existe";

echo "<script type='text/javascript'>
        window.location.href = window.location.origin + '/index.html?toast=" . urlencode('true') . "&toast-type=" . urlencode($toast_type) . "&toast-title=" . urlencode($toast_title) . "&toast-message=" . urlencode($toast_message) . "';
</script>";
exit();