const track = document.querySelector('.testimonial-track');
const cards = document.querySelectorAll('.testimonial-card');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');

let index = 0;

function updateSlider() {
  // Moves the track by 100% of the container width per index
  if (!track) return;
  track.style.transform = `translateX(-${index * 100}%)`;
}

// Only attach slide controls if the slider exists on the page
if (track && nextBtn && prevBtn && cards.length > 0) {
  nextBtn.addEventListener('click', () => {
    index = (index + 1) % cards.length; // Loops back to start
    updateSlider();
  });

  prevBtn.addEventListener('click', () => {
    index = (index - 1 + cards.length) % cards.length; // Loops to end
    updateSlider();
  });
}


// 1. Select all elements with the 'reveal' class
const revealElements = document.querySelectorAll('.reveal');
const revealElements2 = document.querySelectorAll('.reveal2');

// 2. Define the callback function for the observer
const revealCallback = (entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Add the 'active' class when the element enters the view
      entry.target.classList.add('active',);
      
      // Optional: Stop observing after it reveals (prevents it from hiding again)
      observer.unobserve(entry.target);
    }
  });
};

// 3. Create the observer with options
const observerOptions = {
  root: null, // Use the browser viewport
  threshold: 0.1 // Trigger when 10% of the element is visible
};

const observer = new IntersectionObserver(revealCallback, observerOptions);

// 4. Tell the observer to watch each element
revealElements.forEach(el => observer.observe(el));
revealElements2.forEach(el => observer.observe(el));



// 1. Your data (usually comes from an API)
const products = [
    { name: 'Apple iPhone 17 pro max', storage: '8/128gb', color: 'Space Black', price: '₦1,850,000', image: './img/17PM2.jpg' },
    { name: 'Apple iPhone 15 pro max', storage: '8/128gb', color: 'Space Black', price: '₦1,499,000', image: './img/15PM.jpg' },
    { name: 'Apple iPhone 15 pro', storage: '8/128gb', color: 'Space Black', price: '₦1,299,000', image: './img/15pro.jpg' },
    { name: 'Samsung Galaxy S25 Ultra', storage: '256gb', color: 'Phantom Silver', price: '₦1,699,000', image: './img/Samsung galaxy S25 Ultra.jpeg' },
    { name: 'Google Pixel 9 pro XL', storage: '8/12gb||256gb', color: 'Just Black', price: '₦149,000', image: './img/pixel2.jpg' },
    { name: 'Macbook Pro 2022', storage: '16gb || 512gb SSD', color: 'Silver', price: '₦3,499,000', image: './img/mac.jpeg' },
    { name: 'Play Station 5 Fat', storage: '256GB', color: 'Gray', price: '₦600,000', image: './img/ps52.jpeg' },
    { name: 'Play Station 5 slim', storage: '512gb SSD', color: 'Gray', price: '₦550,000', image: './img/ps51.jpeg' },
    { name: 'Apple iPhone 15 pro max', storage: '8/256gb', color: 'Space Black', price: '₦999', image: 'img/15promaxx.jpg' },
    { name: 'Apple iPhone 17 pro max', storage: '8/128gb', color: 'Space Black', price: '₦1,999,000', image: 'img/i17promax.jpg' },
    { name: 'Samsung Galaxy Fold 4', storage: '8/256gb', color: 'Phantom Silver', price: '₦999', image: 'img/fold4.jpg' },
    { name: 'Google Pixel 9 pro', storage: '8/128gb', color: 'Just Black', price: '₦999', image: 'img/GP9pro.jpg' }
];

const searchInput = document.getElementById('searchInput');
const productGrid = document.getElementById('productGrid');


// 2. Function to display products
function displayProducts(filteredList) {
  if (!productGrid) return;
  productGrid.innerHTML = filteredList.map(product => `
    <div class="product-card">
      <img src="${product.image}" alt="${product.name}" />
      <h3>${product.name}</h3>
      <p>${product.storage}</p>
      <p id="comp">${product.price}</p>
      <button class="login" onClick="addToCart(${product._idx})">Add to Cart</button>
    </div>
  `).join('');
}

