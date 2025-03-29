import { initialise_user_infos } from './user-information.js';
import { get_is_loged_in } from './user-information.js';

function get_url_param(param) {
    let params = new URLSearchParams(window.location.search);
    return params.get(param)
}

async function main() {
    console.log("Initialising user data...");
    const isLoggedIn = get_is_loged_in();
    if (isLoggedIn === null || isLoggedIn === undefined) {
        let user_id = get_url_param('userid');
        if (!user_id) {
            console.error("User ID is missing in the URL parameters.");
            return;
        }
        const php_inputs = {
            "user_id": user_id
        };

        try {
            const response = await fetch('/PHP/get-user-data.php', {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                method: 'POST',
                body: JSON.stringify(php_inputs)
            });

            if (!response.ok) {
                console.error('Something went wrong, response:', response);
                return;
            }

            const data = await response.json();
            if (data && data.user_name) {
                console.log("Received user name:", data.user_name);
                document.getElementById('user-name-text').innerHTML = `<i class="fa-solid fa-user"></i> ${data.user_name}`;
                initialise_user_infos(data);
                console.log("Data received:", data);
            } else {
                console.error("Invalid data received:", data);
            }
        } catch (error) {
            console.error("An error occurred while fetching user data:", error);
        }
    } else {
        console.log("User is already logged in.");
        return;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    main();
});