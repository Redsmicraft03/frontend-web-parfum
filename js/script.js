document.addEventListener('DOMContentLoaded', () => {
    
    const API_URL = 'https://backend-web-parfum.onrender.com/api/dashboard';
    const productGrid = document.getElementById('product-grid');

    // Fungsi untuk memformat harga ke Rupiah
    const formatCurrency = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(number);
    };

    // Fungsi untuk mengambil dan menampilkan produk
    const fetchAndRenderProducts = async () => {
        try {
            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error('Gagal memuat data produk.');
            }

            const result = await response.json();
            const products = result.data;

            // Kosongkan pesan "Memuat..."
            productGrid.innerHTML = '';

            if (!products || products.length === 0) {
                productGrid.innerHTML = '<p>Koleksi belum tersedia.</p>';
                return;
            }

            products.forEach(product => {
                const cardHTML = `
                    <div class="product-card">
                    <img src="${product.imageUrl}" alt="${product.name}">
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <p class="product-description">${product.description}</p> <p class="product-price">${formatCurrency(product.price)}</p>
                        <a href="${product.link}" class="btn-link" target="_blank" rel="noopener noreferrer">Pesan Sekarang</a>
                    </div>
                </div>
            `;
                productGrid.insertAdjacentHTML('beforeend', cardHTML);
            });

        } catch (error) {
            console.error('Error:', error);
            productGrid.innerHTML = `<p style="color: red;">${error.message}</p>`;
        }
    };

    // Panggil fungsi saat halaman dimuat
    fetchAndRenderProducts();
});