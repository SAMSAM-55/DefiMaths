import * as user from './user-information.js' 

export async function update_header() {
    const user_name_text = document.getElementById("user-name-text");
    const user_name = await user.get_user_name() || "Se connecter";
    const logged_in = await user.get_is_logged_in();
    console.log("User name : ", user_name);
    console.log("User logged in : ", logged_in);
    user_name_text.setAttribute("href", (!logged_in ? "login.html" : "account.html"));
    user_name_text.innerHTML = `<i class="fa-solid fa-user"></i> ${user_name}`;
}

document.addEventListener("DOMContentLoaded",() => {
    update_header();
});