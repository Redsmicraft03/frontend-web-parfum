document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const errorMessageDiv = document.getElementById('error-message');
    const submitButton = loginForm.querySelector('button[type="submit"]'); // Ambil tombol login

    const API_URL = 'https://backend-web-parfum.onrender.com/api/login';

    // Fungsi bantuan untuk mengubah status tombol
    const setButtonLoadingState = (isLoading) => {
        if (isLoading) {
            submitButton.disabled = true;
            submitButton.textContent = 'Sabar, lg proses...';
        } else {
            submitButton.disabled = false;
            submitButton.textContent = 'Login';
        }
    };

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        errorMessageDiv.style.display = 'none';
        errorMessageDiv.textContent = '';

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        setButtonLoadingState(true); // Aktifkan status loading

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const result = await response.json();

            if (!response.ok) {
                errorMessageDiv.textContent = result.message || 'Terjadi kesalahan.';
                errorMessageDiv.style.display = 'block';
            } else {
                localStorage.setItem('token', result.token);
                alert('Login berhasil!');
                window.location.href = 'admin.html';
            }
        } catch (error) {
            errorMessageDiv.textContent = 'Tidak bisa terhubung ke server.';
            errorMessageDiv.style.display = 'block';
        } finally {
            setButtonLoadingState(false); // Selalu kembalikan tombol ke keadaan semula
        }
    });
});