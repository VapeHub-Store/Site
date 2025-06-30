// Sample product data
const products = [
    {
        id: 1,
        name: "Vaporesso Gen X Kit",
        price: 56.99,
        description: "Modern and sleek vaping device with advanced features",
        image: "images/vaporesso-gen-x.jpg",
        category: "Mods"
    },
    {
        id: 2,
        name: "Smok Nord 4 Pod Kit",
        price: 46.99,
        description: "Compact pod system with excellent flavor",
        image: "images/smok-nord-4.jpg",
        category: "Pod Systems"
    },
    {
        id: 3,
        name: "Aspire PockeX 2",
        price: 35.99,
        description: "Portable and powerful pod device",
        image: "images/aspire-pockex-2.jpg",
        category: "Pod Systems"
    },
    {
        id: 4,
        name: "Geek Vape Aegis Legend 2",
        price: 94.99,
        description: "Durable and feature-rich vaping device",
        image: "images/geekvape-aegis-legend-2.jpg",
        category: "Mods"
    },
    {
        id: 5,
        name: "Geekbar Pulse X Disposable Vape (9000 Puffs)",
        price: 25.99,
        description: "Flavorful and rechargeable disposable vape.",
        image: "images/Geekbar-Pulse.jpg",
        category: "Mods"
    }
    
];

// Initialize cart
let cart = {};

// Calculate total price
function calculateTotal() {
    return Object.values(cart).reduce((sum, item) => {
        const product = products.find(p => p.id === item.id);
        return sum + (product ? product.price * item.quantity : 0);
    }, 0);
}

// Update cart count in header
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    const totalItems = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    console.log('Cart count updated:', totalItems);
}

// Add item to cart
function addToCart(productId, event) {
    console.log('Adding to cart:', productId);
    const product = products.find(p => p.id === productId);
    if (!product) {
        console.error('Product not found:', productId);
        return;
    }

    if (!cart[productId]) {
        cart[productId] = { id: productId, quantity: 1 };
    } else {
        cart[productId].quantity++;
    }

    updateCart();
    updateCartCount();

    // Create a floating cart icon animation
    if (event) {
        const cartIcon = document.createElement('div');
        cartIcon.className = 'floating-cart';
        cartIcon.innerHTML = '<i class="fas fa-shopping-cart"></i>';
        cartIcon.style.left = event.clientX + 'px';
        cartIcon.style.top = event.clientY + 'px';
        document.body.appendChild(cartIcon);
        
        // Animate the cart icon to the top right
        cartIcon.style.position = 'fixed';
        cartIcon.style.transform = 'translate(0, 0)';
        cartIcon.style.opacity = '1';
        
        setTimeout(() => {
            cartIcon.style.transform = 'translate(300px, -300px)';
            cartIcon.style.opacity = '0';
        }, 100);
        
        setTimeout(() => cartIcon.remove(), 1000);
    }
    
    // Show success message
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.textContent = `${product.name} added to cart!`;
    document.body.appendChild(successMessage);
    
    setTimeout(() => successMessage.remove(), 2000);
}

// Update quantity
function updateQuantity(productId, change) {
    if (!cart[productId]) return;
    
    const currentQuantity = cart[productId].quantity;
    const newQuantity = currentQuantity + change;
    
    if (newQuantity < 1) {
        delete cart[productId];
    } else {
        cart[productId].quantity = newQuantity;
    }
    
    updateCart();
    updateCartCount();
}

// Remove item from cart
function removeFromCart(productId) {
    if (cart[productId]) {
        delete cart[productId];
        updateCart();
        updateCartCount();
    }
}

// Update cart display
function handleRemoveItem(e) {
    const button = e.currentTarget;
    const productId = parseInt(button.dataset.id);
    if (productId && cart[productId]) {
        delete cart[productId];
        updateCart();
        updateCartCount();
    }
}

