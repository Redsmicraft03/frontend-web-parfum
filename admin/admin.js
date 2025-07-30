document.addEventListener('DOMContentLoaded', () => {
    // === Konfigurasi & Inisialisasi ===
    const API_BASE_URL = 'https://backend-web-parfum.onrender.com/api/admin';
    const token = localStorage.getItem('token');
    
    if (!token) {
        window.location.href = '../login/login.html';
        return;
    }

    // === Variabel Global ===
    let allProducts = [];
    let productToDeleteId = null;

    // === Selektor DOM ===
    const productTableBody = document.getElementById('product-table-body');
    const addProductBtn = document.getElementById('add-product-btn');
    const logoutBtn = document.getElementById('logout-btn');
    
    // Modal & Form
    const modal = document.getElementById('form-modal');
    const modalTitle = document.getElementById('modal-title');
    const closeModalBtn = document.querySelector('.close-btn');
    const productForm = document.getElementById('product-form');
    
    // Modal Hapus
    const deleteModal = document.getElementById('delete-modal');
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    const cancelDeleteBtn = document.getElementById('cancel-delete-btn');

    // Tema
    const themeToggle = document.getElementById('theme-toggle');

    // === Fungsi Bantuan ===
    const setButtonLoadingState = (button, isLoading, originalText = 'Simpan') => {
        if (isLoading) {
            button.disabled = true;
            button.innerHTML = '<span class="spinner"></span>Memuat...';
        } else {
            button.disabled = false;
            button.innerHTML = originalText;
        }
    };

    const readFileAsBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    // === Fungsi Inti ===
    const fetchProducts = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Gagal mengambil data produk.');
            const result = await response.json();
            renderProducts(result.data);
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    const renderProducts = (products) => {
        allProducts = products || []; // Simpan data untuk edit
        productTableBody.innerHTML = '';
        if (allProducts.length === 0) {
            productTableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Tidak ada produk.</td></tr>';
            return;
        }

        products.forEach(product => {
            const price = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(product.price);
            const row = `
                <tr>
                    <td data-label="Gambar"><img src="${product.imageUrl}" alt="${product.name}"></td>
                    <td data-label="Nama Produk">${product.name}</td>
                    <td data-label="Deskripsi">${product.description}</td>
                    <td data-label="Harga">${price}</td>
                    <td data-label="Link"><a href="${product.link}" target="_blank">Lihat</a></td>
                    <td data-label="Aksi" class="actions">
                        <button class="btn btn-edit" data-id="${product.ID}">Edit</button>
                        <button class="btn btn-danger btn-delete" data-id="${product.ID}">Delete</button>
                    </td>
                </tr>
            `;
            productTableBody.insertAdjacentHTML('beforeend', row);
        });
    };
    
    // === Logika Form & Modal ===
    const showFormModal = (product = null) => {
        productForm.reset();
        if (product) {
            modalTitle.textContent = 'Edit Produk';
            document.getElementById('product-id').value = product.ID;
            document.getElementById('name').value = product.name;
            document.getElementById('description').value = product.description;
            document.getElementById('price').value = product.price;
            document.getElementById('link').value = product.link;
        } else {
            modalTitle.textContent = 'Tambah Produk Baru';
            document.getElementById('product-id').value = '';
        }
        modal.style.display = 'flex';
    };

    const hideFormModal = () => modal.style.display = 'none';
    const showDeleteModal = (id) => { productToDeleteId = id; deleteModal.style.display = 'flex'; };
    const hideDeleteModal = () => { deleteModal.style.display = 'none'; productToDeleteId = null; };

    // === Event Listeners ===
    addProductBtn.addEventListener('click', () => showFormModal());
    closeModalBtn.addEventListener('click', hideFormModal);
    
    productForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitButton = productForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        setButtonLoadingState(submitButton, true);

        try {
            const id = document.getElementById('product-id').value;
            const imageFile = document.getElementById('image').files[0];
            
            let imageData = '';
            if (imageFile) {
                imageData = await readFileAsBase64(imageFile);
            }

            const payload = {
                name: document.getElementById('name').value,
                description: document.getElementById('description').value,
                price: parseFloat(document.getElementById('price').value),
                link: document.getElementById('link').value,
                image_data: imageData,
                image_type: imageFile ? imageFile.type : ''
            };
            
            if (id && !imageFile) {
                delete payload.image_data;
                delete payload.image_type;
            }

            const method = id ? 'PATCH' : 'POST';
            const endpoint = id ? `${API_BASE_URL}/update-product/${id}` : `${API_BASE_URL}/create-product`;

            const response = await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Gagal menyimpan produk.');
            }

            hideFormModal();
            fetchProducts();
        } catch (error) {
            alert(error.message);
        } finally {
            setButtonLoadingState(submitButton, false, originalButtonText);
        }
    });

    productTableBody.addEventListener('click', (e) => {
        const target = e.target;
        const id = target.dataset.id;
        if (target.classList.contains('btn-edit')) {
            const product = allProducts.find(p => p.ID == id);
            if (product) showFormModal(product);
        }
        if (target.classList.contains('btn-delete')) {
            showDeleteModal(id);
        }
    });
    
    cancelDeleteBtn.addEventListener('click', hideDeleteModal);
    confirmDeleteBtn.addEventListener('click', async () => {
        if (!productToDeleteId) return;
        
        const originalButtonText = confirmDeleteBtn.innerHTML;
        setButtonLoadingState(confirmDeleteBtn, true, 'Ya, Hapus');

        try {
            const response = await fetch(`${API_BASE_URL}/delete-product/${productToDeleteId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Gagal menghapus produk.');
            hideDeleteModal();
            fetchProducts();
        } catch (error) {
            alert(error.message);
        } finally {
            setButtonLoadingState(confirmDeleteBtn, false, originalButtonText);
        }
    });

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = '../login/login.html';
    });
    
    // Logika Tema
    themeToggle.addEventListener('change', () => {
        if (themeToggle.checked) {
            document.body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        }
    });

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        themeToggle.checked = true;
        document.body.setAttribute('data-theme', 'dark');
    }

    // Panggilan Awal
    fetchProducts();
});