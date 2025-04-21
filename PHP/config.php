<?php
// This is the configuration file for the database connection
$server_name = "your_server_name";
$database_id = "your_database_id";
$database_password = "your_database_password";
$database_name = "your_database_name";

// Configuration for the email used in the register and password reset process
$mail_domain = "your_mail_domain";
$mail_user = "your_email";
$mail_password = "your_email_password";

function connectToDatabase() {
    global $server_name, $database_id, $database_password, $database_name;
    $conn = new mysqli($server_name, $database_id, $database_password, $database_name);
    
    if ($conn->connect_error) {
        http_response_code(500); // Internal Server Error
        exit("Connection failed: " . $conn->connect_error);
    }
    
    return $conn;
}

// Functions to easily get the user information from email or id
function getUserInformationFromEmail($email) {
    $conn = connectToDatabase();
    $req = "SELECT * FROM `main` WHERE `main`.`email` = ?";
    $stmt = $conn->prepare($req);
    $stmt->bind_param("s", $email);
    $stmt->execute();

    $result = $stmt->get_result();
    $data = $result->num_rows > 0 ? $result->fetch_assoc() : false; // Return false if no result was found
    $stmt->close();
    $conn->close();
    return $data;
}

function getUserInformationFromID($id) {
    $conn = connectToDatabase();
    $req = "SELECT * FROM `main` WHERE `main`.`id` = ?";
    $stmt = $conn->prepare($req);
    $stmt->bind_param("i", $id);
    $stmt->execute();

    $result = $stmt->get_result();
    $data = $result->num_rows > 0 ? $result->fetch_assoc() : false; // Return false if no result was found
    $stmt->close();
    $conn->close();
    return $data;
}

//Request to create the database
// CREATE TABLE `your_database_name`.`main`
// (`id` INT(11) NOT NULL AUTO_INCREMENT , 
// `user_name` VARCHAR(255) NOT NULL , `password` VARCHAR(255) NOT NULL , 
// `email` VARCHAR(255) NOT NULL , 
// `progress` JSON NOT NULL , 
// PRIMARY KEY (`id`)) ENGINE = InnoDB;

// Request to create the table where the temporary information of the users are stored until email confirmation or expire
//CREATE TABLE users_temp (
//  email VARCHAR(255) NOT NULL UNIQUE,
//  username VARCHAR(100),
//  password_hash VARCHAR(255),
//  verification_token VARCHAR(64),
//  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//);