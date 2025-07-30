document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const messageDiv = document.getElementById('message-div');
    const submitButton = registerForm.querySelector('button[type="submit"]'); // BARU: Ambil tombol
    
    const API_URL = 'http://localhost:3000/api/register';

    // BARU: Fungsi bantuan untuk mengubah status tombol
    const setButtonLoadingState = (isLoading) => {
        if (isLoading) {
            submitButton.disabled = true;
            submitButton.textContent = 'Membuat akun...';
        } else {
            submitButton.disabled = false;
            submitButton.textContent = 'Register';
        }
    };

    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        messageDiv.style.display = 'none';
        messageDiv.className = 'message';

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (password.length < 6) {
            messageDiv.textContent = 'Password minimal harus 6 karakter.';
            messageDiv.classList.add('error');
            messageDiv.style.display = 'block';
            return;
        }

        setButtonLoadingState(true); // DIUBAH: Aktifkan status loading

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const result = await response.json();

            if (!response.ok) {
                messageDiv.textContent = result.message || 'Terjadi kesalahan.';
                messageDiv.classList.add('error');
            } else {
                messageDiv.textContent = `Registrasi berhasil untuk user: ${result.username}`;
                messageDiv.classList.add('success');
                registerForm.reset();
            }
            messageDiv.style.display = 'block';

        } catch (error) {
            messageDiv.textContent = 'Tidak bisa terhubung ke server.';
            messageDiv.classList.add('error');
            messageDiv.style.display = 'block';
        } finally {
            setButtonLoadingState(false); // DIUBAH: Kembalikan tombol ke keadaan semula
        }
    });
});