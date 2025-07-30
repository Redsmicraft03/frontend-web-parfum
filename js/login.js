document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const errorMessageDiv = document.getElementById('error-message');
    
    // Sesuaikan URL ini dengan alamat backend Anda
    const API_URL = 'https://el-jaziras-perfumery.vercel.app/api/login';

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Mencegah form mengirim secara default

        // Sembunyikan pesan error sebelumnya
        errorMessageDiv.style.display = 'none';
        errorMessageDiv.textContent = '';

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

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
                // Tampilkan pesan error dari backend
                errorMessageDiv.textContent = result.message || 'Terjadi kesalahan.';
                errorMessageDiv.style.display = 'block';
            } else {
                // Simpan token ke localStorage
                localStorage.setItem('token', result.token);
                alert('Login berhasil!');
                // Arahkan ke halaman admin dashboard (ganti jika perlu)
                window.location.href = 'admin.html'; 
            }
        } catch (error) {
            // Tangani error jaringan (misal: server mati)
            errorMessageDiv.textContent = 'Tidak bisa terhubung ke server.';
            errorMessageDiv.style.display = 'block';
        }
    });
});

