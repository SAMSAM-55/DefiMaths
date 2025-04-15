// This script toggles the visibility of the password input field and changes the icon accordingly.

addEventListener("DOMContentLoaded", () => {
    // Getting the password input field and the eye icon element
    // The eye icon is the next sibling of the password input field.
    const passwordInput = document.getElementById("password");
    const showPasswordEye = passwordInput.nextElementSibling;

    //  Main function to toggle password visibility
    // This function is called when the eye icon is clicked.
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