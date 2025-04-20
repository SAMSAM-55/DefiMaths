// This script is used to assign click events to the different icons used across the site such as paswword visibility toggle or clipboard copy icon

addEventListener("DOMContentLoaded", () => {
    // Getting the password input field and the eye icon element
    // The eye icon is the next sibling of the password input field.
    const passwordInput = document.getElementById("password-login") || document.getElementById("password-register");
    const showPasswordEye = passwordInput ? passwordInput.nextElementSibling : null;

    // Script to toggle the password visibility
    // This function is called when the eye icon is clicked.
    if (showPasswordEye) {
        showPasswordEye.addEventListener('click', () => {
            if (passwordInput.type === "password") {
                passwordInput.type = "text";
                showPasswordEye.classList.remove("fa-eye");
                showPasswordEye.classList.add("fa-eye-slash");
            } else {
                passwordInput.type = "password";
                showPasswordEye.classList.remove("fa-eye-slash");
                showPasswordEye.classList.add("fa-eye");
            }
        });
    }

    // Part for the clipboard copy
    const copy_icons = Array.from(document.getElementsByClassName('clipboard-copy'));
    copy_icons.forEach((icon) => {
        icon.addEventListener('click', async () => {
            let value = icon.previousElementSibling.value; // Get the current value of the text input next to the icon
            await navigator.clipboard.writeText(String(value));
            icon.classList.remove('fa-clipboard');
            icon.classList.add('fa-clipboard-check');

            setTimeout(() => {
                icon.classList.remove('fa-clipboard-check');
                icon.classList.add('fa-clipboard');
            }, 1500);
        });
    });
});