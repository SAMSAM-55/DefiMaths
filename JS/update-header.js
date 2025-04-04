document.addEventListener("DOMContentLoaded",() => {
    const user_name_text = document.getElementById("user-name-text");
    const user_name = sessionStorage.getItem("user_name") || "Se connecter";
    const loged_in = sessionStorage.getItem("loged_in") === "true"; //Convert the received string to a boolean
    console.log("User name : ", user_name);
    console.log("User loged in : ", loged_in);
    user_name_text.setAttribute("href", (!loged_in ? "login.html" : "account.html"));
    user_name_text.innerHTML = `<i class="fa-solid fa-user"></i> ${user_name}`;
});