// Cart Management System
let cart = [];

// Load cart from memory on page load
document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    updateCartCount();
    if (window.location.pathname.includes('cart.html')) {
        displayCartItems();
        updateOrderSummary();
    }
});

// Load cart from memory (in production, this will come from backend)
function loadCart() {
    const savedCart = localStorage.getItem('styleHubCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// Save cart to memory
function saveCart() {
    localStorage.setItem('styleHubCart', JSON.stringify(cart));
}

// Add item to cart
function addToCart(productId, productName, price, button) {
    // Get selected size
    const productCard = button.closest('.product-card');
    const sizeSelect = productCard.querySelector('.size-select');
    const selectedSize = sizeSelect ? sizeSelect.value : 'N/A';
    
    // Check if product already exists in cart
    const existingItem = cart.find(item => 
        item.id === productId && item.size === selectedSize
    );
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: price,
            size: selectedSize,
            quantity: 1,
            image: getProductImage(productId)
        });
    }
    
    saveCart();
    updateCartCount();
    showAddedNotification(productName);
}

// Get product image class
function getProductImage(productId) {
    return productId; // Returns the class name like 'jeans-1', 'shirt-2'
}

// Update cart count in navbar
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('#cart-count');
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });
}

// Show notification when item is added
function showAddedNotification(productName) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    notification.innerHTML = `
        <strong>✓ Added to cart!</strong><br>
        ${productName}
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Display cart items on cart page
function displayCartItems() {
    const cartContainer = document.getElementById('cart-items-container');
    const emptyMessage = document.getElementById('empty-cart-message');
    
    if (!cartContainer) return;
    
    if (cart.length === 0) {
        cartContainer.style.display = 'none';
        emptyMessage.style.display = 'block';
        return;
    }
    
    cartContainer.style.display = 'block';
    emptyMessage.style.display = 'none';
    
    cartContainer.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <div class="cart-item-image ${item.image}"></div>
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p>Size: ${item.size}</p>
                <p>Price: PKR ${item.price.toLocaleString()}</p>
            </div>
            <div class="cart-item-actions">
                <div class="quantity-control">
                    <button onclick="updateQuantity(${index}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${index}, 1)">+</button>
                </div>
                <div>
                    <strong>PKR ${(item.price * item.quantity).toLocaleString()}</strong>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
            </div>
        </div>
    `).join('');
}

// Update item quantity
function updateQuantity(index, change) {
    cart[index].quantity += change;
    
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    
    saveCart();
    updateCartCount();
    displayCartItems();
    updateOrderSummary();
}

// Remove item from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartCount();
    displayCartItems();
    updateOrderSummary();
}

// Update order summary
function updateOrderSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 5000 ? 0 : 250;
    const tax = subtotal * 0.05;
    const total = subtotal + shipping + tax;
    
    const subtotalEl = document.getElementById('subtotal');
    const shippingEl = document.getElementById('shipping');
    const taxEl = document.getElementById('tax');
    const totalEl = document.getElementById('total');
    
    if (subtotalEl) subtotalEl.textContent = `PKR ${subtotal.toLocaleString()}`;
    if (shippingEl) {
        shippingEl.textContent = shipping === 0 ? 'FREE' : `PKR ${shipping.toLocaleString()}`;
    }
    if (taxEl) taxEl.textContent = `PKR ${tax.toLocaleString()}`;
    if (totalEl) totalEl.textContent = `PKR ${total.toLocaleString()}`;
}

// Show checkout form
function showCheckoutForm() {
    if (cart.length === 0) {
        alert('Your cart is empty! Please add items before checkout.');
        return;
    }
    
    document.getElementById('checkout-form-section').style.display = 'block';
    document.getElementById('checkout-form-section').scrollIntoView({ behavior: 'smooth' });
}

// Hide checkout form
function hideCheckoutForm() {
    document.getElementById('checkout-form-section').style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Handle checkout form submission
function handleCheckout(event) {
    event.preventDefault();
    
    // Get form data
    const formData = new FormData(event.target);
    const orderData = {
        orderId: 'ORD-' + Date.now(),
        timestamp: new Date().toISOString(),
        customer: {
            fullName: formData.get('fullName'),
            email: formData.get('email'),
            phone: formData.get('phone')
        },
        shippingAddress: {
            address: formData.get('address'),
            city: formData.get('city'),
            state: formData.get('state'),
            postalCode: formData.get('postalCode'),
            country: formData.get('country')
        },
        paymentMethod: formData.get('paymentMethod'),
        notes: formData.get('notes') || 'None',
        items: cart,
        orderSummary: {
            subtotal: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            shipping: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) > 5000 ? 0 : 250,
            tax: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 0.05,
            total: calculateTotal()
        }
    };
    
    // In production, this data will be sent to backend API
    console.log('Order Data:', orderData);
    
    // Store order for demonstration (in production, this comes from backend)
    localStorage.setItem('lastOrder', JSON.stringify(orderData));
    
    // Show success modal
    showOrderConfirmation(orderData);
    
    // Clear cart
    cart = [];
    saveCart();
    updateCartCount();
}

// Calculate total
function calculateTotal() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 5000 ? 0 : 250;
    const tax = subtotal * 0.05;
    return subtotal + shipping + tax;
}

// Show order confirmation modal
function showOrderConfirmation(orderData) {
    const modal = document.getElementById('order-modal');
    const orderIdEl = document.getElementById('order-id');
    const orderDetailsEl = document.getElementById('order-details');
    
    orderIdEl.textContent = orderData.orderId;
    
    orderDetailsEl.innerHTML = `
        <h4>Order Summary:</h4>
        <p><strong>Customer:</strong> ${orderData.customer.fullName}</p>
        <p><strong>Email:</strong> ${orderData.customer.email}</p>
        <p><strong>Phone:</strong> ${orderData.customer.phone}</p>
        <p><strong>Shipping Address:</strong><br>
        ${orderData.shippingAddress.address}<br>
        ${orderData.shippingAddress.city}, ${orderData.shippingAddress.state} ${orderData.shippingAddress.postalCode}<br>
        ${orderData.shippingAddress.country}</p>
        <p><strong>Payment Method:</strong> ${orderData.paymentMethod.toUpperCase()}</p>
        <p><strong>Total Amount:</strong> PKR ${orderData.orderSummary.total.toLocaleString()}</p>
        <hr>
        <p><strong>Items Ordered:</strong></p>
        <ul>
            ${orderData.items.map(item => `
                <li>${item.name} (Size: ${item.size}) x ${item.quantity} = PKR ${(item.price * item.quantity).toLocaleString()}</li>
            `).join('')}
        </ul>
    `;
    
    modal.style.display = 'flex';
}

// Close modal and redirect
function closeModal() {
    document.getElementById('order-modal').style.display = 'none';
    window.location.href = 'index.html';
}

// CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);