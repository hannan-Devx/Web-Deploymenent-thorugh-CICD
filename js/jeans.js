async function loadProducts() {
    const loading = document.getElementById('loading');
    const productsSection = document.getElementById('products-section');
    const errorMessage = document.getElementById('error-message');
    const productsGrid = document.getElementById('jeans-products');

    try {
        loading.style.display = 'block';
        productsSection.style.display = 'none';
        errorMessage.style.display = 'none';

        // Backend se jeans products fetch karo
        const response = await apiService.getProductsByCategory('jeans');

        const products = Array.isArray(response)
            ? response
            : response.data || [];

        if (products.length === 0) {
            throw new Error('No products found');
        }

        productsGrid.innerHTML = products.map(product => `
            <div class="product-card" data-product-id="${product.productId}">
                <div class="product-image ${product.imageClass}"></div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="price">PKR ${product.price.toLocaleString()}</p>
                    <p class="description">${product.description}</p>
                </div>
            </div>
        `).join('');

        loading.style.display = 'none';
        productsSection.style.display = 'block';

    } catch (error) {
        console.error('Error loading products:', error);
        loading.style.display = 'none';
        errorMessage.style.display = 'block';
        document.getElementById('error-text').textContent =
            error.message + ' (Check browser console for details)';
    }
}
