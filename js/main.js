// main.js – DineIn website functionality

// ---------------------
// ---------------------
// Dish data uses direct Unsplash image URLs because local photo downloads are unavailable.
const dishes = [
  // Starters
  {
    id: 's1',
    name: 'Bruschetta',
    category: 'Starters',
    description: 'Grilled bread topped with tomatoes, garlic, basil, and olive oil.',
    price: 6.99,
    image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&w=800&q=80',
    sizes: ['Regular'],
    spices: []
  },
  {
    id: 's2',
    name: 'Caprese Salad',
    category: 'Starters',
    description: 'Fresh mozzarella, tomatoes, basil, drizzled with balsamic glaze.',
    price: 7.99,
    image: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?auto=format&fit=crop&w=800&q=80',
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
    image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=800&q=80',
    sizes: ['Small', 'Medium', 'Large'],
    spices: ['Mild', 'Medium', 'Hot']
  },
  {
    id: 'm2',
    name: 'Grilled Salmon',
    category: 'Mains',
    description: 'Fresh salmon fillet grilled to perfection with lemon butter.',
    price: 18.5,
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80',
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
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
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
  cart.forEach(entry => {
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
  const container = $$('.featured .featured')[0];
  if (!container) return;
  const featured = dishes.slice(0, 3);
  featured.forEach(d => {
    const card = document.createElement('div');
    card.className = 'card';
    const img = document.createElement('img');
    img.src = d.image;
    img.alt = d.name;
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
  const defaultDish = dishes.find(d => d.id === 's1');
  const dish = dishes.find(d => d.id === dishId) || defaultDish;
  const container = $('#dish-detail');
  if (!container) return;
  container.innerHTML = '';
  const img = document.createElement('img');
  img.src = dish.image;
  img.alt = dish.name;
  const h2 = document.createElement('h2');
  h2.id = 'dish-name';
  h2.textContent = dish.name;
  const pDesc = document.createElement('p');
  pDesc.id = 'dish-description';
  pDesc.textContent = dish.description;
  const pPrice = document.createElement('p');
  pPrice.innerHTML = `<strong>Price:</strong> <span id="dish-price">${formatPrice(dish.price)}</span>`;
  const optDiv = document.createElement('div');
  optDiv.className = 'options';
  if (dish.sizes && dish.sizes.length) {
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
  if (dish.spices && dish.spices.length) {
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
  const path = location.pathname.replace(/\\/g, '/');
  if (path.endsWith('index.html') || path.endsWith('/')) {
    renderFeatured();
  }
  if (path.endsWith('full-menu.html')) {
    renderMenuGrid();
    $$('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        $$('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.category;
        renderMenuGrid(cat, $('#search-input')?.value || '');
      });
    });
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
  updateCartBadge();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
