addEventListener("DOMContentLoaded", () => {
    const passwordInput = document.getElementById("password");
    const showPasswordEye = passwordInput.nextElementSibling;

    addEventListener("click", (event) => {
        if (event.target == showPasswordEye) {
            if (passwordInput.type === "password") {
                passwordInput.type = "text";
                showPasswordEye.classList.remove("fa-eye");
                showPasswordEye.classList.add("fa-eye-slash");
            } else {
                passwordInput.type = "password";
                showPasswordEye.classList.remove("fa-eye-slash");
                showPasswordEye.classList.add("fa-eye");
            }
        }
    });
});