// Name: Badiuzzaman Mian
// Roll no: i263171
// Section: SE-D
/**
 * Dine in — STANDALONE script for Member 3 Module Pages
 * Fully self-contained: embeds every cart helper, navbar toggle, toast,
 * promo storage, and [data-add-to-cart] declarative binding previously
 * split across js/app3169.js + js/offers-builder.js.
 *
 * Uses IDENTICAL localStorage keys as app3169.js so cart items added here
 * persist across page reloads and sync with the navbar Cart badge on ALL
 * pages (cart.html, checkout.html, etc.).
 *
 * NO dependency on app3169.js — safe to load alone.
 */
(function (window, document) {
  'use strict';

  /* ========================================================================
     PART 1 — SHARED CART & HELPERS
     (mirrors app3169.js exactly: same keys, same function signatures,
      same window.DineInCart API shape)
     ======================================================================== */

  const CART_STORAGE_KEY  = 'dinein_cart_v1';    // must match app3169.js
  const PROMO_STORAGE_KEY = 'dinein_promo_v1';   // must match cart.html / checkout.html
  const DEFAULT_TAX_RATE     = 0.08;
  const DEFAULT_DELIVERY_FEE = 4.99;

  /* -- currency helpers --------------------------------------------------- */
  function roundCurrency(value) {
    return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
  }

  function formatCurrency(amount) {
    return `$${roundCurrency(amount).toFixed(2)}`;
  }

  /* -- localStorage cart -------------------------------------------------- */
  function getCart() {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.warn('Could not read cart from localStorage:', err);
      return [];
    }
  }

  function saveCart(cart) {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (err) {
      console.warn('Could not save cart to localStorage:', err);
    }
    updateCartBadge();
    document.dispatchEvent(
      new CustomEvent('dinein:cart-updated', {
        detail: { cart, totals: calculateTotals() },
      })
    );
  }

  function addToCart(item) {
    if (!item || !item.id || !item.name) {
      console.warn('addToCart requires an object with at least id and name.');
      return getCart();
    }

    const id  = String(item.id);
    const price = Number(item.price);
    const quantityToAdd = Math.max(1, parseInt(item.quantity, 10) || 1);

    if (Number.isNaN(price) || price < 0) {
      console.warn('addToCart received an invalid price:', item.price);
      return getCart();
    }

    const cart = getCart();
    const existing = cart.find((e) => String(e.id) === id);

    if (existing) {
      existing.quantity += quantityToAdd;
      if (item.notes) existing.notes = item.notes;
    } else {
      cart.push({
        id,
        name:     String(item.name),
        price:    roundCurrency(price),
        quantity: quantityToAdd,
        image:    item.image  ? String(item.image)  : '',
        notes:    item.notes  ? String(item.notes)  : '',
      });
    }

    saveCart(cart);
    showToast(`Added "${item.name}" to your cart.`);
    return cart;
  }

  function updateQuantity(itemId, newQuantity) {
    const id = String(itemId);
    const quantity = parseInt(newQuantity, 10);
    if (Number.isNaN(quantity) || quantity <= 0) return removeFromCart(id);
    const cart = getCart();
    const target = cart.find((e) => String(e.id) === id);
    if (target) { target.quantity = quantity; saveCart(cart); }
    return cart;
  }

  function removeFromCart(itemId) {
    const id   = String(itemId);
    const cart = getCart().filter((e) => String(e.id) !== id);
    saveCart(cart);
    return cart;
  }

  function clearCart() {
    saveCart([]);
    return [];
  }

  function getCartCount() {
    return getCart().reduce((sum, item) => sum + (parseInt(item.quantity, 10) || 0), 0);
  }

  function calculateTotals(options = {}) {
    const cart    = getCart();
    const taxRate = typeof options.taxRate    === 'number' ? options.taxRate    : DEFAULT_TAX_RATE;
    const baseFee = typeof options.deliveryFee === 'number' ? options.deliveryFee : DEFAULT_DELIVERY_FEE;

    const itemCount = cart.reduce((s, i) => s + (parseInt(i.quantity, 10) || 0), 0);
    const subtotal  = roundCurrency(cart.reduce((s, i) => s + Number(i.price) * (parseInt(i.quantity, 10) || 0), 0));
    const tax       = roundCurrency(subtotal * taxRate);
    const isPickup  = options.orderType === 'pickup';
    const delivery  = subtotal > 0 && !isPickup ? roundCurrency(baseFee) : 0;
    const total     = roundCurrency(subtotal + tax + delivery);

    return { itemCount, subtotal, tax, delivery, total };
  }

  /* -- Cart Badge ---------------------------------------------------------- */
  function updateCartBadge() {
    const count = getCartCount();
    document.querySelectorAll('.cart-badge, [data-cart-badge], #cart-count').forEach((el) => {
      el.textContent = String(count);
      el.setAttribute('data-count', String(count));
    });
  }

  /* -- Toast Notification -------------------------------------------------- */
  function showToast(message, duration) {
    duration = duration || 2600;
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
      if (container.children.length === 0) container.remove();
    }, duration);
  }

  /* -- Navbar Mobile Toggle & Active Link Highlight ------------------------ */
  function initNavbarToggle() {
    const toggleBtn = document.querySelector('.navbar-toggle, #navbar-toggle, [data-nav-toggle]');
    const menu      = document.querySelector('.navbar-menu, #navbar-menu');

    if (toggleBtn && menu) {
      toggleBtn.addEventListener('click', () => {
        const isOpen = menu.classList.toggle('is-open');
        toggleBtn.classList.toggle('is-active', isOpen);
        toggleBtn.setAttribute('aria-expanded', String(isOpen));
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menu.classList.contains('is-open')) {
          menu.classList.remove('is-open');
          toggleBtn.classList.remove('is-active');
          toggleBtn.setAttribute('aria-expanded', 'false');
        }
      });

      document.addEventListener('click', (e) => {
        const navbar = toggleBtn.closest('.navbar');
        if (navbar && !navbar.contains(e.target) && menu.classList.contains('is-open')) {
          menu.classList.remove('is-open');
          toggleBtn.classList.remove('is-active');
          toggleBtn.setAttribute('aria-expanded', 'false');
        }
      });
    }

    // Mobile dropdown toggles
    document.querySelectorAll('.nav-dropdown-toggle').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const parent = btn.closest('.nav-dropdown');
        if (parent) parent.classList.toggle('is-open');
      });
    });

    // Active nav link highlighting
    const currentFile = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.navbar-links .nav-link').forEach((link) => {
      const href = link.getAttribute('href') || '';
      const linkFile = href.split('/').pop();
      if (linkFile && linkFile === currentFile) link.classList.add('active');
    });
  }

  /* -- Declarative [data-add-to-cart] buttons ------------------------------ */
  function initAddToCartButtons() {
    document.addEventListener('click', (e) => {
      const button = e.target.closest('[data-add-to-cart]');
      if (!button) return;
      const { id, name, price, quantity, image, notes } = button.dataset;
      addToCart({
        id,
        name,
        price:    Number(price),
        quantity: quantity ? Number(quantity) : 1,
        image,
        notes,
      });
    });
  }

  // Keep badge synced across tabs
  window.addEventListener('storage', (e) => {
    if (e.key === CART_STORAGE_KEY) updateCartBadge();
  });

  /* -- Expose global API (identical shape to app3169.js) ------------------- */
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

  /* ========================================================================
     PART 2 — PAGE-SPECIFIC LOGIC
     (unchanged from js/offers-builder.js — same behaviour, same IDs)
     ======================================================================== */

  const PROMO_CODES = {
    DINE10: {
      code: 'DINE10',
      type: 'percent',
      value: 10,
      description: '10% off your subtotal (synced automatically with Cart & Checkout)',
    },
    FEAST5: {
      code: 'FEAST5',
      type: 'fixed',
      value: 5,
      description: '$5.00 off any combo deal or custom platter order',
    },
    WELCOME10: {
      code: 'WELCOME10',
      type: 'percent',
      value: 10,
      description: '10% welcome savings on your Dine in order',
    },
  };

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = String(text);
    return div.innerHTML;
  }

  /* -------------------------------------------------------------------------
     Page 1 — Deals & Offers
     ----------------------------------------------------------------------- */
  function initDealsPage() {
    const gridEl = document.getElementById('deals-grid');
    if (!gridEl) return;

    const countdownEl    = document.getElementById('deals-countdown');
    const searchInput    = document.getElementById('deals-search');
    const clearSearchBtn = document.getElementById('deals-search-clear');
    const categoryBtns   = document.querySelectorAll('[data-category]');
    const countBadge     = document.getElementById('deals-result-count');
    const emptyStateEl   = document.getElementById('deals-empty-state');
    const resetBtn       = document.getElementById('deals-reset-btn');
    const promoForm      = document.getElementById('promo-form');
    const promoInput     = document.getElementById('promo-code-input');
    const promoAlert     = document.getElementById('promo-alert');
    const promoChips     = document.querySelectorAll('[data-promo-fill]');

    const DEALS = [
      {
        id: 'deal-hearthside-feast',
        name: 'Hearthside Family Feast',
        category: 'Family Combos',
        serves: 'Serves 4',
        badge: 'Save $9.10',
        originalPrice: 45.00,
        price: 35.90,
        description: 'Our signature sharing table with smoky ribs, herb-roasted half chicken, and warm sourdough.',
        includes: [
          'Full Rack Hickory Baby Back Ribs & Herb Half Chicken',
          'Creamy Baked Mac & Cheese & Classic Caesar Salad',
          '4 Warm Garlic Rosemary Sourdough Loaves',
        ],
      },
      {
        id: 'deal-ribeye-lobster-duo',
        name: 'Prime Ribeye & Lobster Duo',
        category: 'Pasta & Mains',
        serves: 'Serves 2',
        badge: 'Save $15.40',
        originalPrice: 55.00,
        price: 39.60,
        description: 'Char-grilled 10oz ribeye steaks paired with garlic butter lobster skewers and truffle mash.',
        includes: [
          'Two 10oz Charred Prime Ribeye Steaks',
          'Garlic Butter Lobster Tail Skewers',
          'Truffle Mashed Potatoes & Grilled Asparagus',
        ],
      },
      {
        id: 'deal-smokehouse-burger-trio',
        name: 'Smokehouse Brisket Burger Trio',
        category: 'Burgers & Grill',
        serves: 'Serves 3',
        badge: 'Save $13.00',
        originalPrice: 45.00,
        price: 32.00,
        description: 'Three slow-smoked beef brisket smash burgers topped with aged cheddar on toasted brioche.',
        includes: [
          '3 Brioche Smoked Brisket Burgers with Aged Cheddar',
          'Large Basket of Crispy Seasoned Fries & Onion Rings',
          'Truffle Aioli & Smokey BBQ Dipping Trio',
        ],
      },
      {
        id: 'deal-truffle-alfredo-pair',
        name: 'Truffle Mushroom Pasta & Flatbread',
        category: 'Pasta & Mains',
        serves: 'Serves 2',
        badge: 'Save $7.50',
        originalPrice: 34.00,
        price: 26.50,
        description: 'Silky wild mushroom fettuccine alfredo served alongside blistered garlic rosemary flatbread.',
        includes: [
          '2 Bowls of Wild Mushroom Truffle Fettuccine',
          'Roasted Garlic & Parmesan Flatbread',
          '2 Crisp Romaine Caesar Salads',
        ],
      },
      {
        id: 'deal-midday-grill-lunch',
        name: 'Midday Grilled Chicken & Slaw',
        category: 'Lunch Specials',
        serves: 'Serves 1',
        badge: 'Save $4.55',
        originalPrice: 19.50,
        price: 14.95,
        description: 'A wholesome weekday lunch plate with honey-mustard grilled chicken and herb rice.',
        includes: [
          'Honey-Mustard Chargrilled Chicken Breast',
          'Herb Garlic Rice & Charred Corn Coleslaw',
          'Freshly Brewed Citrus Iced Tea',
        ],
      },
      {
        id: 'deal-wings-ribs-platter',
        name: 'Game Night Wings & Ribs Platter',
        category: 'Burgers & Grill',
        serves: 'Serves 3–4',
        badge: 'Save $8.50',
        originalPrice: 42.00,
        price: 33.50,
        description: 'Crispy tossed buffalo wings and smoky barbecue pork ribs built for sharing.',
        includes: [
          '18 Crispy Buffalo & Honey-BBQ Wings',
          'Half-Rack Hickory Smoked Ribs',
          'Seasoned Potato Wedges & Blue Cheese Dip',
        ],
      },
      {
        id: 'deal-sunday-roast-table',
        name: 'Sunday Herb Roast Family Table',
        category: 'Family Combos',
        serves: 'Serves 4–5',
        badge: 'Save $13.10',
        originalPrice: 58.00,
        price: 44.90,
        description: 'Slow-roasted garlic beef sirloin carved thick with creamy gratin and honey-glazed carrots.',
        includes: [
          'Slow-Roasted Herb Beef Sirloin (Carved for 4)',
          'Gruyere Potato Gratin & Honey-Glazed Carrots',
          'Warm Sourdough Rolls & Peppercorn Jus',
        ],
      },
      {
        id: 'deal-salmon-lunch-bowl',
        name: 'Pan-Seared Salmon Lunch Bowl',
        category: 'Lunch Specials',
        serves: 'Serves 1',
        badge: 'Save $5.50',
        originalPrice: 23.00,
        price: 17.50,
        description: 'Crisp-skinned Atlantic salmon glazed in lemon butter over herb rice and greens.',
        includes: [
          'Pan-Seared Lemon-Herb Atlantic Salmon',
          'Herb Garlic Rice & Charred Broccolini',
          'House Citrus Vinaigrette Side Salad',
        ],
      },
      {
        id: 'deal-steakhouse-sliders',
        name: 'Steakhouse Sliders & Mac Feast',
        category: 'Burgers & Grill',
        serves: 'Serves 2–3',
        badge: 'Save $8.50',
        originalPrice: 38.00,
        price: 29.50,
        description: 'Six seared prime beef sliders with caramelized onions paired with baked four-cheese mac.',
        includes: [
          '6 Caramelized-Onion Prime Beef Sliders',
          'Skillet Baked Four-Cheese Mac & Cheese',
          'Truffle Parmesan Shoestring Fries',
        ],
      },
    ];

    let activeCategory = 'All';
    let searchQuery    = '';

    /* countdown timer */
    if (countdownEl) {
      let remainingSec = 2 * 3600 + 15 * 60 + 30;
      const fmt = (s) => {
        const h = Math.floor(s / 3600);
        const m = Math.floor((s % 3600) / 60);
        const sec = s % 60;
        return [h, m, sec].map((n) => String(n).padStart(2, '0')).join(':');
      };
      countdownEl.textContent = fmt(remainingSec);
      window.setInterval(() => {
        remainingSec = remainingSec > 0 ? remainingSec - 1 : 2 * 3600 + 15 * 60 + 30;
        countdownEl.textContent = fmt(remainingSec);
      }, 1000);
    }

    function renderDeals() {
      const term = searchQuery.trim().toLowerCase();
      const filtered = DEALS.filter((deal) => {
        const catOk = activeCategory === 'All' || deal.category === activeCategory;
        if (!catOk) return false;
        if (!term) return true;
        const hay = `${deal.name} ${deal.category} ${deal.description} ${deal.includes.join(' ')}`.toLowerCase();
        return hay.includes(term);
      });

      if (countBadge) {
        countBadge.textContent = `${filtered.length} ${filtered.length === 1 ? 'deal' : 'deals'} available`;
      }

      if (filtered.length === 0) {
        gridEl.innerHTML = '';
        emptyStateEl.hidden = false;
        return;
      }

      emptyStateEl.hidden = true;
      gridEl.innerHTML = filtered.map((deal) => `
        <article class="card" data-deal-id="${escapeHtml(deal.id)}">
          <div class="deal-card-top">
            <div class="deal-card-badges">
              <span class="badge badge-primary">${escapeHtml(deal.category)}</span>
              <span class="badge badge-success">${escapeHtml(deal.badge)}</span>
            </div>
            <span class="deal-serves-text">${escapeHtml(deal.serves)}</span>
          </div>
          <div class="card-body">
            <h3 class="card-title">${escapeHtml(deal.name)}</h3>
            <p class="card-text">${escapeHtml(deal.description)}</p>
            <ul class="deal-includes">
              ${deal.includes.map((line) => `<li>${escapeHtml(line)}</li>`).join('')}
            </ul>
          </div>
          <div class="card-footer">
            <div class="deal-price-group">
              <span class="deal-price-original">${formatCurrency(deal.originalPrice)}</span>
              <span class="card-price">${formatCurrency(deal.price)}</span>
            </div>
            <button type="button" class="btn btn-primary btn-sm" data-add-deal="${escapeHtml(deal.id)}">
              Add to Cart
            </button>
          </div>
        </article>
      `).join('');
    }

    function setCategory(cat) {
      activeCategory = cat;
      categoryBtns.forEach((btn) => {
        const match = btn.dataset.category === cat;
        btn.classList.toggle('is-active', match);
        btn.setAttribute('aria-pressed', String(match));
      });
      renderDeals();
    }

    function resetFilters() {
      searchQuery = '';
      if (searchInput) searchInput.value = '';
      if (clearSearchBtn) clearSearchBtn.hidden = true;
      setCategory('All');
    }

    function showPromoAlert(type, html) {
      if (!promoAlert) return;
      promoAlert.className = type ? `alert alert-${type}` : 'alert';
      promoAlert.innerHTML = html;
      promoAlert.hidden = false;
    }

    function renderSavedPromo() {
      const code  = (localStorage.getItem(PROMO_STORAGE_KEY) || '').trim().toUpperCase();
      const promo = PROMO_CODES[code];
      if (!promo) { if (promoAlert) promoAlert.hidden = true; return; }
      if (promoInput) promoInput.value = promo.code;
      showPromoAlert('success',
        `<div class="flex-between">
          <span><strong>Active Code: ${escapeHtml(promo.code)}</strong> — ${escapeHtml(promo.description)}</span>
          <button type="button" id="remove-promo-btn" class="btn btn-outline btn-sm">Remove</button>
        </div>`
      );
    }

    function applyPromoCode(rawCode) {
      const normalized = String(rawCode || '').trim().toUpperCase();
      if (!normalized) {
        showPromoAlert('error', 'Please enter a promo code (try <strong>DINE10</strong>).');
        return;
      }
      const promo = PROMO_CODES[normalized];
      if (!promo) {
        showPromoAlert('error',
          `Promo code <strong>"${escapeHtml(normalized)}"</strong> is not valid. Try <strong>DINE10</strong>, <strong>FEAST5</strong>, or <strong>WELCOME10</strong>.`
        );
        return;
      }
      localStorage.setItem(PROMO_STORAGE_KEY, promo.code);
      renderSavedPromo();
      showToast(`Promo code ${promo.code} applied!`);
    }

    if (searchInput) {
      searchInput.addEventListener('input', () => {
        searchQuery = searchInput.value;
        if (clearSearchBtn) clearSearchBtn.hidden = searchQuery.length === 0;
        renderDeals();
      });
    }

    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', () => {
        searchQuery = '';
        searchInput.value = '';
        clearSearchBtn.hidden = true;
        searchInput.focus();
        renderDeals();
      });
    }

    categoryBtns.forEach((btn) => btn.addEventListener('click', () => setCategory(btn.dataset.category)));
    if (resetBtn) resetBtn.addEventListener('click', resetFilters);

    gridEl.addEventListener('click', (e) => {
      const btn  = e.target.closest('[data-add-deal]');
      if (!btn) return;
      const deal = DEALS.find((d) => d.id === btn.dataset.addDeal);
      if (!deal) return;
      addToCart({ id: deal.id, name: deal.name, price: deal.price, quantity: 1, notes: `${deal.serves} • ${deal.category}` });
    });

    if (promoForm) {
      promoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        applyPromoCode(promoInput ? promoInput.value : '');
      });
    }

    if (promoAlert) {
      promoAlert.addEventListener('click', (e) => {
        if (e.target && e.target.id === 'remove-promo-btn') {
          localStorage.removeItem(PROMO_STORAGE_KEY);
          if (promoInput) promoInput.value = '';
          showPromoAlert('', 'Promo code removed.');
          showToast('Promo code removed.');
        }
      });
    }

    promoChips.forEach((chip) => {
      chip.addEventListener('click', () => {
        const code = chip.dataset.promoFill;
        if (promoInput) promoInput.value = code;
        applyPromoCode(code);
      });
    });

    renderSavedPromo();
    renderDeals();
  }

  /* -------------------------------------------------------------------------
     Page 2 — Build Your Platter
     ----------------------------------------------------------------------- */
  function initBuildPlatterPage() {
    const root = document.getElementById('platter-builder-root');
    if (!root) return;

    const BASES = {
      'herb-rice':       { id: 'herb-rice',       name: 'Herb Garlic Rice',          price: 12.00, kcal: 380 },
      'seasoned-fries':  { id: 'seasoned-fries',  name: 'Crispy Seasoned Fries',      price: 11.00, kcal: 420 },
      'garlic-sourdough':{ id: 'garlic-sourdough',name: 'Artisan Garlic Sourdough',   price: 13.00, kcal: 350 },
    };

    const MAINS = {
      'ribeye-strips':        { id: 'ribeye-strips',        name: 'Herb-Crusted Ribeye Strips',         price: 12.50, kcal: 390 },
      'buffalo-wings':        { id: 'buffalo-wings',        name: 'Crispy Buffalo Wings',               price:  9.50, kcal: 340 },
      'grilled-chicken':      { id: 'grilled-chicken',      name: 'Honey Mustard Grilled Chicken',      price: 10.00, kcal: 290 },
      'garlic-shrimp':        { id: 'garlic-shrimp',        name: 'Garlic Butter Shrimp Skewers',       price: 11.50, kcal: 250 },
      'pulled-beef':          { id: 'pulled-beef',          name: 'Smoky BBQ Pulled Beef',              price: 10.50, kcal: 360 },
      'portobello-halloumi':  { id: 'portobello-halloumi',  name: 'Roasted Portobello & Halloumi',      price:  9.00, kcal: 260 },
    };

    const SIDES = {
      'mac-cheese':   { id: 'mac-cheese',   name: 'Creamy Mac & Cheese',               price: 4.50, kcal: 410 },
      'caesar-salad': { id: 'caesar-salad', name: 'Classic Caesar Salad',               price: 3.50, kcal: 180 },
      'corn-coleslaw':{ id: 'corn-coleslaw',name: 'Charred Corn & Coleslaw',            price: 3.00, kcal: 160 },
      'sauce-trio':   { id: 'sauce-trio',   name: 'Truffle Aioli & Smokey BBQ Trio',    price: 2.00, kcal: 140 },
    };

    const stepBaseEl    = document.getElementById('step-base');
    const stepMainsEl   = document.getElementById('step-mains');
    const summaryListEl = document.getElementById('platter-summary-list');
    const caloriesEl    = document.getElementById('platter-calories');
    const totalEl       = document.getElementById('platter-total');
    const alertEl       = document.getElementById('platter-alert');
    const notesInput    = document.getElementById('platter-notes');
    const addBtn        = document.getElementById('add-platter-btn');
    const resetBtn      = document.getElementById('reset-platter-btn');

    function getState() {
      const baseRadio = root.querySelector('input[name="platterBase"]:checked');
      const base  = baseRadio ? BASES[baseRadio.value] : null;
      const mains = Array.from(root.querySelectorAll('input[name="platterMain"]:checked')).map((el) => MAINS[el.value]).filter(Boolean);
      const sides = Array.from(root.querySelectorAll('input[name="platterSide"]:checked')).map((el) => SIDES[el.value]).filter(Boolean);
      const spiceRadio = root.querySelector('input[name="spiceLevel"]:checked');
      const spice = spiceRadio ? spiceRadio.value : 'Medium';
      const notes = notesInput ? notesInput.value.trim() : '';
      return { base, mains, sides, spice, notes };
    }

    function syncOptionCards() {
      root.querySelectorAll('.option-card').forEach((card) => {
        const input = card.querySelector('input');
        if (input) card.classList.toggle('is-selected', input.checked);
      });
    }

    function computeTotals(state) {
      let price = state.base ? state.base.price : 0;
      let kcal  = state.base ? state.base.kcal  : 0;
      state.mains.forEach((m) => { price += m.price; kcal += m.kcal; });
      state.sides.forEach((s) => { price += s.price; kcal += s.kcal; });
      return { price, kcal };
    }

    function renderSummary() {
      syncOptionCards();
      const state  = getState();
      const totals = computeTotals(state);
      const rows   = [];

      if (state.base) {
        rows.push(`<div class="summary-item-line"><span><strong>${escapeHtml(state.base.name)}</strong></span><span>${formatCurrency(state.base.price)}</span></div>`);
      } else {
        rows.push(`<div class="summary-item-line summary-item-muted"><span>1. Platter Base (required)</span><span>Not selected</span></div>`);
      }

      if (state.mains.length > 0) {
        state.mains.forEach((m) => {
          rows.push(`<div class="summary-item-line"><span>• ${escapeHtml(m.name)}</span><span>${formatCurrency(m.price)}</span></div>`);
        });
      } else {
        rows.push(`<div class="summary-item-line summary-item-muted"><span>2. Main Items (select at least 1)</span><span>None chosen</span></div>`);
      }

      state.sides.forEach((s) => {
        rows.push(`<div class="summary-item-line"><span>• ${escapeHtml(s.name)}</span><span>${formatCurrency(s.price)}</span></div>`);
      });

      rows.push(`<div class="summary-item-line summary-item-muted"><span>Spice Level</span><span>${escapeHtml(state.spice)}</span></div>`);
      if (state.notes) {
        rows.push(`<div class="summary-item-line summary-item-muted"><span>Kitchen Note</span><span>${escapeHtml(state.notes)}</span></div>`);
      }

      summaryListEl.innerHTML = rows.join('');
      caloriesEl.textContent  = `${totals.kcal.toLocaleString('en-US')} kcal`;
      totalEl.textContent     = formatCurrency(totals.price);
    }

    function clearErrors() {
      [stepBaseEl, stepMainsEl].forEach((el) => { if (el) el.classList.remove('has-error'); });
    }

    function validatePlatter(state) {
      clearErrors();
      const errors = [];
      let firstInvalid = null;
      if (!state.base) {
        errors.push('Select a platter base in Step 1.');
        if (stepBaseEl) { stepBaseEl.classList.add('has-error'); firstInvalid = firstInvalid || stepBaseEl; }
      }
      if (state.mains.length < 1) {
        errors.push('Select at least 1 main grill item in Step 2.');
        if (stepMainsEl) { stepMainsEl.classList.add('has-error'); firstInvalid = firstInvalid || stepMainsEl; }
      }
      return { valid: errors.length === 0, errors, firstInvalid };
    }

    root.addEventListener('change', () => { clearErrors(); if (alertEl) alertEl.hidden = true; renderSummary(); });
    if (notesInput) notesInput.addEventListener('input', renderSummary);

    if (addBtn) {
      addBtn.addEventListener('click', () => {
        const state = getState();
        const check = validatePlatter(state);
        if (!check.valid) {
          alertEl.className = 'alert alert-error';
          alertEl.innerHTML = check.errors.map((e) => `<div>${escapeHtml(e)}</div>`).join('');
          alertEl.hidden = false;
          if (check.firstInvalid) check.firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
          showToast(check.errors[0]);
          return;
        }
        const totals = computeTotals(state);
        const sig    = [state.base.id, state.mains.map((m) => m.id).join('+'), state.sides.map((s) => s.id).join('+'), state.spice].join('-');
        const noteParts = [
          `Mains: ${state.mains.map((m) => m.name).join(', ')}`,
          state.sides.length ? `Sides: ${state.sides.map((s) => s.name).join(', ')}` : '',
          `Spice: ${state.spice}`,
          `${totals.kcal.toLocaleString('en-US')} kcal`,
          state.notes ? `Note: ${state.notes}` : '',
        ].filter(Boolean);

        addToCart({ id: `custom-platter-${sig}`, name: `Custom Platter (${state.base.name})`, price: totals.price, quantity: 1, notes: noteParts.join(' | ') });
        alertEl.className = 'alert alert-success';
        alertEl.innerHTML = `<strong>Added to Cart!</strong> Custom Platter (${formatCurrency(totals.price)} &bull; ${totals.kcal.toLocaleString('en-US')} kcal) is ready in your cart.`;
        alertEl.hidden = false;
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        const def = root.querySelector('input[name="platterBase"][value="herb-rice"]');
        if (def) def.checked = true;
        root.querySelectorAll('input[type="checkbox"]').forEach((cb) => { cb.checked = false; });
        const defSpice = root.querySelector('input[name="spiceLevel"][value="Medium"]');
        if (defSpice) defSpice.checked = true;
        if (notesInput) notesInput.value = '';
        clearErrors();
        if (alertEl) alertEl.hidden = true;
        renderSummary();
      });
    }

    renderSummary();
  }

  /* -------------------------------------------------------------------------
     Page 3 — Gift Vouchers
     ----------------------------------------------------------------------- */
  function initGiftVouchersPage() {
    const form = document.getElementById('voucher-form');
    if (!form) return;

    const cardTypeBtns      = document.querySelectorAll('[data-card-type]');
    const amountBtns        = document.querySelectorAll('[data-voucher-amount]');
    const customAmountWrap  = document.getElementById('custom-amount-wrap');
    const customAmountInput = document.getElementById('voucher-custom-amount');
    const occasionBtns      = document.querySelectorAll('[data-voucher-occasion]');
    const recipientNameInput  = document.getElementById('recipient-name');
    const recipientEmailInput = document.getElementById('recipient-email');
    const senderNameInput     = document.getElementById('sender-name');
    const deliveryDateInput   = document.getElementById('delivery-date');
    const messageInput        = document.getElementById('voucher-message');
    const charCounter         = document.getElementById('message-char-count');
    const previewTypeEl       = document.getElementById('preview-card-type');
    const previewOccasionEl   = document.getElementById('preview-occasion');
    const previewAmountEl     = document.getElementById('preview-amount');
    const previewMessageEl    = document.getElementById('preview-message');
    const previewRecipientEl  = document.getElementById('preview-recipient');
    const previewSenderEl     = document.getElementById('preview-sender');
    const previewDateEl       = document.getElementById('preview-date');
    const previewCodeEl       = document.getElementById('preview-code');
    const summaryTypeEl       = document.getElementById('summary-card-type');
    const summaryFeeEl        = document.getElementById('summary-delivery-fee');
    const summaryValueEl      = document.getElementById('summary-voucher-value');
    const summaryTotalEl      = document.getElementById('summary-voucher-total');
    const voucherAlert        = document.getElementById('voucher-alert');

    let cardType        = 'egift';
    let presetAmount    = 50;
    let isCustomAmount  = false;
    let selectedOccasion = 'Birthday';

    const today = new Date();
    const todayStr = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, '0'),
      String(today.getDate()).padStart(2, '0'),
    ].join('-');

    if (deliveryDateInput) {
      deliveryDateInput.min = todayStr;
      if (!deliveryDateInput.value) deliveryDateInput.value = todayStr;
    }

    function getActiveAmount() {
      if (!isCustomAmount) return presetAmount;
      const val = Number(customAmountInput ? customAmountInput.value : 0);
      return Number.isNaN(val) ? 0 : Math.round(val * 100) / 100;
    }

    function getCardTypeInfo() {
      if (cardType === 'physical') {
        return { key: 'physical', badge: 'Physical Card', summaryLabel: 'Physical Cards (Embossed Sleeve)', fee: 5.0 };
      }
      return { key: 'egift', badge: 'e-Gift Card', summaryLabel: 'e-Gift Cards (Instant Email)', fee: 0.0 };
    }

    function buildVoucherCode(recipient, amount) {
      const letters = (recipient || 'DINE').replace(/[^a-zA-Z]/g, '').toUpperCase();
      const prefix  = (letters.slice(0, 4) || 'DINE').padEnd(4, 'X');
      const amtNum  = Math.max(10, Math.round(amount || 50));
      return `DINE-${prefix}-${amtNum}`;
    }

    function updatePreviewAndSummary() {
      const amount   = getActiveAmount();
      const typeInfo = getCardTypeInfo();
      const total    = (amount > 0 ? amount : 0) + typeInfo.fee;
      const recipient = recipientNameInput  ? recipientNameInput.value.trim()  : '';
      const sender    = senderNameInput     ? senderNameInput.value.trim()     : '';
      const message   = messageInput        ? messageInput.value.trim()        : '';
      const dateVal   = deliveryDateInput   ? deliveryDateInput.value          : todayStr;

      if (charCounter && messageInput) charCounter.textContent = `${messageInput.value.length} / 160 characters`;

      if (previewTypeEl)      previewTypeEl.textContent      = typeInfo.badge;
      if (previewOccasionEl)  previewOccasionEl.textContent  = selectedOccasion;
      if (previewAmountEl)    previewAmountEl.textContent    = amount > 0 ? formatCurrency(amount) : '$0.00';
      if (previewMessageEl) {
        previewMessageEl.textContent = message
          ? `"${message}"`
          : '"Enjoy an unforgettable dining experience filled with warm flavors and great company."';
      }
      if (previewRecipientEl) previewRecipientEl.textContent = recipient || 'Valued Guest';
      if (previewSenderEl)    previewSenderEl.textContent    = sender    || 'Your Name';
      if (previewDateEl)      previewDateEl.textContent      = dateVal   || todayStr;
      if (previewCodeEl)      previewCodeEl.textContent      = buildVoucherCode(recipient, amount);

      if (summaryTypeEl)  summaryTypeEl.textContent  = typeInfo.summaryLabel;
      if (summaryValueEl) summaryValueEl.textContent = amount > 0 ? formatCurrency(amount) : '$0.00';
      if (summaryFeeEl)   summaryFeeEl.textContent   = formatCurrency(typeInfo.fee);
      if (summaryTotalEl) summaryTotalEl.textContent = formatCurrency(total);
    }

    function setError(input, errorId, message) {
      const errEl = document.getElementById(errorId);
      if (input) input.classList.toggle('is-invalid', Boolean(message));
      if (errEl) errEl.textContent = message || '';
    }

    function validateVoucherForm() {
      let valid = true;
      const amount = getActiveAmount();

      if (isCustomAmount) {
        if (!amount || amount < 10 || amount > 1000) {
          setError(customAmountInput, 'error-custom-amount', 'Enter a custom amount between $10.00 and $1,000.00.');
          valid = false;
        } else { setError(customAmountInput, 'error-custom-amount', ''); }
      } else { setError(customAmountInput, 'error-custom-amount', ''); }

      const recipient = recipientNameInput.value.trim();
      if (recipient.length < 2) { setError(recipientNameInput, 'error-recipient-name', 'Please enter the recipient\u2019s name.'); valid = false; }
      else { setError(recipientNameInput, 'error-recipient-name', ''); }

      const email = recipientEmailInput.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError(recipientEmailInput, 'error-recipient-email', 'Please enter a valid recipient email address.'); valid = false; }
      else { setError(recipientEmailInput, 'error-recipient-email', ''); }

      const sender = senderNameInput.value.trim();
      if (sender.length < 2) { setError(senderNameInput, 'error-sender-name', 'Please enter your name.'); valid = false; }
      else { setError(senderNameInput, 'error-sender-name', ''); }

      const dateVal = deliveryDateInput.value;
      if (!dateVal || dateVal < todayStr) { setError(deliveryDateInput, 'error-delivery-date', 'Choose today or a future delivery date.'); valid = false; }
      else { setError(deliveryDateInput, 'error-delivery-date', ''); }

      return valid;
    }

    cardTypeBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        cardType = btn.dataset.cardType;
        cardTypeBtns.forEach((b) => { const a = b === btn; b.classList.toggle('is-active', a); b.setAttribute('aria-pressed', String(a)); });
        updatePreviewAndSummary();
      });
    });

    amountBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const val = btn.dataset.voucherAmount;
        amountBtns.forEach((b) => b.classList.toggle('is-active', b === btn));
        if (val === 'custom') {
          isCustomAmount = true;
          if (customAmountWrap) customAmountWrap.hidden = false;
          if (customAmountInput) customAmountInput.focus();
        } else {
          isCustomAmount = false;
          presetAmount = Number(val);
          if (customAmountWrap) customAmountWrap.hidden = true;
          setError(customAmountInput, 'error-custom-amount', '');
        }
        updatePreviewAndSummary();
      });
    });

    occasionBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        selectedOccasion = btn.dataset.voucherOccasion;
        occasionBtns.forEach((b) => { const a = b === btn; b.classList.toggle('is-active', a); b.setAttribute('aria-pressed', String(a)); });
        updatePreviewAndSummary();
      });
    });

    [customAmountInput, recipientNameInput, recipientEmailInput, senderNameInput, deliveryDateInput, messageInput].forEach((el) => {
      if (!el) return;
      el.addEventListener('input', () => { if (voucherAlert) voucherAlert.hidden = true; updatePreviewAndSummary(); });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validateVoucherForm()) {
        if (voucherAlert) { voucherAlert.className = 'alert alert-error'; voucherAlert.textContent = 'Please fix the highlighted voucher fields before continuing.'; voucherAlert.hidden = false; }
        showToast('Please check the highlighted gift voucher fields.');
        return;
      }
      const amount     = getActiveAmount();
      const typeInfo   = getCardTypeInfo();
      const total      = amount + typeInfo.fee;
      const recipient  = recipientNameInput.value.trim();
      const email      = recipientEmailInput.value.trim();
      const sender     = senderNameInput.value.trim();
      const deliveryDate = deliveryDateInput.value;

      addToCart({
        id:       `gift-voucher-${typeInfo.key}-${amount}-${Date.now()}`,
        name:     `Dine in ${typeInfo.badge} (${formatCurrency(amount)})`,
        price:    total,
        quantity: 1,
        notes:    `${selectedOccasion} \u2022 To: ${recipient} (${email}) \u2022 From: ${sender} \u2022 Date: ${deliveryDate}`,
      });

      if (voucherAlert) {
        voucherAlert.className = 'alert alert-success';
        voucherAlert.innerHTML = `<strong>Voucher Added!</strong> ${formatCurrency(amount)} ${escapeHtml(typeInfo.badge)} for <strong>${escapeHtml(recipient)}</strong> is in your cart.`;
        voucherAlert.hidden = false;
      }
    });

    updatePreviewAndSummary();
  }

  /* ========================================================================
     PART 3 — DOMContentLoaded Initialization
     ======================================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    initNavbarToggle();
    initAddToCartButtons();
    updateCartBadge();
    initDealsPage();
    initBuildPlatterPage();
    initGiftVouchersPage();
  });

})(window, document);
