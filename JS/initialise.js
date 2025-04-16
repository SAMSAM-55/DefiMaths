// This file is used to initialise the user data when the page loads.
// It fetches the user data from the server and updates the header with the username via update header.js.
import { get_is_logged_in } from './user-information.js';
import { update_header } from './update-header.js';

// This function is called when the page loads to fetch user data and update the header.
// It checks if the user is logged in, and if not, it fetches the user data from the server and updates the header with the username.
async function main() {
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
                document.getElementById('user-name-text').innerHTML = `<i class="fa-solid fa-user"></i> ${data.user_name}`;
                await update_header();
            } else {
                console.error("Invalid data received:", data);
            }
        } catch (error) {
            console.error("An error occurred while fetching user data:", error);
        }
    } else {
        console.info("User is already logged in.");

    }
}

document.addEventListener("DOMContentLoaded", () => {
    main();
});