function updateCart() {
    const cartSection = document.querySelector('.cart-section');
    if (!cartSection) return;

    const cartItems = cartSection.querySelector('.cart-items');
    const emptyCart = cartItems.querySelector('.empty-cart');
    const checkoutButton = cartSection.querySelector('.checkout-btn');
    const cartTotal = cartSection.querySelector('.total-price');

    cartItems.innerHTML = '';

    if (Object.keys(cart).length === 0) {
        if (emptyCart) emptyCart.style.display = 'block';
        if (checkoutButton) {
            checkoutButton.disabled = true;
            checkoutButton.style.opacity = '0.5';
        }
        if (cartTotal) cartTotal.textContent = '$0.00';
        return;
    }

    if (emptyCart) emptyCart.style.display = 'none';
    if (checkoutButton) {
        checkoutButton.disabled = false;
        checkoutButton.style.opacity = '1';
    }

    let total = 0;
    Object.values(cart).forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (product) {
            total += product.price * item.quantity;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <h4>${product.name}</h4>
                    <p>Quantity: ${item.quantity}</p>
                    <p>Price: $${(product.price * item.quantity).toFixed(2)}</p>
                </div>
                <button class="remove-item" data-id="${product.id}">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            cartItems.appendChild(cartItem);
        }
    });

    if (cartTotal) cartTotal.textContent = `$${total.toFixed(2)}`;

    // Remove existing event listeners
    document.querySelectorAll('.remove-item').forEach(button => {
        button.removeEventListener('click', handleRemoveItem);
    });

    // Add new event listeners
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', handleRemoveItem);
    });

    // Show cart if it's not already visible
    if (!cartSection.classList.contains('active')) {
        cartSection.classList.add('active');
        
        // Show overlay when cart opens
        const cartOverlay = document.querySelector('.cart-overlay');
        if (cartOverlay) {
            cartOverlay.classList.add('active');
        }
    }

    updateCartCount();
}

// Show checkout form
function showCheckoutForm() {
    const checkoutFormContainer = document.getElementById('checkoutFormContainer');
    const cartContent = document.querySelector('.cart-content');
    const cartHeader = document.querySelector('.cart-header h2');
    const cartSection = document.querySelector('.cart-section');
    const closeCart = document.querySelector('.close-cart');
    const form = document.getElementById('checkoutForm');
    
    if (checkoutFormContainer && cartContent && cartHeader && cartSection) {
        cartContent.style.display = 'none';
        cartHeader.textContent = 'Checkout';

        if (closeCart) {
            closeCart.textContent = '← Back to Cart';
        }

        checkoutFormContainer.style.display = 'block';
        checkoutFormContainer.classList.add('active');
        cartSection.style.height = 'auto';

        if (form) {
            const steps = form.querySelectorAll('.form-step');
            let currentStep = 0;

            // Show first step
            steps.forEach((step, index) => {
                step.classList.remove('active');
                if (index === 0) step.classList.add('active');
            });

            // 🔥 Move this INSIDE to access `steps`
            function validateStep(stepIndex) {
                const step = steps[stepIndex];
                const inputs = step.querySelectorAll('input[required], select[required]');

                let isValid = true;
                inputs.forEach(input => {
                    if (!input.value) {
                        isValid = false;
                        input.classList.add('error');
                    } else {
                        input.classList.remove('error');
                    }
                });

                return isValid;
            }

            form.addEventListener('click', (e) => {
                if (e.target.classList.contains('next-step')) {
                    if (validateStep(currentStep)) {
                        steps[currentStep].classList.remove('active');
                        currentStep++;
                        steps[currentStep].classList.add('active');
                    }
                } else if (e.target.classList.contains('prev-step')) {
                    steps[currentStep].classList.remove('active');
                    currentStep--;
                    steps[currentStep].classList.add('active');
                }
            });

            form.addEventListener('submit', (e) => {
                e.preventDefault();
                if (validateStep(currentStep)) {
                    console.log('Form submitted:', new FormData(form));
                }
            });
        }
    }
}


    function validateStep(stepIndex) {
        const step = steps[stepIndex];
        const inputs = step.querySelectorAll('input[required], select[required]');
        
        let isValid = true;
        inputs.forEach(input => {
            if (!input.value) {
                isValid = false;
                input.classList.add('error');
            } else {
                input.classList.remove('error');
            }
        });
        
        return isValid;
    }

