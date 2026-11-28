// Name: Muhammad Ali Saeed
// Roll no: i263169
// Section: SE-D
/**
 * Dine in — Shared Client-Side Script
 * Group 03 | Section SE-D
 * Vanilla ES6 JavaScript (No Frameworks)
 *
 * Features:
 *  - localStorage-based shopping cart (add, update quantity, remove, clear)
 *  - Subtotal, tax, delivery fee, and total calculations
 *  - Live cart badge counter updates across pages
 *  - Declarative [data-add-to-cart] button support
 *  - Responsive navbar mobile toggle & active link highlighting
 */

'use strict';

const CART_STORAGE_KEY = 'dinein_cart_v1';
const DEFAULT_TAX_RATE = 0.08;      // 8% sales tax
const DEFAULT_DELIVERY_FEE = 4.99;  // Flat delivery fee when cart is non-empty

/**
 * Round a currency value cleanly to 2 decimal places.
 * @param {number} value
 * @returns {number}
 */
function roundCurrency(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

/**
 * Format a number as USD currency (e.g., "$12.50").
 * @param {number} amount
 * @returns {string}
 */
function formatCurrency(amount) {
  return `$${roundCurrency(amount).toFixed(2)}`;
}

/* ==========================================================================
   1. Shopping Cart (localStorage)
   ========================================================================== */

/**
 * Retrieve all cart items from localStorage.
 * @returns {Array<{id: string, name: string, price: number, quantity: number, image?: string, notes?: string}>}
 */
function getCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn('Could not read cart from localStorage:', error);
    return [];
  }
}

/**
 * Persist cart items to localStorage, refresh the badge, and notify listeners.
 * @param {Array} cart
 */
function saveCart(cart) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.warn('Could not save cart to localStorage:', error);
  }

  updateCartBadge();
  document.dispatchEvent(
    new CustomEvent('dinein:cart-updated', {
      detail: { cart, totals: calculateTotals() },
    })
  );
}

/**
 * Add an item to the cart (or increment quantity if it already exists).
 * @param {{id: string|number, name: string, price: number, quantity?: number, image?: string, notes?: string}} item
 * @returns {Array} Updated cart
 */
function addToCart(item) {
  if (!item || !item.id || !item.name) {
    console.warn('addToCart requires an object with at least id and name.');
    return getCart();
  }

  const id = String(item.id);
  const price = Number(item.price);
  const quantityToAdd = Math.max(1, parseInt(item.quantity, 10) || 1);

  if (Number.isNaN(price) || price < 0) {
    console.warn('addToCart received an invalid price:', item.price);
    return getCart();
  }

  const cart = getCart();
  const existingItem = cart.find((entry) => String(entry.id) === id);

  if (existingItem) {
    existingItem.quantity += quantityToAdd;
    if (item.notes) existingItem.notes = item.notes;
  } else {
    cart.push({
      id,
      name: String(item.name),
      price: roundCurrency(price),
      quantity: quantityToAdd,
      image: item.image ? String(item.image) : '',
      notes: item.notes ? String(item.notes) : '',
    });
  }

  saveCart(cart);
  showToast(`Added "${item.name}" to your cart.`);
  return cart;
}

/**
 * Update the quantity of a specific cart item.
 * Removes the item automatically if quantity drops to 0 or below.
 * @param {string|number} itemId
 * @param {number} newQuantity
 * @returns {Array} Updated cart
 */
function updateQuantity(itemId, newQuantity) {
  const id = String(itemId);
  const quantity = parseInt(newQuantity, 10);

  if (Number.isNaN(quantity) || quantity <= 0) {
    return removeFromCart(id);
  }

  const cart = getCart();
  const target = cart.find((entry) => String(entry.id) === id);

  if (target) {
    target.quantity = quantity;
    saveCart(cart);
  }

  return cart;
}

/**
 * Remove an item from the cart by its id.
 * @param {string|number} itemId
 * @returns {Array} Updated cart
 */
function removeFromCart(itemId) {
  const id = String(itemId);
  const cart = getCart().filter((entry) => String(entry.id) !== id);
  saveCart(cart);
  return cart;
}

/**
 * Empty the entire cart.
 * @returns {Array}
 */
function clearCart() {
  saveCart([]);
  return [];
}

/**
 * Get the total quantity of items currently in the cart.
 * @returns {number}
 */
function getCartCount() {
  return getCart().reduce((sum, item) => sum + (parseInt(item.quantity, 10) || 0), 0);
}

/**
 * Calculate subtotal, tax, delivery fee, and grand total.
 * @param {{taxRate?: number, deliveryFee?: number, orderType?: 'delivery'|'pickup'}} [options]
 * @returns {{itemCount: number, subtotal: number, tax: number, delivery: number, total: number}}
 */
