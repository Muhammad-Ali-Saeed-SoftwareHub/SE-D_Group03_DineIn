// main.js – DineIn website functionality

// ---------------------
// Data definitions
// ---------------------
    const dishes = [
  // Starters
  {
    id: 's1',
    name: 'Bruschetta',
    category: 'Starters',
    description: 'Grilled bread topped with tomatoes, garlic, basil, and olive oil.',
    price: 6.99,
    image: 'https://images.unsplash.com/photo-1589923188900-1a7e6c30f88b?auto=format&fit=crop&w=800&q=80',
    sizes: ['Regular'],
    spices: []
  },
  {
    id: 's2',
    name: 'Caprese Salad',
    category: 'Starters',
    description: 'Fresh mozzarella, tomatoes, basil, drizzled with balsamic glaze.',
    price: 7.99,
    image: 'https://images.unsplash.com/photo-1589332558969-184925a1c4a5?auto=format&fit=crop&w=800&q=80',
    sizes: ['Regular'],
    spices: []
  },
  // Mains
  {
    id: 'm1',
    name: 'Signature Pasta',
    category: 'Mains',
    description: 'Handmade pasta tossed in a rich tomato‑basil sauce.',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1543353071-087092ec393e?auto=format&fit=crop&w=800&q=80',
    sizes: ['Small', 'Medium', 'Large'],
    spices: ['Mild', 'Medium', 'Hot']
  },
  {
    id: 'm2',
    name: 'Grilled Salmon',
    category: 'Mains',
    description: 'Fresh salmon fillet grilled to perfection with lemon butter.',
    price: 18.5,
    image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc3d30?auto=format&fit=crop&w=800&q=80',
    sizes: ['Portion'],
    spices: ['None']
  },
  // Desserts
  {
    id: 'd1',
    name: 'Chocolate Lava Cake',
    category: 'Desserts',
    description: 'Warm chocolate cake with a gooey molten center.',
    price: 8.5,
    image: 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?auto=format&fit=crop&w=800&q=80',
    sizes: ['Single'],
    spices: []
  }
];

// ---------------------
// Utility functions
// ---------------------
function $(selector) { return document.querySelector(selector); }
function $$(selector) { return Array.from(document.querySelectorAll(selector)); }

function formatPrice(num) { return `$${num.toFixed(2)}`; }

// ---------------------
// Cart handling (localStorage)
// ---------------------
function getCart() {
  const raw = localStorage.getItem('dineinCart');
  return raw ? JSON.parse(raw) : [];
}

function saveCart(cart) { localStorage.setItem('dineinCart', JSON.stringify(cart)); }

function addToCart(item) {
  const cart = getCart();
  // Check if same dish with same options exists – if so, increase quantity
  const existing = cart.find(c => c.id === item.id && JSON.stringify(c.options) === JSON.stringify(item.options));
  if (existing) {
    existing.quantity += item.quantity;
  } else {
    cart.push(item);
  }
  saveCart(cart);
  updateCartBadge();
}

function updateCartBadge() {
  const cart = getCart();
  const totalQty = cart.reduce((sum, i) => sum + i.quantity, 0);
  // optional badge element – we reuse cart button if exists
  const badge = $('#cart-badge');
  if (badge) badge.textContent = totalQty > 0 ? totalQty : '';
}

function renderCart() {
  const cart = getCart();
  const container = $('#cart-items');
  container.innerHTML = '';
  if (cart.length === 0) {
    container.innerHTML = '<p>Your cart is empty.</p>';
    $('#cart-total').textContent = formatPrice(0);
    return;
  }
  let total = 0;
  cart.forEach((entry, idx) => {
    const li = document.createElement('div');
    li.className = 'cart-entry';
    li.style.display = 'flex';
    li.style.justifyContent = 'space-between';
    li.style.marginBottom = '0.5rem';
    const desc = `${entry.name}`;
    const opts = [];
    if (entry.options.size) opts.push(`Size: ${entry.options.size}`);
    if (entry.options.spice) opts.push(`Spice: ${entry.options.spice}`);
    const optStr = opts.length ? ` (${opts.join(', ')})` : '';
    const line = document.createElement('span');
    line.textContent = `${desc}${optStr} x${entry.quantity}`;
    const priceSpan = document.createElement('span');
    const lineTotal = entry.quantity * entry.price;
    priceSpan.textContent = formatPrice(lineTotal);
    li.appendChild(line);
    li.appendChild(priceSpan);
    container.appendChild(li);
    total += lineTotal;
  });
  $('#cart-total').textContent = formatPrice(total);
}

