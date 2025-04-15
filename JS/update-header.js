// This file is used to update the information displayed on the header menu
import * as user from './user-information.js' 

// Main function to update the header information
// It uses the user-information file to fetch the information stocked with the php session and updates the headers to display the retrieved information.
export async function update_header() {
    const user_name_text = document.getElementById("user-name-text");
    const user_name = await user.get_user_name() || "Se connecter";
    const logged_in = await user.get_is_logged_in();
    user_name_text.setAttribute("href", (!logged_in ? "login.html" : "account.html"));
    user_name_text.innerHTML = `<i class="fa-solid fa-user"></i> ${user_name}`;
}

// Calls the main function when the page has loaded.
document.addEventListener("DOMContentLoaded",() => {
    update_header();
});