function calculateTotals(options = {}) {
  const cart = getCart();
  const taxRate = typeof options.taxRate === 'number' ? options.taxRate : DEFAULT_TAX_RATE;
  const baseDeliveryFee =
    typeof options.deliveryFee === 'number' ? options.deliveryFee : DEFAULT_DELIVERY_FEE;

  const itemCount = cart.reduce((sum, item) => sum + (parseInt(item.quantity, 10) || 0), 0);
  const subtotal = roundCurrency(
    cart.reduce((sum, item) => sum + Number(item.price) * (parseInt(item.quantity, 10) || 0), 0)
  );
  const tax = roundCurrency(subtotal * taxRate);

  const isPickup = options.orderType === 'pickup';
  const delivery = subtotal > 0 && !isPickup ? roundCurrency(baseDeliveryFee) : 0;
  const total = roundCurrency(subtotal + tax + delivery);

  return {
    itemCount,
    subtotal,
    tax,
    delivery,
    total,
  };
}

/**
 * Update all cart badge elements in the navbar / page.
 */
function updateCartBadge() {
  const count = getCartCount();
  const badges = document.querySelectorAll('.cart-badge, [data-cart-badge], #cart-count');

  badges.forEach((badge) => {
    badge.textContent = String(count);
    badge.setAttribute('data-count', String(count));
  });
}

/* ==========================================================================
   2. Toast Notification Helper
   ========================================================================== */

/**
 * Show a brief non-blocking toast notification in the bottom-right corner.
 * @param {string} message
 * @param {number} [duration=2600]
 */
function showToast(message, duration = 2600) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    container.setAttribute('aria-live', 'polite');
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);

  window.setTimeout(() => {
    toast.remove();
    if (container.children.length === 0) {
      container.remove();
    }
  }, duration);
}

/* ==========================================================================
   3. Navbar Mobile Toggle & Active Link Highlighting
   ========================================================================== */

/**
 * Initialize responsive mobile menu toggle, dropdowns, and active nav links.
 */
function initNavbarToggle() {
  const toggleBtn = document.querySelector('.navbar-toggle, #navbar-toggle, [data-nav-toggle]');
  const menu = document.querySelector('.navbar-menu, #navbar-menu, .navbar-links');

  if (toggleBtn && menu) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('is-open');
      toggleBtn.classList.toggle('is-active', isOpen);
      toggleBtn.setAttribute('aria-expanded', String(isOpen));
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && menu.classList.contains('is-open')) {
        menu.classList.remove('is-open');
        toggleBtn.classList.remove('is-active');
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // Close menu when clicking outside the navbar
    document.addEventListener('click', (event) => {
      const navbar = toggleBtn.closest('.navbar');
      if (navbar && !navbar.contains(event.target) && menu.classList.contains('is-open')) {
        menu.classList.remove('is-open');
        toggleBtn.classList.remove('is-active');
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Mobile dropdown toggle support
  const dropdownToggles = document.querySelectorAll('.nav-dropdown-toggle');
  dropdownToggles.forEach((btn) => {
    btn.addEventListener('click', (event) => {
      event.preventDefault();
      const parent = btn.closest('.nav-dropdown');
      if (parent) {
        parent.classList.toggle('is-open');
      }
    });
  });

  // Highlight active navigation link based on current URL filename
  const currentFile = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-links .nav-link').forEach((link) => {
    const href = link.getAttribute('href') || '';
    const linkFile = href.split('/').pop();
    if (linkFile && linkFile === currentFile) {
      link.classList.add('active');
    }
  });
}

/* ==========================================================================
   4. Declarative Button Binding & Initialization
   ========================================================================== */

/**
 * Allow any button with [data-add-to-cart] to add items without custom JS.
 * Example:
 *   <button class="btn btn-primary" data-add-to-cart
 *           data-id="pasta-1" data-name="Truffle Pasta" data-price="16.50">
 *     Add to Cart
 *   </button>
 */
function initAddToCartButtons() {
  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-add-to-cart]');
    if (!button) return;

    const { id, name, price, quantity, image, notes } = button.dataset;
    addToCart({
      id,
      name,
      price: Number(price),
      quantity: quantity ? Number(quantity) : 1,
      image,
      notes,
    });
  });
}

// Keep cart badge synced if localStorage changes in another browser tab
window.addEventListener('storage', (event) => {
  if (event.key === CART_STORAGE_KEY) {
    updateCartBadge();
  }
});

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initNavbarToggle();
  initAddToCartButtons();
  updateCartBadge();
});

// Expose clean global API for all pages in index.html and pages/
window.DineInCart = {
  getCart,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  getCartCount,
  calculateTotals,
  updateCartBadge,
  formatCurrency,
  showToast,
  DEFAULT_TAX_RATE,
  DEFAULT_DELIVERY_FEE,
};