function openModal(id) {
  const el = $(`#${id}`);
  if (el) el.classList.add('active');
  if (id === 'cart-modal') renderCart();
}

function closeModal(id) {
  const el = $(`#${id}`);
  if (el) el.classList.remove('active');
}

function confirmOrder() {
  // Clear cart, show confirmation
  localStorage.removeItem('dineinCart');
  renderCart();
  closeModal('cart-modal');
  openModal('order-modal');
  setTimeout(() => closeModal('order-modal'), 3000);
}

// ---------------------
// Page specific rendering
// ---------------------
function renderFeatured() {
  const container = $$('.featured .featured')[0]; // first .featured container
  if (!container) return;
  const featured = dishes.slice(0, 3); // first three as example
  featured.forEach(d => {
    const card = document.createElement('div');
    card.className = 'card';
    const img = document.createElement('img');
    img.src = d.image;
    img.alt = d.name;
    // fallback if image fails
    img.onerror = function() {
      this.src = 'https://via.placeholder.com/400x300?text=Image+Unavailable';
    };
    // fallback if image fails
    img.onerror = function() {
      this.src = 'https://via.placeholder.com/400x300?text=Image+Unavailable';
    };
    const info = document.createElement('div');
    info.className = 'info';
    const title = document.createElement('h3');
    title.textContent = d.name;
    const price = document.createElement('p');
    price.textContent = formatPrice(d.price);
    const btn = document.createElement('button');
    btn.textContent = 'Add to Cart';
    btn.onclick = () => addToCart({ id: d.id, name: d.name, price: d.price, quantity: 1, options: {} });
    info.appendChild(title);
    info.appendChild(price);
    card.appendChild(img);
    card.appendChild(info);
    // button outside info to stretch full width
    card.appendChild(btn);
    container.appendChild(card);
  });
}

function renderMenuGrid(filter = 'all', search = '') {
  const grid = $('#menu-grid');
  if (!grid) return;
  grid.innerHTML = '';
  const filtered = dishes.filter(d => {
    const matchesCat = filter === 'all' || d.category === filter;
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.description.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });
  filtered.forEach(d => {
    const card = document.createElement('div');
    card.className = 'card';
    const img = document.createElement('img');
    img.src = d.image;
    img.alt = d.name;
    // fallback if image fails
    img.onerror = function() {
      this.src = 'https://via.placeholder.com/400x300?text=Image+Unavailable';
    };
    const info = document.createElement('div');
    info.className = 'info';
    const title = document.createElement('h3');
    title.textContent = d.name;
    const price = document.createElement('p');
    price.textContent = formatPrice(d.price);
    const desc = document.createElement('p');
    desc.textContent = d.description;
    info.appendChild(title);
    info.appendChild(price);
    info.appendChild(desc);
    const btn = document.createElement('button');
    btn.textContent = 'Details';
    btn.onclick = () => {
      // navigate to dish-details with query params
      const params = new URLSearchParams({ dish: d.id });
      location.href = `dish-details.html?${params.toString()}`;
    };
    card.appendChild(img);
    card.appendChild(info);
    card.appendChild(btn);
    grid.appendChild(card);
  });
}

