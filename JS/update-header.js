// This file is used to update the information displayed on the header menu
import * as user from './user-information.js' 

// Get the burgermenu on the page
const burger_menu = document.getElementsByClassName('burger-menu')[0]

// Main function to update the header information
// It uses the user-information file to fetch the information stocked with the php session and updates the headers to display the retrieved information.
export async function update_header() {
    const user_name_text = [document.getElementById("user-name-text"), document.getElementById("user-name-text-burger")];
    const user_name = await user.get_user_name() || "Se connecter"; // Ensure the username is a string
    const displayed_user_name = (user_name.length > 15 ? user_name.slice(0, 10) + "..." : user_name); // Do not the entire user_name if it is to long (more than 15 characters). You can change this value if you want. 
    const logged_in = await user.get_is_logged_in();
    user_name_text.forEach(element => {
        element.setAttribute("href", (!logged_in ? "login.html" : "account.html"));
        element.innerHTML = `<i class="fa-solid fa-user"></i> ${displayed_user_name}`;
    })
}

// Calls the main function when the page has loaded.
document.addEventListener("DOMContentLoaded",() => {
    update_header();
});

// Burger menu

document.addEventListener('click', (event) => {
    if (event.target.classList.contains('burger-menu-visibility-switch')) {
        burger_menu.classList.toggle("show");
    }
});