// 3. The Search Logic
if (productGrid && searchInput) {
  searchInput.addEventListener('input', (e) => {
    const value = e.target.value.toLowerCase(); // Convert to lowercase for better matching

    const filteredProducts = products
      .map((product, idx) => ({ ...product, _idx: idx }))
      .filter(product => product.name.toLowerCase().includes(value));

    displayProducts(filteredProducts);
  });

  // Initial render
  const initialProducts = products.map((product, idx) => ({ ...product, _idx: idx }));
  displayProducts(initialProducts);
}


// Helpers for cart persistence
function getCart() {
  try {
    return JSON.parse(localStorage.getItem('cart') || '[]');
  } catch {
    return [];
  }
}

function setCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function parsePrice(price) {
  if (typeof price === 'number') return price;
  const parsed = Number(price.toString().replace(/[^0-9.\-]/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
}

function getCurrencySymbol(priceString) {
  if (typeof priceString !== 'string') return '$';
  const match = priceString.trim().match(/[^0-9.,\s]/);
  return match ? match[0] : '$';
}

function formatCurrency(value, symbol = '$') {
  const formatted = value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${symbol}${formatted}`;
}

function updateCartCount() {
  const cartCountEl = document.getElementById('cart-count');
  if (!cartCountEl) return;

  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
  cartCountEl.innerText = `Cart (${count})`;
}

function addToCart(productIndex) {
  const product = products[productIndex];
  if (!product) return;

  const cart = getCart();
  const existingItem = cart.find(item => item.name === product.name && item.storage === product.storage);

  if (existingItem) {
    existingItem.quantity = (existingItem.quantity || 0) + 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  setCart(cart);
  updateCartCount();
  alert('Item added to your bag!');
}

// Update the cart count on load
updateCartCount();

// If we're on the cart page, render the cart contents
function removeCartItem(itemIndex) {
  const cart = getCart();
  cart.splice(itemIndex, 1);
  setCart(cart);
  updateCartCount();
  displayCartPage();
}

function clearCart() {
  setCart([]);
  updateCartCount();
  displayCartPage();
}

function changeCartQuantity(itemIndex, delta) {
  const cart = getCart();
  const item = cart[itemIndex];
  if (!item) return;

  item.quantity = Math.max(0, (item.quantity || 1) + delta);

  if (item.quantity === 0) {
    cart.splice(itemIndex, 1);
  }

  setCart(cart);
  updateCartCount();
  displayCartPage();
}

function displayCartPage() {
  const cart = getCart();
  const container = document.getElementById('cartItems');
  const totalEl = document.getElementById('cartTotal');
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <h2>Your cart is empty</h2>
        <p><a href="products.html">Continue shopping</a></p>
      </div>
    `;
    if (totalEl) totalEl.textContent = '';
    return;
  }

  const currency = cart.length > 0 ? getCurrencySymbol(cart[0].price) : '$';

  const total = cart.reduce((sum, item) => {
    const quantity = item.quantity || 1;
    const price = parsePrice(item.price);
    return sum + price * quantity;
  }, 0);

  const rows = cart.map((item, index) => {
    const qty = item.quantity || 1;
    const itemPrice = parsePrice(item.price);
    const itemTotal = itemPrice * qty;

    return `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" />
        <div class="cart-item-details">
          <h3>${item.name}</h3>
          <p>${item.storage}</p>
          <p>
            <button class="qty-btn" onclick="changeCartQuantity(${index}, -1)">-</button>
            <span class="qty-value">${qty}</span>
            <button class="qty-btn" onclick="changeCartQuantity(${index}, 1)">+</button>
          </p>
          <p id="item-para">${formatCurrency(itemPrice, currency)} × ${qty} = <strong>${formatCurrency(itemTotal, currency)}</strong></p>
          <button class="remove-btn" onclick="removeCartItem(${index})">× Remove</button>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = rows;

  const clearBtn = document.getElementById('clear-cart');
  if (clearBtn) {
    clearBtn.disabled = cart.length === 0;
    clearBtn.onclick = () => clearCart();
  }

  if (totalEl) {
    totalEl.textContent = `Total: ${formatCurrency(total, currency)}`;
  }
}

displayCartPage();
