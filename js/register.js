document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const messageDiv = document.getElementById('message-div');
    
    // Sesuaikan URL ini dengan alamat backend Anda
    const API_URL = 'https://backend-web-parfum.onrender.com/api/register';

    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Sembunyikan pesan sebelumnya
        messageDiv.style.display = 'none';
        messageDiv.textContent = '';
        messageDiv.className = 'message';

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (password.length < 6) {
            messageDiv.textContent = 'Password minimal harus 6 karakter.';
            messageDiv.classList.add('error');
            messageDiv.style.display = 'block';
            return;
        }

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
                messageDiv.textContent = result.message || 'Terjadi kesalahan.';
                messageDiv.classList.add('error');
            } else {
                // messageDiv.textContent = result.message;

                messageDiv.textContent = `Registrasi berhasil untuk user: ${result.username}`;

                messageDiv.classList.add('success');
                registerForm.reset(); // Kosongkan form setelah berhasil
            }
            messageDiv.style.display = 'block';

        } catch (error) {
            messageDiv.textContent = 'Tidak bisa terhubung ke server.';
            messageDiv.classList.add('error');
            messageDiv.style.display = 'block';
        }
    });
});