function showCart() {
    const checkoutFormContainer = document.getElementById('checkoutFormContainer');
    if (checkoutFormContainer) {
        checkoutFormContainer.style.display = 'none';
    }
    document.querySelector('.checkout-btn').style.display = 'block';
}

// Handle form submission
const checkoutForm = document.getElementById('checkoutForm');
if (checkoutForm) {
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        if (!validateForm()) {
            return;
        }

        // Get form data
        const formData = new FormData(checkoutForm);
        const shippingMethod = formData.get('shipping');
        const shippingCost = shippingMethod === 'standard' ? 5.99 : 12.99;

        // Update total with shipping
        const totalWithShipping = calculateTotal() + shippingCost;

        // Generate order details
        const orderDetails = {
            fullName: formData.get('fullName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            address: `${formData.get('address1')}\n${formData.get('address2') || ''}\n${formData.get('city')}, ${formData.get('state')} ${formData.get('zip')}\n${formData.get('country')}`,
            shippingMethod: formData.get('shipping'),
            shippingCost: shippingCost,
            total: totalWithShipping,
            items: Object.values(cart).map(item => ({
                name: products.find(p => p.id === item.id).name,
                quantity: item.quantity,
                price: products.find(p => p.id === item.id).price
            }))
        };

        // Process payment with Atlos
        processPayment(orderDetails);
    });
}

function validateForm() {
    const form = document.getElementById('checkoutForm');
    const requiredFields = ['email', 'phone', 'address1', 'city', 'state', 'zip', 'terms'];

    let isValid = true;

    requiredFields.forEach(field => {
        const element = form.elements[field];

        // Field not found at all
        if (!element) {
            console.warn(`Field "${field}" not found in form.`);
            isValid = false;
            return;
        }

        // Handle checkboxes (like 'terms')
        if (element.type === 'checkbox' && !element.checked) {
            isValid = false;
            element.classList.add('error');
        }
        // Handle radio buttons (like 'shipping')
        else if (element.type === 'radio') {
            const radioGroup = form.querySelectorAll(`input[name="${field}"]`);
            const isChecked = Array.from(radioGroup).some(r => r.checked);
            if (!isChecked) {
                isValid = false;
                radioGroup.forEach(r => r.classList.add('error'));
            } else {
                radioGroup.forEach(r => r.classList.remove('error'));
            }
        }
        // Handle normal input/select
        else if (!element.value.trim()) {
            isValid = false;
            element.classList.add('error');
        } else {
            element.classList.remove('error');
        }
    });

    if (!isValid) {
        alert('Please fill in all required fields marked with *');
    }

    return isValid;
}



function processPayment(orderDetails) {
    // Generate a unique order ID
    const orderId = 'ORDER_' + Date.now();

    // Prepare order details for Atlos
    const orderAmount = orderDetails.total;

    // Initialize Atlos (if not already initialized)
    if (typeof atlos === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://checkout.atlos.com/checkout.js';
        script.async = true;
        document.body.appendChild(script);
    }

    // Wait for Atlos to be loaded
    const checkAtlos = setInterval(() => {
        if (typeof atlos !== 'undefined') {
            clearInterval(checkAtlos);
            
            atlos.Pay({
                merchantId: '6C3OQ5OFRA',
                orderId: orderId,
                orderAmount: orderAmount,
                orderCurrency: 'USD',
                userName: orderDetails.fullName,
                userEmail: orderDetails.email,
                captureEmail: true,
                subscription: null,
                resetSubscription: true,
                subscriptionId: null,
                postbackUrl: null,
                noBuyCrypto: false,
                onSuccess: function() {
                    // Save order details to database (implement server-side)
                    saveOrder(orderDetails, orderId);
                    
                    // Clear cart after successful payment
                    cart = {};
                    updateCart();
                    updateCartCount();
                    closeCart();

                    // Show success message
                    alert(`Payment successful! Your order has been placed. Order ID: ${orderId}`);
                },
                onCanceled: function() {
                    alert('Payment was canceled.');
                },
                onCompleted: function() {
                    // Additional completion logic
                },
                language: 'en',
                theme: 'light'
            });
        }
    }, 100);
}

