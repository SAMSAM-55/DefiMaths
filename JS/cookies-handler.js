// This script is only use on the landing page (index.html) to show the cookies popup the first time the user arrives and then hide it

addEventListener("DOMContentLoaded", () => {
    if (!(sessionStorage.getItem("cookies_shown") === 'true')) {
        let cookies_container = document.querySelector(".cookies-container");
        cookies_container.classList.add("show");
        sessionStorage.setItem("cookies_shown", 'true');
    }
})