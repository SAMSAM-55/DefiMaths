import { get_is_logged_in } from './user-information.js';
import { update_header } from './update-header.js';

async function main() {
    console.log("Initialising user data...");
    const isLoggedIn = await get_is_logged_in();
    if (isLoggedIn === null || isLoggedIn === undefined) {

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
            if (data && data.user_name) {
                console.log("Received user name:", data.user_name);
                document.getElementById('user-name-text').innerHTML = `<i class="fa-solid fa-user"></i> ${data.user_name}`;
                console.log("Data received:", data);
                update_header();
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