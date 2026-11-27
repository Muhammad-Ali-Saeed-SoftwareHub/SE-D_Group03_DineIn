/**
 * Dine in — Member 3 (26I-3171) Interactive Features
 * Pages: deals.html, build-platter.html, gift-vouchers.html
 * Vanilla ES6 JavaScript (Depends on window.DineInCart from js/app.js)
 */

'use strict';

(function () {
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = String(text ?? '');
    return div.innerHTML;
  }

  function formatMoney(amount) {
    if (window.DineInCart && typeof window.DineInCart.formatCurrency === 'function') {
      return window.DineInCart.formatCurrency(amount);
    }
    return `$${Number(amount || 0).toFixed(2)}`;
  }

  function notifyToast(message) {
    if (window.DineInCart && typeof window.DineInCart.showToast === 'function') {
      window.DineInCart.showToast(message);
    }
  }

  function addItemToCart(item) {
    if (window.DineInCart && typeof window.DineInCart.addToCart === 'function') {
      return window.DineInCart.addToCart(item);
    }
    return [];
  }

  /* ========================================================================
     1. Deals Page (pages/deals.html)
     ======================================================================== */
  function initDealsPage() {
    const dealsGrid = document.getElementById('deals-grid');
    if (!dealsGrid) return;

    const countdownEl = document.getElementById('deals-countdown');
    const countdownBanner = document.getElementById('countdown-banner');
    const searchInput = document.getElementById('deals-search');
    const categorySelect = document.getElementById('deals-category');
    const countLabel = document.getElementById('deals-count');

    const DEALS_DATA = [
      {
        id: 'deal-wood-fired-feast',
        title: 'Wood-Fired Family Feast',
        category: 'Family Meals',
        discountPercent: 25,
        originalPrice: 48.0,
        price: 35.9,
        description: 'Whole herb-roasted chicken, two artisan flatbreads, charred corn salad, and four house drinks.',
        accent: '#D9532F',
        iconType: 'platter',
      },
      {
        id: 'deal-truffle-pasta-duo',
        title: 'Truffle Pasta Duo',
        category: 'Combos',
        discountPercent: 20,
        originalPrice: 49.5,
        price: 39.6,
        description: 'Two bowls of wild mushroom truffle pasta paired with warm roasted garlic bread and sparkling citrus.',
        accent: '#B94121',
        iconType: 'pasta',
      },
      {
        id: 'deal-smoky-grill-box',
        title: 'Smoky Grill Platter Box',
        category: 'Platters',
        discountPercent: 30,
        originalPrice: 45.7,
        price: 32.0,
        description: 'Slow-smoked brisket slices, spiced chicken skewers, saffron pilaf, and smoky chipotle aioli.',
        accent: '#7C3420',
        iconType: 'grill',
      },
      {
        id: 'deal-mezze-lunch-express',
        title: 'Midday Mezze Lunch',
        category: 'Lunch Specials',
        discountPercent: 22,
        originalPrice: 26.5,
        price: 20.6,
        description: 'Crispy falafel bites, creamy hummus, warm sourdough pita, and fattoush crunch bowl.',
        accent: '#2E7D32',
        iconType: 'bowl',
      },
      {
        id: 'deal-brisket-burger-combo',
        title: 'Brisket Burger & Fries Combo',
        category: 'Combos',
        discountPercent: 18,
        originalPrice: 24.4,
        price: 20.0,
        description: 'Double-smoked brisket burger with aged cheddar, truffle parmesan fries, and house iced tea.',
        accent: '#C26D0A',
        iconType: 'burger',
      },
      {
        id: 'deal-sweet-finale-trio',
        title: 'Sweet Finale Dessert Trio',
        category: 'Desserts',
        discountPercent: 35,
        originalPrice: 30.8,
        price: 20.0,
        description: 'Pistachio baklava bites, warm dark chocolate tart, and vanilla bean tiramisu cups for sharing.',
        accent: '#5F5852',
        iconType: 'dessert',
      },
    ];

    function getDealSvg(iconType, accent) {
      const icons = {
        platter: `<svg viewBox="0 0 96 96" aria-hidden="true"><circle cx="48" cy="52" r="34" fill="#FFFDF9" stroke="${accent}" stroke-width="4"/><circle cx="48" cy="52" r="24" fill="#FBECE8"/><ellipse cx="38" cy="48" rx="10" ry="7" fill="${accent}"/><ellipse cx="57" cy="53" rx="9" ry="6" fill="#2E7D32"/><circle cx="46" cy="61" r="6" fill="#C26D0A"/></svg>`,
        pasta: `<svg viewBox="0 0 96 96" aria-hidden="true"><path d="M16 48c0 18 14 30 32 30s32-12 32-30H16z" fill="#FFFDF9" stroke="${accent}" stroke-width="4"/><path d="M24 46c6-10 16-12 24-6s18-4 24 6" fill="none" stroke="#C26D0A" stroke-width="4" stroke-linecap="round"/><circle cx="42" cy="40" r="4" fill="${accent}"/><circle cx="56" cy="42" r="4" fill="#2E7D32"/></svg>`,
        grill: `<svg viewBox="0 0 96 96" aria-hidden="true"><rect x="16" y="34" width="64" height="38" rx="14" fill="#FFFDF9" stroke="${accent}" stroke-width="4"/><line x1="26" y1="45" x2="70" y2="45" stroke="${accent}" stroke-width="4" stroke-linecap="round"/><line x1="26" y1="56" x2="70" y2="56" stroke="#1E1E1E" stroke-width="4" stroke-linecap="round"/><path d="M34 26c0-5 5-6 5-10M48 26c0-5 5-6 5-10M62 26c0-5 5-6 5-10" fill="none" stroke="${accent}" stroke-width="3" stroke-linecap="round"/></svg>`,
        bowl: `<svg viewBox="0 0 96 96" aria-hidden="true"><path d="M18 46h60c0 18-13 30-30 30S18 64 18 46z" fill="#FFFDF9" stroke="${accent}" stroke-width="4"/><circle cx="36" cy="40" r="8" fill="#C26D0A"/><circle cx="52" cy="37" r="9" fill="#2E7D32"/><circle cx="62" cy="42" r="7" fill="#D9532F"/></svg>`,
        burger: `<svg viewBox="0 0 96 96" aria-hidden="true"><path d="M22 42c0-13 12-20 26-20s26 7 26 20H22z" fill="#E3A857" stroke="#1E1E1E" stroke-width="3"/><rect x="20" y="45" width="56" height="8" rx="4" fill="#2E7D32"/><rect x="20" y="53" width="56" height="10" rx="4" fill="${accent}"/><path d="M22 65h52c0 8-8 12-26 12s-26-4-26-12z" fill="#E3A857" stroke="#1E1E1E" stroke-width="3"/></svg>`,
        dessert: `<svg viewBox="0 0 96 96" aria-hidden="true"><ellipse cx="48" cy="68" rx="30" ry="9" fill="#FFFDF9" stroke="${accent}" stroke-width="3.5"/><path d="M30 65l18-34 18 34H30z" fill="#FBECE8" stroke="${accent}" stroke-width="3.5" stroke-linejoin="round"/><circle cx="48" cy="26" r="6" fill="#D9532F"/></svg>`,
      };
      return icons[iconType] || icons.platter;
    }

    // Live countdown starting at 02:15:30 (8130 seconds)
    let remainingSeconds = 2 * 3600 + 15 * 60 + 30;
    function renderCountdown() {
      if (!countdownEl) return;
      if (remainingSeconds <= 0) {
        countdownEl.textContent = '00:00:00 (Expired)';
        if (countdownBanner) countdownBanner.classList.add('is-expired');
        return;
      }
      const hours = String(Math.floor(remainingSeconds / 3600)).padStart(2, '0');
      const mins = String(Math.floor((remainingSeconds % 3600) / 60)).padStart(2, '0');
      const secs = String(remainingSeconds % 60).padStart(2, '0');
      countdownEl.textContent = `${hours}:${mins}:${secs}`;
    }

    renderCountdown();
    window.setInterval(() => {
      if (remainingSeconds > 0) {
        remainingSeconds -= 1;
        renderCountdown();
      }
    }, 1000);

    function renderDeals() {
      const query = (searchInput ? searchInput.value : '').trim().toLowerCase();
      const selectedCat = categorySelect ? categorySelect.value : 'all';

      const filtered = DEALS_DATA.filter((deal) => {
        const matchesCat = selectedCat === 'all' || deal.category === selectedCat;
        const matchesText =
          !query ||
          deal.title.toLowerCase().includes(query) ||
          deal.description.toLowerCase().includes(query) ||
          deal.category.toLowerCase().includes(query);
        return matchesCat && matchesText;
      });

      if (countLabel) {
        countLabel.textContent = `${filtered.length} ${filtered.length === 1 ? 'Deal' : 'Deals'} Available`;
      }

      if (filtered.length === 0) {
        dealsGrid.innerHTML = `
          <div class="deals-empty">
            <h3>No matching deals found</h3>
            <p class="mb-2">Try clearing your search or choosing another deal category.</p>
            <button type="button" class="btn btn-outline btn-sm" id="reset-deals-filter">Reset Filters</button>
          </div>
        `;
        const resetBtn = document.getElementById('reset-deals-filter');
        if (resetBtn) {
          resetBtn.addEventListener('click', () => {
            if (searchInput) searchInput.value = '';
            if (categorySelect) categorySelect.value = 'all';
            renderDeals();
          });
        }
        return;
      }

      dealsGrid.innerHTML = filtered
        .map((deal) => {
          const savings = Math.max(0, deal.originalPrice - deal.price);
          return `
            <article class="card deal-card">
              <div class="deal-visual">
                <span class="badge badge-charcoal deal-category-tag">${escapeHtml(deal.category)}</span>
                <span class="deal-discount-badge">-${deal.discountPercent}%</span>
                ${getDealSvg(deal.iconType, deal.accent)}
              </div>
              <div class="card-body">
                <div class="deal-meta-row">
                  <span class="badge badge-primary">Limited Time</span>
                  <span class="deal-savings">Save ${formatMoney(savings)}</span>
                </div>
                <h2 class="card-title">${escapeHtml(deal.title)}</h2>
                <p class="card-text">${escapeHtml(deal.description)}</p>
              </div>
              <div class="card-footer">
                <div class="deal-pricing">
                  <span class="deal-original-price">${formatMoney(deal.originalPrice)}</span>
                  <span class="card-price">${formatMoney(deal.price)}</span>
                </div>
                <button
                  type="button"
                  class="btn btn-primary btn-sm"
                  data-add-to-cart
                  data-id="${escapeHtml(deal.id)}"
                  data-name="${escapeHtml(deal.title)}"
                  data-price="${deal.price.toFixed(2)}"
                  data-notes="Deal (${deal.discountPercent}% off)">
                  Add to Cart
                </button>
              </div>
            </article>
          `;
        })
        .join('');
    }

    if (searchInput) searchInput.addEventListener('input', renderDeals);
    if (categorySelect) categorySelect.addEventListener('change', renderDeals);
    renderDeals();
  }

  /* ========================================================================
     2. Build Your Own Platter Page (pages/build-platter.html)
     ======================================================================== */
  function initBuildPlatterPage() {
    const workspace = document.getElementById('platter-workspace');
    if (!workspace) return;

    const CATALOG = {
      bases: [
        {
          id: 'base-herb-rice',
          name: 'Herb Garlic Rice',
          description: 'Fluffy jasmine rice tossed with roasted garlic and parsley.',
          calories: 310,
          price: 6.5,
          abbr: 'HR',
        },
        {
          id: 'base-flatbread',
          name: 'Artisan Sourdough Flatbread',
          description: 'Stone-baked blistered flatbread brushed with olive oil.',
          calories: 340,
          price: 7.0,
          abbr: 'FB',
        },
        {
          id: 'base-quinoa-greens',
          name: 'Quinoa & Roasted Greens',
          description: 'Warm tri-color quinoa over baby kale and lemon vinaigrette.',
          calories: 260,
          price: 7.5,
          abbr: 'QG',
        },
        {
          id: 'base-saffron-pilaf',
          name: 'Saffron Basmati Pilaf',
          description: 'Aromatic long-grain basmati infused with saffron threads.',
          calories: 330,
          price: 7.25,
          abbr: 'SP',
        },
      ],
      items: [
        {
          id: 'item-chicken-shawarma',
          name: 'Chargrilled Chicken Shawarma',
          description: 'Citrus-marinated chicken thighs shaved fresh off the spit.',
          calories: 320,
          price: 8.5,
          abbr: 'CS',
        },
        {
          id: 'item-smoked-brisket',
          name: 'Smoked Beef Brisket',
          description: '12-hour hickory-smoked brisket with cracked pepper glaze.',
          calories: 410,
          price: 10.5,
          abbr: 'BB',
        },
        {
          id: 'item-halloumi-skewers',
          name: 'Crispy Halloumi Skewers',
          description: 'Golden seared halloumi cheese with oregano & honey drizzle.',
          calories: 290,
          price: 7.75,
          abbr: 'HS',
        },
        {
          id: 'item-herb-salmon',
          name: 'Garlic Herb Salmon',
          description: 'Pan-seared Atlantic salmon fillet with dill & charred lemon.',
          calories: 360,
          price: 11.0,
          abbr: 'GS',
        },
        {
          id: 'item-falafel-bites',
          name: 'Spiced Falafel Bites',
          description: 'Crispy herb chickpea falafel served with tahini drizzle.',
          calories: 270,
          price: 6.25,
          abbr: 'FB',
        },
      ],
      sides: [
        {
          id: 'side-hummus-pita',
          name: 'Creamy Hummus & Pita',
          description: 'Velvety whipped tahini hummus topped with paprika oil.',
          calories: 190,
          price: 4.25,
          abbr: 'HM',
        },
        {
          id: 'side-truffle-fries',
          name: 'Truffle Parmesan Fries',
          description: 'Hand-cut crispy fries dusted with aged parmesan.',
          calories: 310,
          price: 5.0,
          abbr: 'TF',
        },
        {
          id: 'side-corn-avocado',
          name: 'Charred Corn & Avocado Salad',
          description: 'Fire-roasted sweet corn, ripe avocado, and lime cilantro.',
          calories: 160,
          price: 4.5,
          abbr: 'CA',
        },
        {
          id: 'side-garlic-potatoes',
          name: 'Roasted Garlic Potatoes',
          description: 'Crispy baby potatoes with rosemary and sea salt.',
          calories: 220,
          price: 4.0,
          abbr: 'GP',
        },
        {
          id: 'side-baklava-duo',
          name: 'Baklava Bite Duo',
          description: 'Flaky phyllo pastry layered with toasted pistachios.',
          calories: 240,
          price: 4.75,
          abbr: 'BK',
        },
      ],
    };

    const state = {
      activeTab: 'bases',
      selectedBase: null,
      items: {}, // id -> quantity
      sides: {}, // id -> quantity
    };

    const tabs = workspace.querySelectorAll('.platter-tab');
    const itemsGrid = document.getElementById('platter-items-grid');
    const plateBaseEl = document.getElementById('platter-plate-base');
    const plateTokensEl = document.getElementById('platter-plate-tokens');
    const canvasChipsEl = document.getElementById('platter-canvas-list');
    const clearPlatterBtn = document.getElementById('clear-platter-btn');

    const summaryListEl = document.getElementById('platter-summary-list');
    const summaryCaloriesEl = document.getElementById('platter-total-calories');
    const summarySubtotalEl = document.getElementById('platter-subtotal');
    const summaryTaxEl = document.getElementById('platter-tax');
    const summaryTotalEl = document.getElementById('platter-total-price');
    const countBadgeEl = document.getElementById('platter-item-count');
    const paymentSelectEl = document.getElementById('platter-payment-method');
    const addToCartBtn = document.getElementById('platter-add-cart-btn');
    const summaryBoxEl = document.getElementById('platter-summary-box');

    const mobileCaloriesEl = document.getElementById('mobile-summary-calories');
    const mobileTotalEl = document.getElementById('mobile-summary-total');
    const mobileScrollBtn = document.getElementById('mobile-scroll-summary-btn');
    const mobileAddBtn = document.getElementById('mobile-add-cart-btn');

    const flowSteps = document.querySelectorAll('.platter-flow-step');

    const modalBackdrop = document.getElementById('platter-confirm-modal');
    const modalDescEl = document.getElementById('platter-modal-desc');
    const modalBuildAnotherBtn = document.getElementById('platter-build-another-btn');

    function findCatalogEntry(category, id) {
      return CATALOG[category].find((entry) => entry.id === id) || null;
    }

    function getSelectedEntries() {
      const chosen = [];
      if (state.selectedBase) {
        const base = findCatalogEntry('bases', state.selectedBase);
        if (base) chosen.push({ category: 'bases', qty: 1, ...base });
      }
      Object.entries(state.items).forEach(([id, qty]) => {
        if (qty > 0) {
          const item = findCatalogEntry('items', id);
          if (item) chosen.push({ category: 'items', qty, ...item });
        }
      });
      Object.entries(state.sides).forEach(([id, qty]) => {
        if (qty > 0) {
          const side = findCatalogEntry('sides', id);
          if (side) chosen.push({ category: 'sides', qty, ...side });
        }
      });
      return chosen;
    }

    function computeMetrics() {
      const entries = getSelectedEntries();
      const totalCount = entries.reduce((sum, entry) => sum + entry.qty, 0);
      const totalCalories = entries.reduce((sum, entry) => sum + entry.calories * entry.qty, 0);
      const subtotal = entries.reduce((sum, entry) => sum + entry.price * entry.qty, 0);
      const taxRate =
        window.DineInCart && typeof window.DineInCart.DEFAULT_TAX_RATE === 'number'
          ? window.DineInCart.DEFAULT_TAX_RATE
          : 0.08;
      const tax = subtotal * taxRate;
      const total = subtotal + tax;
      return { entries, totalCount, totalCalories, subtotal, tax, total };
    }

    function updateFlowSteps(entries) {
      const hasBase = Boolean(state.selectedBase);
      const hasItems = entries.some((e) => e.category === 'items');
      const hasSides = entries.some((e) => e.category === 'sides');

      flowSteps.forEach((stepEl) => {
        const step = stepEl.dataset.flow;
        stepEl.classList.remove('is-active', 'is-complete');
        if (step === 'bases') {
          if (hasBase) stepEl.classList.add('is-complete');
          else if (state.activeTab === 'bases') stepEl.classList.add('is-active');
        } else if (step === 'items') {
          if (hasItems) stepEl.classList.add('is-complete');
          else if (state.activeTab === 'items') stepEl.classList.add('is-active');
        } else if (step === 'sides') {
          if (hasSides) stepEl.classList.add('is-complete');
          else if (state.activeTab === 'sides') stepEl.classList.add('is-active');
        } else if (step === 'review') {
          if (hasBase && hasItems) stepEl.classList.add('is-active');
        }
      });
    }

    function renderCategoryItems() {
      const list = CATALOG[state.activeTab] || [];
      itemsGrid.innerHTML = list
        .map((entry) => {
          const isBase = state.activeTab === 'bases';
          const qty = isBase
            ? state.selectedBase === entry.id
              ? 1
              : 0
            : state[state.activeTab][entry.id] || 0;
          const isSelected = qty > 0;

          let actionHtml = '';
          if (isBase) {
            actionHtml = `
              <button
                type="button"
                class="btn ${isSelected ? 'btn-secondary' : 'btn-outline'} btn-sm"
                data-platter-select-base="${escapeHtml(entry.id)}">
                ${isSelected ? 'Selected' : 'Choose Base'}
              </button>
            `;
          } else if (qty > 0) {
            actionHtml = `
              <div class="qty-control">
                <button type="button" aria-label="Decrease ${escapeHtml(entry.name)}" data-platter-dec="${escapeHtml(state.activeTab)}:${escapeHtml(entry.id)}">-</button>
                <span>${qty}</span>
                <button type="button" aria-label="Increase ${escapeHtml(entry.name)}" data-platter-inc="${escapeHtml(state.activeTab)}:${escapeHtml(entry.id)}">+</button>
              </div>
            `;
          } else {
            actionHtml = `
              <button
                type="button"
                class="btn btn-primary btn-sm"
                data-platter-inc="${escapeHtml(state.activeTab)}:${escapeHtml(entry.id)}">
                + Add
              </button>
            `;
          }

          return `
            <div class="platter-option-card ${isSelected ? 'is-selected' : ''}">
              <div class="platter-option-main">
                <div class="platter-option-icon">${escapeHtml(entry.abbr)}</div>
                <div class="platter-option-info">
                  <div class="platter-option-title">${escapeHtml(entry.name)}</div>
                  <p class="platter-option-meta">${escapeHtml(entry.description)}</p>
                  <p class="platter-option-meta"><strong>${entry.calories} kcal</strong></p>
                </div>
              </div>
              <div class="platter-option-actions">
                <span class="platter-option-price">${formatMoney(entry.price)}</span>
                ${actionHtml}
              </div>
            </div>
          `;
        })
        .join('');
    }

    function renderCanvasAndSummary() {
      const { entries, totalCount, totalCalories, subtotal, tax, total } = computeMetrics();
      updateFlowSteps(entries);

      if (countBadgeEl) countBadgeEl.textContent = String(totalCount);

      // Plate Base
      const baseEntry = state.selectedBase ? findCatalogEntry('bases', state.selectedBase) : null;
      if (baseEntry) {
        plateBaseEl.textContent = `Base: ${baseEntry.name}`;
        plateBaseEl.classList.remove('is-empty');
      } else {
        plateBaseEl.textContent = 'Select a Base first';
        plateBaseEl.classList.add('is-empty');
      }

      // Plate Tokens (Items + Sides)
      const nonBaseEntries = entries.filter((entry) => entry.category !== 'bases');
      if (nonBaseEntries.length === 0) {
        plateTokensEl.innerHTML =
          '<span class="text-muted" style="font-size:0.78rem;">Add items &amp; sides to fill your platter</span>';
      } else {
        plateTokensEl.innerHTML = nonBaseEntries
          .map(
            (entry) =>
              `<span class="platter-plate-token ${entry.category === 'sides' ? 'is-side' : ''}">${escapeHtml(entry.abbr)}${entry.qty > 1 ? ` ×${entry.qty}` : ''}</span>`
          )
          .join('');
      }

      // Canvas Chips below plate
      if (entries.length === 0) {
        canvasChipsEl.innerHTML =
          '<p class="text-muted mb-0" style="font-size:0.86rem;">Your platter is empty. Pick a base, mains, and sides on the left.</p>';
      } else {
        canvasChipsEl.innerHTML = entries
          .map(
            (entry) => `
              <span class="canvas-chip">
                <span>${escapeHtml(entry.name)}${entry.qty > 1 ? ` (×${entry.qty})` : ''}</span>
                <button
                  type="button"
                  aria-label="Remove ${escapeHtml(entry.name)}"
                  data-platter-remove="${escapeHtml(entry.category)}:${escapeHtml(entry.id)}">&times;</button>
              </span>
            `
          )
          .join('');
      }

      // Summary Box Breakdown
      if (entries.length === 0) {
        summaryListEl.innerHTML =
          '<p class="platter-summary-empty">No items selected yet.</p>';
      } else {
        summaryListEl.innerHTML = entries
          .map(
            (entry) => `
              <div class="platter-summary-item">
                <span class="platter-summary-item-name">${escapeHtml(entry.name)}${entry.qty > 1 ? ` ×${entry.qty}` : ''}</span>
                <span class="platter-summary-item-right">
                  <span>${formatMoney(entry.price * entry.qty)}</span>
                  <button
                    type="button"
                    class="platter-remove-btn"
                    aria-label="Remove ${escapeHtml(entry.name)}"
                    data-platter-remove="${escapeHtml(entry.category)}:${escapeHtml(entry.id)}">&times;</button>
                </span>
              </div>
            `
          )
          .join('');
      }

      summaryCaloriesEl.textContent = `${totalCalories} kcal`;
      summarySubtotalEl.textContent = formatMoney(subtotal);
      if (summaryTaxEl) summaryTaxEl.textContent = formatMoney(tax);
      summaryTotalEl.textContent = formatMoney(total);

      if (mobileCaloriesEl) mobileCaloriesEl.textContent = `${totalCalories} kcal · ${totalCount} items`;
      if (mobileTotalEl) mobileTotalEl.textContent = formatMoney(total);
    }

    function removeEntry(category, id) {
      if (category === 'bases') {
        if (state.selectedBase === id) state.selectedBase = null;
      } else {
        delete state[category][id];
      }
      renderCategoryItems();
      renderCanvasAndSummary();
    }

    function resetPlatter() {
      state.selectedBase = null;
      state.items = {};
      state.sides = {};
      renderCategoryItems();
      renderCanvasAndSummary();
    }

    function handleAddPlatterToCart() {
      const { entries, totalCount, totalCalories, subtotal, total } = computeMetrics();
      if (entries.length === 0) {
        notifyToast('Please choose at least one base or item before adding your platter.');
        return;
      }

      const baseEntry = state.selectedBase ? findCatalogEntry('bases', state.selectedBase) : null;
      const summaryParts = entries.map((e) => (e.qty > 1 ? `${e.name} ×${e.qty}` : e.name));
      const paymentMethod = paymentSelectEl ? paymentSelectEl.value : 'Pay at Checkout';

      const platterName = baseEntry
        ? `Custom Platter (${baseEntry.name})`
        : `Custom Platter (${totalCount} items)`;

      const platterId = `custom-platter-${Date.now()}`;
      addItemToCart({
        id: platterId,
        name: platterName,
        price: subtotal,
        quantity: 1,
        notes: `${summaryParts.join(', ')} | ${totalCalories} kcal | Preferred: ${paymentMethod}`,
      });

      if (modalBackdrop && modalDescEl) {
        modalDescEl.textContent = `${platterName} (${totalCalories} kcal, Est. Total ${formatMoney(total)}) has been added to your cart.`;
        modalBackdrop.hidden = false;
      }
    }

    // Tab switching
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const nextTab = tab.dataset.tab;
        if (!nextTab || !CATALOG[nextTab]) return;
        state.activeTab = nextTab;
        tabs.forEach((btn) => {
          const active = btn.dataset.tab === nextTab;
          btn.classList.toggle('is-active', active);
          btn.setAttribute('aria-selected', String(active));
        });
        renderCategoryItems();
        renderCanvasAndSummary();
      });
    });

    // Event delegation on item grid
    itemsGrid.addEventListener('click', (event) => {
      const baseBtn = event.target.closest('[data-platter-select-base]');
      if (baseBtn) {
        const id = baseBtn.dataset.platterSelectBase;
        state.selectedBase = state.selectedBase === id ? null : id;
        renderCategoryItems();
        renderCanvasAndSummary();
        return;
      }

      const incBtn = event.target.closest('[data-platter-inc]');
      if (incBtn) {
        const [category, id] = incBtn.dataset.platterInc.split(':');
        state[category][id] = (state[category][id] || 0) + 1;
        renderCategoryItems();
        renderCanvasAndSummary();
        return;
      }

      const decBtn = event.target.closest('[data-platter-dec]');
      if (decBtn) {
        const [category, id] = decBtn.dataset.platterDec.split(':');
        const nextQty = (state[category][id] || 0) - 1;
        if (nextQty <= 0) delete state[category][id];
        else state[category][id] = nextQty;
        renderCategoryItems();
        renderCanvasAndSummary();
      }
    });

    // Event delegation for chip/summary removals
    workspace.addEventListener('click', (event) => {
      const removeBtn = event.target.closest('[data-platter-remove]');
      if (!removeBtn) return;
      const [category, id] = removeBtn.dataset.platterRemove.split(':');
      removeEntry(category, id);
    });

    if (clearPlatterBtn) {
      clearPlatterBtn.addEventListener('click', () => {
        resetPlatter();
        notifyToast('Platter canvas cleared.');
      });
    }

    if (addToCartBtn) addToCartBtn.addEventListener('click', handleAddPlatterToCart);
    if (mobileAddBtn) mobileAddBtn.addEventListener('click', handleAddPlatterToCart);

    if (mobileScrollBtn && summaryBoxEl) {
      mobileScrollBtn.addEventListener('click', () => {
        summaryBoxEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }

    if (modalBuildAnotherBtn && modalBackdrop) {
      modalBuildAnotherBtn.addEventListener('click', () => {
        modalBackdrop.hidden = true;
        resetPlatter();
      });
    }

    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', (event) => {
        if (event.target === modalBackdrop) {
          modalBackdrop.hidden = true;
        }
      });
    }

    // Seed with first base unselected so user sees clean canvas; render initial view
    renderCategoryItems();
    renderCanvasAndSummary();
  }

  /* ========================================================================
     3. Gift Vouchers Page (pages/gift-vouchers.html)
     ======================================================================== */
  function initGiftVouchersPage() {
    const form = document.getElementById('voucher-form');
    if (!form) return;

    let cardType = 'egift'; // 'egift' | 'physical'

    const typeButtons = document.querySelectorAll('[data-voucher-type]');
    const presetButtons = document.querySelectorAll('[data-amount-preset]');

    const amountInput = document.getElementById('voucher-amount');
    const recipientNameInput = document.getElementById('recipient-name');
    const emailGroup = document.getElementById('email-field-group');
    const emailInput = document.getElementById('recipient-email');
    const addressGroup = document.getElementById('address-field-group');
    const addressInput = document.getElementById('delivery-address');
    const messageInput = document.getElementById('voucher-message');
    const charCountEl = document.getElementById('voucher-char-count');
    const formFeedbackEl = document.getElementById('voucher-feedback');

    // Live Preview Elements
    const previewCardEl = document.getElementById('voucher-preview-card');
    const previewTypeBadge = document.getElementById('preview-type-badge');
    const previewAmountEl = document.getElementById('preview-amount');
    const previewRecipientEl = document.getElementById('preview-recipient');
    const previewMessageEl = document.getElementById('preview-message');
    const previewDeliveryEl = document.getElementById('preview-delivery');

    function syncTypeUI() {
      typeButtons.forEach((btn) => {
        const isActive = btn.dataset.voucherType === cardType;
        btn.classList.toggle('is-active', isActive);
        btn.setAttribute('aria-pressed', String(isActive));
      });

      const isPhysical = cardType === 'physical';
      if (emailGroup) emailGroup.hidden = isPhysical;
      if (addressGroup) addressGroup.hidden = !isPhysical;

      if (emailInput) emailInput.required = !isPhysical;
      if (addressInput) addressInput.required = isPhysical;

      if (previewCardEl) previewCardEl.classList.toggle('is-physical', isPhysical);
      if (previewTypeBadge) {
        previewTypeBadge.textContent = isPhysical ? 'Physical Gift Card' : 'e-Gift Voucher';
      }
      if (previewDeliveryEl) {
        previewDeliveryEl.textContent = isPhysical
          ? 'Mailed in keepsake sleeve'
          : 'Instant email delivery';
      }
    }

    function syncPreview() {
      const rawAmount = parseFloat(amountInput.value);
      const safeAmount = Number.isNaN(rawAmount) || rawAmount < 0 ? 0 : rawAmount;
      if (previewAmountEl) previewAmountEl.textContent = formatMoney(safeAmount);

      const recipient = recipientNameInput.value.trim();
      if (previewRecipientEl) {
        previewRecipientEl.textContent = recipient ? `To: ${recipient}` : 'To: Someone Special';
      }

      const message = messageInput.value.trim();
      if (previewMessageEl) {
        previewMessageEl.textContent = message
          ? `"${message}"`
          : '"Enjoy a warm, freshly prepared meal at Dine in!"';
      }

      if (charCountEl) {
        charCountEl.textContent = `${messageInput.value.length} / 180`;
      }

      presetButtons.forEach((btn) => {
        const presetVal = parseFloat(btn.dataset.amountPreset);
        btn.classList.toggle('is-active', Math.abs(presetVal - safeAmount) < 0.01);
      });
    }

    function setFieldError(inputEl, errorId, message) {
      const errorEl = document.getElementById(errorId);
      if (inputEl) inputEl.classList.toggle('is-invalid', Boolean(message));
      if (errorEl) errorEl.textContent = message || '';
    }

    typeButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        cardType = btn.dataset.voucherType === 'physical' ? 'physical' : 'egift';
        setFieldError(emailInput, 'error-recipient-email', '');
        setFieldError(addressInput, 'error-delivery-address', '');
        syncTypeUI();
      });
    });

    presetButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        amountInput.value = btn.dataset.amountPreset;
        setFieldError(amountInput, 'error-voucher-amount', '');
        syncPreview();
      });
    });

    [amountInput, recipientNameInput, messageInput].forEach((input) => {
      if (input) input.addEventListener('input', syncPreview);
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      let isValid = true;

      const amount = parseFloat(amountInput.value);
      if (Number.isNaN(amount) || amount < 10 || amount > 500) {
        setFieldError(amountInput, 'error-voucher-amount', 'Enter a voucher amount between $10 and $500.');
        isValid = false;
      } else {
        setFieldError(amountInput, 'error-voucher-amount', '');
      }

      const recipientName = recipientNameInput.value.trim();
      if (!recipientName) {
        setFieldError(recipientNameInput, 'error-recipient-name', 'Please enter the recipient name.');
        isValid = false;
      } else {
        setFieldError(recipientNameInput, 'error-recipient-name', '');
      }

      let deliveryDetail = '';
      if (cardType === 'egift') {
        const email = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          setFieldError(emailInput, 'error-recipient-email', 'Please enter a valid recipient email address.');
          isValid = false;
        } else {
          setFieldError(emailInput, 'error-recipient-email', '');
          deliveryDetail = `Email: ${email}`;
        }
      } else {
        const address = addressInput.value.trim();
        if (address.length < 8) {
          setFieldError(addressInput, 'error-delivery-address', 'Please enter a complete street delivery address.');
          isValid = false;
        } else {
          setFieldError(addressInput, 'error-delivery-address', '');
          deliveryDetail = `Ship to: ${address}`;
        }
      }

      if (!isValid) {
        if (formFeedbackEl) formFeedbackEl.hidden = true;
        return;
      }

      const messageText = messageInput.value.trim();
      const labelType = cardType === 'physical' ? 'Physical Gift Card' : 'e-Gift Card';
      const voucherId = `voucher-${cardType}-${Math.round(amount)}-${Date.now()}`;

      addItemToCart({
        id: voucherId,
        name: `${labelType} (${formatMoney(amount)}) for ${recipientName}`,
        price: amount,
        quantity: 1,
        notes: `${deliveryDetail}${messageText ? ` | Message: "${messageText}"` : ''}`,
      });

      if (formFeedbackEl) {
        formFeedbackEl.hidden = false;
        formFeedbackEl.innerHTML = `
          <strong>Voucher added to cart!</strong> ${escapeHtml(labelType)} of <strong>${formatMoney(amount)}</strong> for <strong>${escapeHtml(recipientName)}</strong> is ready.
          <a href="cart.html" class="text-accent" style="font-weight:600; text-decoration:underline; margin-left:0.35rem;">View Cart &amp; Checkout</a>
        `;
      }
    });

    syncTypeUI();
    syncPreview();
  }

  document.addEventListener('DOMContentLoaded', () => {
    initDealsPage();
    initBuildPlatterPage();
    initGiftVouchersPage();
  });
})();
