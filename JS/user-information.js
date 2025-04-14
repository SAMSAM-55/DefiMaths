async function get_user_info() {
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

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("An error occurred while fetching user data:", error);
    }
}

export async function get_is_logged_in() {
    const userInfo = await get_user_info();
    return userInfo ? userInfo.logged_in : "false";
}

export async function get_user_email() {
    const userInfo = await get_user_info();
    return userInfo ? userInfo.user_email : null;
}

export async function get_user_name() {
    const userInfo = await get_user_info();
    return userInfo ? userInfo.user_name : null;
}

export function log_out() {
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

export async function delete_account() {
    
    if (!window.confirm("Voulez-vous vraiment supprimer votre compte ?")) {
        return;
    }

    try {
        const response = await fetch('/PHP/delete-user-account.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {

            console.error("An error occured during the request : ", response.statusText);

            // Toast notification details
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
        console.error("Error with fetch request : ", error);

        // Toast notification details
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

export async function get_user_progress(quiz_id) {
    const php_inputs = {
        "quiz-id": quiz_id
    };

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
        console.log(data);
        return data.progress || 0; // Return the progress or 0 if not found
    } catch (error) {
        console.error("Erreur lors de la requête fetch : ", error);
        return null;
    }
}

export async function update_user_progress(quiz_id, new_progress) {
    const php_inputs = {
        "quiz-id" : quiz_id,
        "quiz-progress" : new_progress
    };

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
        console.log(result)
        return;
    }

    catch (error) {
        console.log("Erreur lors de la requete fetch ", error);
        return null;
    }
    
}

window.get_user_progress = get_user_progress;
window.update_user_progress = update_user_progress;
window.get_is_logged_in = get_is_logged_in;