function saveOrder(orderDetails, orderId) {
    // This function would typically make an API call to save the order to your backend
    // For now, we'll just log it
    console.log('Order saved:', { orderId, ...orderDetails });
}

function toggleCart() {
    const outerCart = document.getElementById('cartSection');
    const innerCart = outerCart.querySelector('.cart-section');
    if (outerCart && innerCart) {
        innerCart.classList.toggle('active');
        // Update cart display when toggling
        updateCart();
    }
}

function closeCart() {
    const cartSection = document.querySelector('.cart-section');
    const cartHeader = document.querySelector('.cart-header h2');
    const closeCart = document.querySelector('.close-cart');
    const cartContent = document.querySelector('.cart-content');
    const checkoutFormContainer = document.getElementById('checkoutFormContainer');
    
    if (cartSection && cartContent && checkoutFormContainer) {
        // Reset to cart view
        checkoutFormContainer.classList.remove('active');
        cartContent.style.display = 'flex';
        
        // Reset header text
        if (cartHeader) {
            cartHeader.textContent = 'Your Cart';
        }
        
        // Reset close button text
        if (closeCart) {
            closeCart.textContent = '×';
        }
        
        // Reset cart section height
        cartSection.style.height = '100%';
        
        // Keep cart open
        cartSection.classList.add('active');
    }
    
    // Hide overlay
    const cartOverlay = document.querySelector('.cart-overlay');
    if (cartOverlay) {
        cartOverlay.classList.remove('active');
    }
}

// Function to create product cards
function createProductCard(product) {
    const inCart = cart[product.id];
    const buttonText = inCart ? 'Remove from Cart' : 'Add to Cart';
    const iconClass = inCart ? 'fas fa-trash' : 'fas fa-shopping-cart';
    
    return `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <p class="product-description">${product.description}</p>
                <div class="cart-status">
                    ${inCart ? `<span class="in-cart">In Cart (${inCart.quantity})</span>` : ''}
                </div>
                <button class="add-to-cart" data-id="${product.id}">
                    <i class="${iconClass}"></i>
                    ${buttonText}
                </button>
            </div>
        </div>
    `;
}

// Populate the product grid
function populateProducts() {
    const productGrid = document.getElementById('productGrid');
    productGrid.innerHTML = products.map(product => createProductCard(product)).join('');
}

