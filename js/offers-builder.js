// Name: Badiuzzaman Mian
// Roll no: i263171
// Section: SE-D
/**
 * Dine in — Page-Specific Logic for Member 3 Module
 * Powers:
 *   1. pages/deals.html (Countdown timer, live search/category filter, promo codes, deal cart)
 *   2. pages/build-platter.html (4-step custom platter builder with live USD & kcal totals)
 *   3. pages/gift-vouchers.html (e-Gift / Physical voucher configurator & live preview)
 *
 * Interoperates with window.DineInCart from js/app3169.js and checkout.html promo key.
 */
(function (window, document) {
  'use strict';

  const PROMO_STORAGE_KEY = 'dinein_promo_v1';

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

  function cartApi() {
    return window.DineInCart;
  }

  function addItemToCart(item) {
    const api = cartApi();
    if (!api) return;
    if (typeof api.addToCart === 'function') {
      api.addToCart(item);
    } else if (typeof api.addItem === 'function') {
      api.addItem(item);
    }
  }

  function formatUSD(amount) {
    const api = cartApi();
    if (api && typeof api.formatCurrency === 'function') {
      return api.formatCurrency(amount);
    }
    return `$${Number(amount || 0).toFixed(2)}`;
  }

  function notifyToast(message) {
    const api = cartApi();
    if (api && typeof api.showToast === 'function') {
      api.showToast(message);
    }
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = String(text);
    return div.innerHTML;
  }

  /* ========================================================================
     1. DEALS & OFFERS PAGE (pages/deals.html)
     ======================================================================== */
  function initDealsPage() {
    const gridEl = document.getElementById('deals-grid');
    if (!gridEl) return;

    const countdownEl = document.getElementById('deals-countdown');
    const searchInput = document.getElementById('deals-search');
    const clearSearchBtn = document.getElementById('deals-search-clear');
    const categoryBtns = document.querySelectorAll('[data-category]');
    const countBadge = document.getElementById('deals-result-count');
    const emptyStateEl = document.getElementById('deals-empty-state');
    const resetBtn = document.getElementById('deals-reset-btn');

    const promoForm = document.getElementById('promo-form');
    const promoInput = document.getElementById('promo-code-input');
    const promoAlert = document.getElementById('promo-alert');
    const promoChips = document.querySelectorAll('[data-promo-fill]');

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
    let searchQuery = '';

    // Live ticking countdown timer ("Expires in 02:15:30")
    if (countdownEl) {
      let remainingSeconds = 2 * 3600 + 15 * 60 + 30;
      const formatClock = (totalSec) => {
        const hrs = Math.floor(totalSec / 3600);
        const mins = Math.floor((totalSec % 3600) / 60);
        const secs = totalSec % 60;
        return [hrs, mins, secs].map((n) => String(n).padStart(2, '0')).join(':');
      };

      countdownEl.textContent = formatClock(remainingSeconds);
      window.setInterval(() => {
        remainingSeconds = remainingSeconds > 0 ? remainingSeconds - 1 : 2 * 3600 + 15 * 60 + 30;
        countdownEl.textContent = formatClock(remainingSeconds);
      }, 1000);
    }

    function renderDeals() {
      const term = searchQuery.trim().toLowerCase();
      const filtered = DEALS.filter((deal) => {
        const matchesCategory = activeCategory === 'All' || deal.category === activeCategory;
        if (!matchesCategory) return false;
        if (!term) return true;
        const text = `${deal.name} ${deal.category} ${deal.description} ${deal.includes.join(' ')}`.toLowerCase();
        return text.includes(term);
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
      gridEl.innerHTML = filtered
        .map((deal) => {
          return `
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
                  <span class="deal-price-original">${formatUSD(deal.originalPrice)}</span>
                  <span class="card-price">${formatUSD(deal.price)}</span>
                </div>
                <button type="button" class="btn btn-primary btn-sm" data-add-deal="${escapeHtml(deal.id)}">
                  Add to Cart
                </button>
              </div>
            </article>
          `;
        })
        .join('');
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
      const code = (localStorage.getItem(PROMO_STORAGE_KEY) || '').trim().toUpperCase();
      const promo = PROMO_CODES[code];
      if (!promo) {
        if (promoAlert) promoAlert.hidden = true;
        return;
      }
      if (promoInput) promoInput.value = promo.code;
      showPromoAlert(
        'success',
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
        showPromoAlert(
          'error',
          `Promo code <strong>"${escapeHtml(normalized)}"</strong> is not valid. Try <strong>DINE10</strong>, <strong>FEAST5</strong>, or <strong>WELCOME10</strong>.`
        );
        return;
      }

      localStorage.setItem(PROMO_STORAGE_KEY, promo.code);
      renderSavedPromo();
      notifyToast(`Promo code ${promo.code} applied!`);
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

    categoryBtns.forEach((btn) => {
      btn.addEventListener('click', () => setCategory(btn.dataset.category));
    });

    if (resetBtn) {
      resetBtn.addEventListener('click', resetFilters);
    }

    gridEl.addEventListener('click', (event) => {
      const btn = event.target.closest('[data-add-deal]');
      if (!btn) return;
      const deal = DEALS.find((d) => d.id === btn.dataset.addDeal);
      if (!deal) return;

      addItemToCart({
        id: deal.id,
        name: deal.name,
        price: deal.price,
        quantity: 1,
        notes: `${deal.serves} • ${deal.category}`,
      });
    });

    if (promoForm) {
      promoForm.addEventListener('submit', (event) => {
        event.preventDefault();
        applyPromoCode(promoInput ? promoInput.value : '');
      });
    }

    if (promoAlert) {
      promoAlert.addEventListener('click', (event) => {
        if (event.target && event.target.id === 'remove-promo-btn') {
          localStorage.removeItem(PROMO_STORAGE_KEY);
          if (promoInput) promoInput.value = '';
          showPromoAlert('', 'Promo code removed.');
          notifyToast('Promo code removed.');
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

  /* ========================================================================
     2. BUILD YOUR PLATTER PAGE (pages/build-platter.html)
     ======================================================================== */
  function initBuildPlatterPage() {
    const root = document.getElementById('platter-builder-root');
    if (!root) return;

    const BASES = {
      'herb-rice': { id: 'herb-rice', name: 'Herb Garlic Rice', price: 12.00, kcal: 380 },
      'seasoned-fries': { id: 'seasoned-fries', name: 'Crispy Seasoned Fries', price: 11.00, kcal: 420 },
      'garlic-sourdough': { id: 'garlic-sourdough', name: 'Artisan Garlic Sourdough', price: 13.00, kcal: 350 },
    };

    const MAINS = {
      'ribeye-strips': { id: 'ribeye-strips', name: 'Herb-Crusted Ribeye Strips', price: 12.50, kcal: 390 },
      'buffalo-wings': { id: 'buffalo-wings', name: 'Crispy Buffalo Wings', price: 9.50, kcal: 340 },
      'grilled-chicken': { id: 'grilled-chicken', name: 'Honey Mustard Grilled Chicken', price: 10.00, kcal: 290 },
      'garlic-shrimp': { id: 'garlic-shrimp', name: 'Garlic Butter Shrimp Skewers', price: 11.50, kcal: 250 },
      'pulled-beef': { id: 'pulled-beef', name: 'Smoky BBQ Pulled Beef', price: 10.50, kcal: 360 },
      'portobello-halloumi': { id: 'portobello-halloumi', name: 'Roasted Portobello & Halloumi', price: 9.00, kcal: 260 },
    };

    const SIDES = {
      'mac-cheese': { id: 'mac-cheese', name: 'Creamy Mac & Cheese', price: 4.50, kcal: 410 },
      'caesar-salad': { id: 'caesar-salad', name: 'Classic Caesar Salad', price: 3.50, kcal: 180 },
      'corn-coleslaw': { id: 'corn-coleslaw', name: 'Charred Corn & Coleslaw', price: 3.00, kcal: 160 },
      'sauce-trio': { id: 'sauce-trio', name: 'Truffle Aioli & Smokey BBQ Trio', price: 2.00, kcal: 140 },
    };

    const stepBaseEl = document.getElementById('step-base');
    const stepMainsEl = document.getElementById('step-mains');
    const summaryListEl = document.getElementById('platter-summary-list');
    const caloriesEl = document.getElementById('platter-calories');
    const totalEl = document.getElementById('platter-total');
    const alertEl = document.getElementById('platter-alert');
    const notesInput = document.getElementById('platter-notes');
    const addBtn = document.getElementById('add-platter-btn');
    const resetBtn = document.getElementById('reset-platter-btn');

    function getState() {
      const baseRadio = root.querySelector('input[name="platterBase"]:checked');
      const base = baseRadio ? BASES[baseRadio.value] : null;

      const mains = Array.from(root.querySelectorAll('input[name="platterMain"]:checked'))
        .map((el) => MAINS[el.value])
        .filter(Boolean);

      const sides = Array.from(root.querySelectorAll('input[name="platterSide"]:checked'))
        .map((el) => SIDES[el.value])
        .filter(Boolean);

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
      let kcal = state.base ? state.base.kcal : 0;

      state.mains.forEach((m) => {
        price += m.price;
        kcal += m.kcal;
      });

      state.sides.forEach((s) => {
        price += s.price;
        kcal += s.kcal;
      });

      return { price, kcal };
    }

    function renderSummary() {
      syncOptionCards();
      const state = getState();
      const totals = computeTotals(state);
      const rows = [];

      if (state.base) {
        rows.push(
          `<div class="summary-item-line">
            <span><strong>${escapeHtml(state.base.name)}</strong></span>
            <span>${formatUSD(state.base.price)}</span>
          </div>`
        );
      } else {
        rows.push(
          `<div class="summary-item-line summary-item-muted">
            <span>1. Platter Base (required)</span>
            <span>Not selected</span>
          </div>`
        );
      }

      if (state.mains.length > 0) {
        state.mains.forEach((m) => {
          rows.push(
            `<div class="summary-item-line">
              <span>• ${escapeHtml(m.name)}</span>
              <span>${formatUSD(m.price)}</span>
            </div>`
          );
        });
      } else {
        rows.push(
          `<div class="summary-item-line summary-item-muted">
            <span>2. Main Items (select at least 1)</span>
            <span>None chosen</span>
          </div>`
        );
      }

      state.sides.forEach((s) => {
        rows.push(
          `<div class="summary-item-line">
            <span>• ${escapeHtml(s.name)}</span>
            <span>${formatUSD(s.price)}</span>
          </div>`
        );
      });

      rows.push(
        `<div class="summary-item-line summary-item-muted">
          <span>Spice Level</span>
          <span>${escapeHtml(state.spice)}</span>
        </div>`
      );

      if (state.notes) {
        rows.push(
          `<div class="summary-item-line summary-item-muted">
            <span>Kitchen Note</span>
            <span>${escapeHtml(state.notes)}</span>
          </div>`
        );
      }

      summaryListEl.innerHTML = rows.join('');
      caloriesEl.textContent = `${totals.kcal.toLocaleString('en-US')} kcal`;
      totalEl.textContent = formatUSD(totals.price);
    }

    function clearErrors() {
      [stepBaseEl, stepMainsEl].forEach((el) => {
        if (el) el.classList.remove('has-error');
      });
    }

    function validatePlatter(state) {
      clearErrors();
      const errors = [];
      let firstInvalid = null;

      if (!state.base) {
        errors.push('Select a platter base in Step 1.');
        if (stepBaseEl) {
          stepBaseEl.classList.add('has-error');
          firstInvalid = firstInvalid || stepBaseEl;
        }
      }

      if (state.mains.length < 1) {
        errors.push('Select at least 1 main grill item in Step 2.');
        if (stepMainsEl) {
          stepMainsEl.classList.add('has-error');
          firstInvalid = firstInvalid || stepMainsEl;
        }
      }

      return { valid: errors.length === 0, errors, firstInvalid };
    }

    root.addEventListener('change', () => {
      clearErrors();
      if (alertEl) alertEl.hidden = true;
      renderSummary();
    });

    if (notesInput) {
      notesInput.addEventListener('input', renderSummary);
    }

    if (addBtn) {
      addBtn.addEventListener('click', () => {
        const state = getState();
        const check = validatePlatter(state);

        if (!check.valid) {
          alertEl.className = 'alert alert-error';
          alertEl.innerHTML = check.errors.map((err) => `<div>${escapeHtml(err)}</div>`).join('');
          alertEl.hidden = false;
          if (check.firstInvalid) {
            check.firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          notifyToast(check.errors[0]);
          return;
        }

        const totals = computeTotals(state);
        const signature = [
          state.base.id,
          state.mains.map((m) => m.id).join('+'),
          state.sides.map((s) => s.id).join('+'),
          state.spice,
        ].join('-');

        const noteParts = [
          `Mains: ${state.mains.map((m) => m.name).join(', ')}`,
          state.sides.length ? `Sides: ${state.sides.map((s) => s.name).join(', ')}` : '',
          `Spice: ${state.spice}`,
          `${totals.kcal.toLocaleString('en-US')} kcal`,
          state.notes ? `Note: ${state.notes}` : '',
        ].filter(Boolean);

        addItemToCart({
          id: `custom-platter-${signature}`,
          name: `Custom Platter (${state.base.name})`,
          price: totals.price,
          quantity: 1,
          notes: noteParts.join(' | '),
        });

        alertEl.className = 'alert alert-success';
        alertEl.innerHTML = `<strong>Added to Cart!</strong> Custom Platter (${formatUSD(totals.price)} &bull; ${totals.kcal.toLocaleString('en-US')} kcal) is ready in your cart.`;
        alertEl.hidden = false;
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        const defaultBase = root.querySelector('input[name="platterBase"][value="herb-rice"]');
        if (defaultBase) defaultBase.checked = true;
        root.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
          cb.checked = false;
        });
        const defaultSpice = root.querySelector('input[name="spiceLevel"][value="Medium"]');
        if (defaultSpice) defaultSpice.checked = true;
        if (notesInput) notesInput.value = '';
        clearErrors();
        if (alertEl) alertEl.hidden = true;
        renderSummary();
      });
    }

    renderSummary();
  }

  /* ========================================================================
     3. GIFT VOUCHERS PAGE (pages/gift-vouchers.html)
     ======================================================================== */
  function initGiftVouchersPage() {
    const form = document.getElementById('voucher-form');
    if (!form) return;

    const cardTypeBtns = document.querySelectorAll('[data-card-type]');
    const amountBtns = document.querySelectorAll('[data-voucher-amount]');
    const customAmountWrap = document.getElementById('custom-amount-wrap');
    const customAmountInput = document.getElementById('voucher-custom-amount');
    const occasionBtns = document.querySelectorAll('[data-voucher-occasion]');

    const recipientNameInput = document.getElementById('recipient-name');
    const recipientEmailInput = document.getElementById('recipient-email');
    const senderNameInput = document.getElementById('sender-name');
    const deliveryDateInput = document.getElementById('delivery-date');
    const messageInput = document.getElementById('voucher-message');
    const charCounter = document.getElementById('message-char-count');

    const previewTypeEl = document.getElementById('preview-card-type');
    const previewOccasionEl = document.getElementById('preview-occasion');
    const previewAmountEl = document.getElementById('preview-amount');
    const previewMessageEl = document.getElementById('preview-message');
    const previewRecipientEl = document.getElementById('preview-recipient');
    const previewSenderEl = document.getElementById('preview-sender');
    const previewDateEl = document.getElementById('preview-date');
    const previewCodeEl = document.getElementById('preview-code');

    const summaryTypeEl = document.getElementById('summary-card-type');
    const summaryFeeEl = document.getElementById('summary-delivery-fee');
    const summaryValueEl = document.getElementById('summary-voucher-value');
    const summaryTotalEl = document.getElementById('summary-voucher-total');
    const voucherAlert = document.getElementById('voucher-alert');

    let cardType = 'egift'; // 'egift' ($0) or 'physical' ($5)
    let presetAmount = 50;
    let isCustomAmount = false;
    let selectedOccasion = 'Birthday';

    // Default delivery date to today
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
        return {
          key: 'physical',
          badge: 'Physical Card',
          summaryLabel: 'Physical Cards (Embossed Sleeve)',
          fee: 5.0,
        };
      }
      return {
        key: 'egift',
        badge: 'e-Gift Card',
        summaryLabel: 'e-Gift Cards (Instant Email)',
        fee: 0.0,
      };
    }

    function buildVoucherCode(recipient, amount) {
      const letters = (recipient || 'DINE').replace(/[^a-zA-Z]/g, '').toUpperCase();
      const prefix = (letters.slice(0, 4) || 'DINE').padEnd(4, 'X');
      const amtNum = Math.max(10, Math.round(amount || 50));
      return `DINE-${prefix}-${amtNum}`;
    }

    function updatePreviewAndSummary() {
      const amount = getActiveAmount();
      const typeInfo = getCardTypeInfo();
      const total = (amount > 0 ? amount : 0) + typeInfo.fee;

      const recipient = recipientNameInput ? recipientNameInput.value.trim() : '';
      const sender = senderNameInput ? senderNameInput.value.trim() : '';
      const message = messageInput ? messageInput.value.trim() : '';
      const dateVal = deliveryDateInput ? deliveryDateInput.value : todayStr;

      if (charCounter && messageInput) {
        charCounter.textContent = `${messageInput.value.length} / 160 characters`;
      }

      if (previewTypeEl) previewTypeEl.textContent = typeInfo.badge;
      if (previewOccasionEl) previewOccasionEl.textContent = selectedOccasion;
      if (previewAmountEl) previewAmountEl.textContent = amount > 0 ? formatUSD(amount) : '$0.00';
      if (previewMessageEl) {
        previewMessageEl.textContent = message
          ? `"${message}"`
          : '"Enjoy an unforgettable dining experience filled with warm flavors and great company."';
      }
      if (previewRecipientEl) previewRecipientEl.textContent = recipient || 'Valued Guest';
      if (previewSenderEl) previewSenderEl.textContent = sender || 'Your Name';
      if (previewDateEl) previewDateEl.textContent = dateVal || todayStr;
      if (previewCodeEl) previewCodeEl.textContent = buildVoucherCode(recipient, amount);

      if (summaryTypeEl) summaryTypeEl.textContent = typeInfo.summaryLabel;
      if (summaryValueEl) summaryValueEl.textContent = amount > 0 ? formatUSD(amount) : '$0.00';
      if (summaryFeeEl) summaryFeeEl.textContent = formatUSD(typeInfo.fee);
      if (summaryTotalEl) summaryTotalEl.textContent = formatUSD(total);
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
        } else {
          setError(customAmountInput, 'error-custom-amount', '');
        }
      } else {
        setError(customAmountInput, 'error-custom-amount', '');
      }

      const recipient = recipientNameInput.value.trim();
      if (recipient.length < 2) {
        setError(recipientNameInput, 'error-recipient-name', 'Please enter the recipient’s name.');
        valid = false;
      } else {
        setError(recipientNameInput, 'error-recipient-name', '');
      }

      const email = recipientEmailInput.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError(recipientEmailInput, 'error-recipient-email', 'Please enter a valid recipient email address.');
        valid = false;
      } else {
        setError(recipientEmailInput, 'error-recipient-email', '');
      }

      const sender = senderNameInput.value.trim();
      if (sender.length < 2) {
        setError(senderNameInput, 'error-sender-name', 'Please enter your name.');
        valid = false;
      } else {
        setError(senderNameInput, 'error-sender-name', '');
      }

      const dateVal = deliveryDateInput.value;
      if (!dateVal || dateVal < todayStr) {
        setError(deliveryDateInput, 'error-delivery-date', 'Choose today or a future delivery date.');
        valid = false;
      } else {
        setError(deliveryDateInput, 'error-delivery-date', '');
      }

      return valid;
    }

    cardTypeBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        cardType = btn.dataset.cardType;
        cardTypeBtns.forEach((b) => {
          const active = b === btn;
          b.classList.toggle('is-active', active);
          b.setAttribute('aria-pressed', String(active));
        });
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
        occasionBtns.forEach((b) => {
          const active = b === btn;
          b.classList.toggle('is-active', active);
          b.setAttribute('aria-pressed', String(active));
        });
        updatePreviewAndSummary();
      });
    });

    [
      customAmountInput,
      recipientNameInput,
      recipientEmailInput,
      senderNameInput,
      deliveryDateInput,
      messageInput,
    ].forEach((el) => {
      if (!el) return;
      el.addEventListener('input', () => {
        if (voucherAlert) voucherAlert.hidden = true;
        updatePreviewAndSummary();
      });
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!validateVoucherForm()) {
        if (voucherAlert) {
          voucherAlert.className = 'alert alert-error';
          voucherAlert.textContent = 'Please fix the highlighted voucher fields before continuing.';
          voucherAlert.hidden = false;
        }
        notifyToast('Please check the highlighted gift voucher fields.');
        return;
      }

      const amount = getActiveAmount();
      const typeInfo = getCardTypeInfo();
      const total = amount + typeInfo.fee;
      const recipient = recipientNameInput.value.trim();
      const email = recipientEmailInput.value.trim();
      const sender = senderNameInput.value.trim();
      const deliveryDate = deliveryDateInput.value;

      addItemToCart({
        id: `gift-voucher-${typeInfo.key}-${amount}-${Date.now()}`,
        name: `Dine in ${typeInfo.badge} (${formatUSD(amount)})`,
        price: total,
        quantity: 1,
        notes: `${selectedOccasion} • To: ${recipient} (${email}) • From: ${sender} • Date: ${deliveryDate}`,
      });

      if (voucherAlert) {
        voucherAlert.className = 'alert alert-success';
        voucherAlert.innerHTML = `<strong>Voucher Added!</strong> ${formatUSD(amount)} ${escapeHtml(typeInfo.badge)} for <strong>${escapeHtml(recipient)}</strong> is in your cart.`;
        voucherAlert.hidden = false;
      }
    });

    updatePreviewAndSummary();
  }

  document.addEventListener('DOMContentLoaded', () => {
    initDealsPage();
    initBuildPlatterPage();
    initGiftVouchersPage();
  });
})(window, document);
