<?php
// This is the configuration file for the database connection
$server_name = "your_server_name";
$database_id = "your_database_id";
$database_password = "your_database_password";
$database_name = "your_database_name";

function connectToDatabase() {
    global $server_name, $database_id, $database_password, $database_name;
    $conn = new mysqli($server_name, $database_id, $database_password, $database_name);
    
    if ($conn->connect_error) {
        http_response_code(500); // Internal Server Error
        exit("Connection failed: " . $conn->connect_error);
    }
    
    return $conn;
}

//Request to create the database
// CREATE TABLE `your_database_name`.`main`
// (`id` INT(11) NOT NULL AUTO_INCREMENT , 
// `user_name` VARCHAR(255) NOT NULL , `password` VARCHAR(255) NOT NULL , 
// `email` VARCHAR(255) NOT NULL , 
// `progress` JSON NOT NULL , 
// PRIMARY KEY (`id`)) ENGINE = InnoDB;