// Add event listeners for add to cart buttons
document.addEventListener('DOMContentLoaded', () => {
    // Initialize cart visibility
    const cartSection = document.getElementById('cartSection');
    if (cartSection) {
        cartSection.classList.remove('active');
        // Initialize inner cart section
        const innerCart = cartSection.querySelector('.cart-section');
        if (innerCart) {
            innerCart.style.display = 'flex';
            innerCart.style.flexDirection = 'column';
            innerCart.style.width = '100%';
            innerCart.style.height = '100%';
        }
    }

    // Initialize cart button
    const cartIcon = document.getElementById('cartIcon');
    const cartOverlay = document.querySelector('.cart-overlay');
    const checkoutButton = document.getElementById('checkoutButton');
    
    if (cartIcon) {
        cartIcon.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Cart button clicked');
            
            const cartSection = document.querySelector('.cart-section');
            if (!cartSection) {
                console.error('Cart section not found');
                return;
            }

            console.log('Toggling cart visibility');
            cartSection.classList.toggle('active');
            if (cartOverlay) {
                cartOverlay.classList.toggle('active');
            }
            
            // Update cart display
            updateCart();
            
            // Add animation class for smooth transition
            cartSection.classList.add('slide-in');
            setTimeout(() => {
                cartSection.classList.remove('slide-in');
            }, 300);
        });

        // Close cart when clicking overlay
        if (cartOverlay) {
            cartOverlay.addEventListener('click', () => {
                closeCart();
            });
        }

        // Add checkout button click handler
        if (checkoutButton) {
            checkoutButton.addEventListener('click', (e) => {
                e.preventDefault();
                if (Object.keys(cart).length === 0) {
                    alert('Your cart is empty! Please add items before proceeding to checkout.');
                    return;
                }
                
                // Keep cart open, just hide cart content
                const cartSection = document.querySelector('.cart-section');
                if (cartSection) {
                    cartSection.classList.add('active');
                }
                const checkoutButtons = document.querySelector('checkout-buttons');
                if (checkoutButtons) {
                    checkoutButtons.style.display = 'block';
                }
                const formGroups = document.querySelectorAll('.form-group');
                formGroups.forEach(group => {
                    group.style.display = 'block'; // or 'flex', 'grid', whatever
                });
                
                
                
                
                
                // Show form
                showCheckoutForm();
            });
        }
    } else {
        console.error('Cart icon not found in DOM');
    }

    // Populate products first
    populateProducts();

    // Wait for DOM to update
    setTimeout(() => {
        // Add to cart functionality
        const addButtons = document.querySelectorAll('.add-to-cart');
        console.log('Found add to cart buttons:', addButtons.length);
        
        addButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(button.dataset.id);
                const product = products.find(p => p.id === productId);
                
                if (!product) {
                    console.error('Product not found:', productId);
                    return;
                }

                if (cart[productId]) {
                    // Remove from cart
                    delete cart[productId];
                    button.classList.remove('remove');
                    
                    // Update button icon and text
                    const icon = button.querySelector('i');
                    if (icon) {
                        icon.className = 'fas fa-shopping-cart';
                    }
                    button.textContent = 'Add to Cart';
                    
                    // Remove the in-cart status
                    const cartStatus = button.previousElementSibling;
                    if (cartStatus && cartStatus.className === 'in-cart') {
                        cartStatus.remove();
                    }
                } else {
                    // Add to cart
                    cart[productId] = { id: productId, quantity: 1 };
                    button.classList.add('remove');
                    button.querySelector('i').className = 'fas fa-trash';
                    button.textContent = 'Remove from Cart';
                    
                    // Create and add the in-cart status
                    const cartStatus = document.createElement('span');
                    cartStatus.className = 'in-cart';
                    cartStatus.textContent = 'In Cart (1)';
                    button.parentElement.insertBefore(cartStatus, button);
                }

                // Update cart display and count
                updateCart();
                updateCartCount();
                
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.textContent = `${product.name} ${cart[productId] ? 'added to' : 'removed from'} cart!`;
                document.body.appendChild(successMessage);
                setTimeout(() => successMessage.remove(), 2000);

                // Show cart if item was added
                if (cart[productId]) {
                    const outerCart = document.getElementById('cartSection');
                    if (outerCart) {
                        const innerCart = outerCart.querySelector('.cart-section');
                        if (innerCart) {
                            innerCart.classList.add('active');
                            updateCart();
                        }
                    }
                }
            });
        });

        // Add product card hover effects
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                const productInfo = card.querySelector('.product-info');
                productInfo.style.transform = 'translateY(-10px)';
            });

            card.addEventListener('mouseleave', () => {
                const productInfo = card.querySelector('.product-info');
                productInfo.style.transform = 'translateY(0)';
            });
        });
    });
});