function renderDishDetails() {
  const params = new URLSearchParams(location.search);
  const dishId = params.get('dish');
  // Use default dish (Bruschetta) if no valid id provided
  const defaultDish = dishes.find(d => d.id === 's1');
  const dish = dishes.find(d => d.id === dishId) || defaultDish;
  const container = $('#dish-detail');
  if (!container) return;
  container.innerHTML = '';
  // Image with fallback
  const img = document.createElement('img');
  img.src = dish.image;
  img.alt = dish.name;
  img.onerror = function() {
    this.src = 'https://via.placeholder.com/400x300?text=Image+Unavailable';
  };
  // Title
  const h2 = document.createElement('h2');
  h2.id = 'dish-name';
  h2.textContent = dish.name;
  // Description
  const pDesc = document.createElement('p');
  pDesc.id = 'dish-description';
  pDesc.textContent = dish.description;
  // Price
  const pPrice = document.createElement('p');
  pPrice.innerHTML = `<strong>Price:</strong> <span id="dish-price">${formatPrice(dish.price)}</span>`;

  // Options container
  const optDiv = document.createElement('div');
  optDiv.className = 'options';

  // Size selection if applicable
  if (dish.sizes && dish.sizes.length > 0) {
    const sizeLabel = document.createElement('label');
    sizeLabel.textContent = 'Size:';
    const sizeSelect = document.createElement('select');
    sizeSelect.id = 'size-select';
    dish.sizes.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s;
      opt.textContent = s;
      sizeSelect.appendChild(opt);
    });
    sizeLabel.appendChild(sizeSelect);
    optDiv.appendChild(sizeLabel);
  }

  // Spice selection if applicable
  if (dish.spices && dish.spices.length > 0) {
    const spiceLabel = document.createElement('label');
    spiceLabel.textContent = 'Spice:';
    const spiceSelect = document.createElement('select');
    spiceSelect.id = 'spice-select';
    dish.spices.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s;
      opt.textContent = s;
      spiceSelect.appendChild(opt);
    });
    spiceLabel.appendChild(spiceSelect);
    optDiv.appendChild(spiceLabel);
  }

  // Quantity control
  const qtyDiv = document.createElement('div');
  qtyDiv.className = 'quantity-control';
  const qtyLabel = document.createElement('label');
  qtyLabel.textContent = 'Quantity:';
  const decBtn = document.createElement('button');
  decBtn.type = 'button';
  decBtn.textContent = '-';
  const qtyInput = document.createElement('input');
  qtyInput.type = 'number';
  qtyInput.min = '1';
  qtyInput.value = '1';
  const incBtn = document.createElement('button');
  incBtn.type = 'button';
  incBtn.textContent = '+';
  decBtn.onclick = () => qtyInput.value = Math.max(1, parseInt(qtyInput.value) - 1);
  incBtn.onclick = () => qtyInput.value = parseInt(qtyInput.value) + 1;
  qtyDiv.appendChild(qtyLabel);
  qtyDiv.appendChild(decBtn);
  qtyDiv.appendChild(qtyInput);
  qtyDiv.appendChild(incBtn);

  // Add to Cart button
  const addBtn = document.createElement('button');
  addBtn.textContent = 'Add to Cart';
  addBtn.onclick = () => {
    const options = {};
    if (dish.sizes && dish.sizes.length) options.size = $('#size-select')?.value || '';
    if (dish.spices && dish.spices.length) options.spice = $('#spice-select')?.value || '';
    const quantity = parseInt(qtyInput.value);
    addToCart({ id: dish.id, name: dish.name, price: dish.price, quantity, options });
    openModal('cart-modal');
  };

  // Append all to container
  container.appendChild(img);
  container.appendChild(h2);
  container.appendChild(pDesc);
  container.appendChild(pPrice);
  container.appendChild(optDiv);
  container.appendChild(qtyDiv);
  container.appendChild(addBtn);
}

// ---------------------
// Event bindings & init
// ---------------------
function init() {
  // Global nav cart badge (optional)
  // Determine which page we are on by pathname
  const path = location.pathname.replace(/\\/g, '/'); // normalize windows backslashes
  if (path.endsWith('index.html') || path.endsWith('/')) {
    renderFeatured();
  }
  if (path.endsWith('full-menu.html')) {
    renderMenuGrid();
    // Filter buttons
    $$('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        $$('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.category;
        renderMenuGrid(cat, $('#search-input')?.value || '');
      });
    });
    // Search input
    const searchInput = $('#search-input');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        const activeBtn = $$('.filter-btn.active')[0];
        const cat = activeBtn ? activeBtn.dataset.category : 'all';
        renderMenuGrid(cat, searchInput.value);
      });
    }
  }
  if (path.endsWith('dish-details.html')) {
    renderDishDetails();
  }

  // Cart badge placeholder (optional)
  // Ensure cart badge updates on load
  updateCartBadge();
}

// Run init after DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
