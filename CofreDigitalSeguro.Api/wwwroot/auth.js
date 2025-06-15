
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');
    const loginView = document.getElementById('login-view');
    const registerView = document.getElementById('register-view');
    const errorMessage = document.getElementById('error-message');

    showRegisterLink.addEventListener('click', (e) => { e.preventDefault(); loginView.classList.add('hidden'); registerView.classList.remove('hidden'); errorMessage.textContent = ''; });
    showLoginLink.addEventListener('click', (e) => { e.preventDefault(); registerView.classList.add('hidden'); loginView.classList.remove('hidden'); errorMessage.textContent = ''; });

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        errorMessage.textContent = '';

        if (password.length < 12) {
            errorMessage.textContent = 'A senha mestra deve ter no mínimo 12 caracteres.';
            return;
        }

        try {
            const response = await fetch('/api/Auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                const err = await response.text();
                throw new Error(err || 'Falha ao registrar.');
            }

            alert('Registro realizado com sucesso! Por favor, faça o login.');
            window.location.reload();

        } catch (error) {
            errorMessage.textContent = error.message;
        }
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        errorMessage.textContent = '';

        try {
            const response = await fetch('/api/Auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Falha no login.');
            }

            const { accessToken } = await response.json();

            sessionStorage.setItem('accessToken', accessToken);
            sessionStorage.setItem('masterPassword', password);
            sessionStorage.setItem('userEmail', email);

            window.location.href = '/dashboard.html';

        } catch (error) {
            errorMessage.textContent = error.message;
        }
    });
});