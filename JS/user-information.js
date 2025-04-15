// This file is used to handles the user information in the php session

// Main function that retrieves all the stored information by fetching get-user-data.php
// @returns : The user information stored in the php session
async function get_user_info() {
    // Sends the fetch request to retrieve the user data from the server
    // The PHP script returns the user data in JSON format
    try {
        const response = await fetch('/PHP/get-user-data.php', {
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            method: 'POST',
        });

        if (!response.ok) {
            console.error('Something went wrong, response:', response);
            return;
        }

        // Returns the retrieved data
        const data = await response.json();

        return data;

    } catch (error) {
        console.error("An error occurred while fetching user data:", error);
    }
}

// This function retrieves wether the user is logged in or not from the PHP session
// @returns : The logged in status of the user stored in the PHP session
export async function get_is_logged_in() {
    const userInfo = await get_user_info();
    return userInfo ? userInfo.logged_in : "false";
}

// This function retrieves the user email from the PHP session
// @returns : The user email stored in the PHP session
export async function get_user_email() {
    const userInfo = await get_user_info();
    return userInfo ? userInfo.user_email : null;
}

// This function retrieves the username from the PHP session
// @returns : The username stored in the PHP session
export async function get_user_name() {
    const userInfo = await get_user_info();
    return userInfo ? userInfo.user_name : null;
}

// This function is used to log out the user
export function log_out() {
    // Sends the fetch request to log out the user
    // The PHP script destroys the session and logs out the user
    fetch('/PHP/log-out.php');

    // Toast notification details
    const toast_title = 'Déconnexion réussie';
    const toast_message = 'Vous avez bien été déconnecté';
    const url = new URL(window.location.origin + '/index.html'); // Dynamically construct the URL
    url.searchParams.append('toast', 'true');
    url.searchParams.append('toast-type', 'info');
    url.searchParams.append('toast-title', toast_title);
    url.searchParams.append('toast-message', toast_message);

    // Redirect to the index page with toast parameters
    window.location.href = url.toString();
}

// This function is used to delete the user account
export async function delete_account() {
    
    // Asks the user to confirm the deletion of the account
    if (!window.confirm("Voulez-vous vraiment supprimer votre compte ?")) {
        return;
    }

    // If the user confirms, sends the fetch request to delete the account
    // The PHP script deletes the user account and logs out the user
    try {
        const response = await fetch('/PHP/delete-user-account.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            // Display an error message if the request fails with a toast notification
            console.error("An error occured during the request : ", response.statusText);

            // Toast notification details
            // This is a generic error message, you can customize it based on the response status or content if needed
            const toast_title = 'Erreur';
            const toast_message = 'Une erreur interne est survenue lors de la suppression du compte';
            const url = new URL(window.location.origin + '/index.html'); // Dynamically construct the URL
            url.searchParams.append('toast', 'true');
            url.searchParams.append('toast-type', 'error');
            url.searchParams.append('toast-title', toast_title);
            url.searchParams.append('toast-message', toast_message);

            // Redirect to the index page with toast parameters
            window.location.href = url.toString();

            return;
        } else {
            // If the request is successful, we redirect the user to the index page with a success message
            // Toast notification details
            const toast_title = 'Compte supprimé';
            const toast_message = 'Votre compte a bien été suppprimé de DéfiMaths';
            const url = new URL(window.location.origin + '/index.html'); // Dynamically construct the URL
            url.searchParams.append('toast', 'true');
            url.searchParams.append('toast-type', 'success');
            url.searchParams.append('toast-title', toast_title);
            url.searchParams.append('toast-message', toast_message);

            // Redirect to the index page with toast parameters
            window.location.href = url.toString();

            return;
        }

    } catch (error) {
        // Display an error message if the request fails with a toast notification
        console.error("Error with fetch request : ", error);

        // Toast notification details
        // This is a generic error message, you can customize it based on the response status or content if needed
        const toast_title = 'Erreur';
        const toast_message = 'Une erreur interne est survenue lors de la suppression du compte';
        const url = new URL(window.location.origin + '/index.html'); // Dynamically construct the URL
        url.searchParams.append('toast', 'true');
        url.searchParams.append('toast-type', 'error');
        url.searchParams.append('toast-title', toast_title);
        url.searchParams.append('toast-message', toast_message);

        // Redirect to the index page with toast parameters
        window.location.href = url.toString();

        return;
    }
}

// This function retrieves the user progress for a specific quiz from the PHP session
// @param quiz_id : The id of the quiz to retrieve the progress for
// @returns : The user progress for the specified quiz stored in the PHP session
// If the user is not logged in, it returns null
export async function get_user_progress(quiz_id) {
    // The inputs to send to the PHP script
    const php_inputs = {
        "quiz-id": quiz_id
    };

    // Sends the fetch request to retrieve the user progress from the server
    // The PHP script returns the user progress in JSON format
    try {
        const response = await fetch('/PHP/get-user-quiz-progress.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(php_inputs)
        });

        if (!response.ok) {
            console.error("Une erreur est survenue lors de la requête : ", response.statusText);
            return null;
        }

        const data = await response.json();
        return data.progress || 0; // Return the progress or 0 if not found
    } catch (error) {
        console.error("Erreur lors de la requête fetch : ", error);
        return null;
    }
}

// This function updates the user progress for a specific quiz in the PHP session
// @param quiz_id : The id of the quiz to update the progress for
// @param new_progress : The new progress value to set for the quiz
// @returns : null
export async function update_user_progress(quiz_id, new_progress) {
    // The inputs to send to the PHP script
    // The progress is a number between 0 and max_progress*10, here max_progress = 110% so 0 <= new_progress <= 1100 (percentage rounded to one digit after the decimal point)  
    const php_inputs = {
        "quiz-id" : quiz_id,
        "quiz-progress" : new_progress
    };

    // Sends the fetch request to update the user progress on the server
    // The PHP script updates the user progress in the database
    try {
        const response = await fetch('/PHP/update-user-quiz-progress.php', {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify(php_inputs)
        });

        if (!response.ok) {
            console.error("Une erreur est survenue lors de la requête : ", response.statusText);
            return null;
        }
        const result = await response.json();
        return null;
    }

    catch (error) {
        console.error("Erreur lors de la requete fetch ", error);
        return null;
    }
    
}

// Makes the functions available in the global scope
window.get_user_progress = get_user_progress;
window.update_user_progress = update_user_progress;
window.get_is_logged_in = get_is_logged_in;
