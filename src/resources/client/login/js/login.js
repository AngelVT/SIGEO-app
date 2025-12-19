const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', async e => {
    e.preventDefault();

    try {
        const formData = new FormData(loginForm);

        const body = Object.fromEntries(formData);

        const res = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        const response = await res.json();

        if (res.ok) {
            window.location.href = '/dashboard';
            return;
        }

        if (!res.ok) {
            alert(`Access denied\n${response.msg}`);
            document.querySelector('#in_pass').value = '';
            return;
        }

        alert("Access denied");
    } catch (error) {
        console.error('Log in Error: ', error);
    }
});