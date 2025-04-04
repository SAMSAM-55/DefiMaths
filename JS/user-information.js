let user_email = null;
let user_name = null;
let user_progress = null;
let user_id = null;
let isLogedIn = false;

export function initialise_user_infos(data) {
    user_email = data.email;
    user_name = data.user_name;
    user_progress = data.progress;
    user_id = data.id;
    isLogedIn = true;
    sessionStorage.setItem('loged_in', isLogedIn);
    sessionStorage.setItem('user_email', user_email);
    sessionStorage.setItem('user_name', user_name);
    sessionStorage.setItem('user_id', user_id);
}

export function get_user_email() {
    return sessionStorage.getItem('user_email');
}

export function get_user_name() {
    return sessionStorage.getItem('user_name');
}

export function get_is_loged_in() {
    return sessionStorage.getItem('loged_in');
}

export function log_out() {
    user_email = null;
    user_name = null;
    user_progress = null;
    user_id = null;
    isLogedIn = false;
    sessionStorage.removeItem('loged_in');
    sessionStorage.removeItem('user_email');
    sessionStorage.removeItem('user_name');
    sessionStorage.removeItem('user_id');
    window.location.href = "index.html";
}

export async function delete_account() {
    
    
    const php_inputs = {
        "user-id": parseInt(sessionStorage.getItem('user_id'))
    };

    log_out();

    try {
        const response = await fetch('/PHP/delete-user-account.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(php_inputs)
        });

        if (!response.ok) {
            console.error("An error occured during the request : ", response.statusText);
            return;
        }

    } catch (error) {
        console.error("Error with fetch request : ", error)
        return;
    }
}

export async function get_user_progress(quiz_id) {
    const php_inputs = {
        "user-id": parseInt(sessionStorage.getItem('user_id')),
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
        "user-id" : sessionStorage.getItem('user_id'),
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
window.get_is_loged_in = get_is_loged_in;
