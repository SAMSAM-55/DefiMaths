export async function login() {
    const form = document.getElementById('login-form');
    const formData = new FormData(form);

    const php_inputs = {
        "email": formData.get('email'),
        "password": formData.get('password')
    };

    try {
        const response = await fetch('/PHP/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(php_inputs)
        });

        if (!response.ok) {
            console.error("Une erreur est survenue lors de la requête : ", response.statusText);
            return null;
        }

        const data = await response.json();
        console.log(data);

        if (data.success) {
            sessionStorage.setItem('user_id', data.user_id);
            window.location.href = '/HTML/home.html';
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error("Erreur lors de la requête fetch : ", error);
    }
}