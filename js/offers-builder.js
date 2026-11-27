/**
 * DineIn — Page-Specific Logic
 * Powers pages/deals.html, pages/build-platter.html, and pages/gift-vouchers.html
 * Relies on window.DineInCart from js/app.js
 */
(function (window, document) {
  'use strict';

  function getCartAPI() {
    return window.DineInCart;
  }

  function escapeHTML(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /* ========================================================================
     1. DEALS & OFFERS PAGE (pages/deals.html)
     ======================================================================== */
  function initDealsPage() {
    var gridEl = document.getElementById('deals-grid');
    if (!gridEl) return;

    var api = getCartAPI();
    var searchInput = document.getElementById('deals-search');
    var clearSearchBtn = document.getElementById('deals-search-clear');
    var categoryBtns = document.querySelectorAll('[data-category]');
    var countEl = document.getElementById('deals-result-count');
    var emptyStateEl = document.getElementById('deals-empty-state');
    var resetFiltersBtn = document.getElementById('deals-reset-btn');

    var promoForm = document.getElementById('promo-form');
    var promoInput = document.getElementById('promo-code-input');
    var promoAlert = document.getElementById('promo-alert');
    var promoChips = document.querySelectorAll('[data-promo-fill]');

    var DEALS = [
      {
        id: 'deal-shahi-charcoal',
        name: 'Shahi Charcoal Platter',
        urduTag: 'شاہی کوئلہ پلیٹر',
        category: 'Family Platters',
        serves: 'Serves 4',
        badge: 'Chef Signature',
        price: 4450,
        originalPrice: 5400,
        description:
          'Signature coal-fired feast curated for family dinners with saffron rice and warm tandoori breads.',
        highlights: [
          'Chicken Malai Boti, Beef Seekh & Mutton Chops',
          '4 Roghni Naans, Mint Raita & Tamarind Chutney',
          'Complimentary Kashmiri Chai for 4'
        ]
      },
      {
        id: 'deal-lahori-duo',
        name: 'Lahori Tikka & Seekh Duo',
        urduTag: 'لاہوری تکہ اور سیخ کباب',
        category: 'BBQ & Grill',
        serves: 'Serves 2',
        badge: '18% Off',
        price: 2350,
        originalPrice: 2850,
        description:
          'Smoky charcoal chicken leg tikka paired with hand-minced spiced beef seekh kababs off the skewer.',
        highlights: [
          '2 Full Chicken Tikka Legs & 4 Beef Seekh Kababs',
          '2 Garlic Butter Naans & Kachumber Salad',
          'House Green Chili & Tamarind Dips'
        ]
      },
      {
        id: 'deal-exec-karahi',
        name: 'Executive Karahi & Naan Lunch',
        urduTag: 'ایگزیکٹو چکن کڑاہی لنچ',
        category: 'Lunch Combos',
        serves: 'Serves 1–2',
        badge: 'Weekday Special',
        price: 1650,
        originalPrice: 2050,
        description:
          'Wok-seared tomato and ginger Chicken Shinwari Karahi cooked to order for midday dining.',
        highlights: [
          'Half-Kg Boneless Shinwari Karahi',
          '2 Tandoori Khamiri Rotis & Fresh Mint Raita',
          'Chilled Mint Margarita Pitcher'
        ]
      },
      {
        id: 'deal-grand-mehfil',
        name: 'Grand Mehfil Dastarkhwan',
        urduTag: 'عظیم محفل دسترخوان',
        category: 'Family Platters',
        serves: 'Serves 6',
        badge: 'Best Value',
        price: 6950,
        originalPrice: 8500,
        description:
          'Our grand celebratory spread featuring live-grilled kebabs, Peshawari chops, and aromatic pulao.',
        highlights: [
          '8-Variety BBQ Assortment & Kabuli Pulao',
          '6 Assorted Naans, Dal Makhani & Salad Bar',
          '4 Matka Shahi Kulfi Desserts'
        ]
      },
      {
        id: 'deal-chapli-pulao',
        name: 'Peshawari Chapli & Kabuli Combo',
        urduTag: 'پشاوری چپلی اور کابلی پلاؤ',
        category: 'Lunch Combos',
        serves: 'Serves 2',
        badge: 'Popular',
        price: 1890,
        originalPrice: 2290,
        description:
          'Crisp pomegranate-seed beef chapli kababs served over caramelized carrot and raisin Kabuli pulao.',
        highlights: [
          '2 Jumbo Peshawari Chapli Kababs',
          'Generous Portion of Kabuli Beef Pulao',
          'Yogurt Podina Chutney & Pickled Onions'
        ]
      },
      {
        id: 'deal-mutton-chops',
        name: 'Midnight Coal-Fired Mutton Chops',
        urduTag: 'کوئلہ مٹن چانپیں',
        category: 'Weekend Specials',
        serves: 'Serves 2–3',
        badge: 'Fri–Sun Only',
        price: 3650,
        originalPrice: 4300,
        description:
          'Tender 24-hour raw-papaya and black-pepper marinated lamb chops seared over white oak charcoal.',
        highlights: [
          '8 Char-Grilled Peshawari Mutton Chops',
          '2 Kandahari Naans & Roasted Garlic Dip',
          'Smoked Masala Fries & Fresh Lime'
        ]
      },
      {
        id: 'deal-khyber-boti',
        name: 'Khyber Malai & Reshmi Feast',
        urduTag: 'خیبر ملائی اور ریشمی کباب',
        category: 'BBQ & Grill',
        serves: 'Serves 2–3',
        badge: 'Mild & Creamy',
        price: 2850,
        originalPrice: 3400,
        description:
          'Velvety cream-and-cardamom chicken malai boti paired with silky minced chicken reshmi kababs.',
        highlights: [
          '12 Pieces Chicken Malai Boti & 4 Reshmi Kababs',
          '3 Roghni Naans & Pistachio Raita',
          'Charred Tomato & Onion Skewer'
        ]
      },
      {
        id: 'deal-sunday-nihari',
        name: 'Sunday Royal Nihari & Roghni Brunch',
        urduTag: 'شاہی نہاری اور روغنی نان',
        category: 'Weekend Specials',
        serves: 'Serves 2',
        badge: 'Weekend Brunch',
        price: 2450,
        originalPrice: 2950,
        description:
          'Slow-simmered 8-hour beef shank nalli nihari finished with ginger juliennes, green chilies, and desi ghee.',
        highlights: [
          'Double Bowl Bone-Marrow Nalli Nihari',
          '3 Crisp Roghni Naans & Lemon Garnish Tray',
          '2 Sweet Cardamom Lassi Glasses'
        ]
      },
      {
        id: 'deal-mix-grill-kulfi',
        name: 'Tandoori Mix Grill & Kulfi Pair',
        urduTag: 'تندوری مکس گرل اور قلفی',
        category: 'BBQ & Grill',
        serves: 'Serves 3',
        badge: '16% Off',
        price: 3150,
        originalPrice: 3750,
        description:
          'A balanced trio of Bihari boti, Lahori fish tikka, and seekh kabab topped off with pistachio kulfi.',
        highlights: [
          'Behari Boti, Fish Tikka & 2 Beef Seekh Kababs',
          '3 Garlic Naans & Tamarind Dip',
          '2 Pistachio & Zafran Kulfi Sticks'
        ]
      }
    ];

    var activeCategory = 'All';
    var searchTerm = '';

    function renderDeals() {
      var query = searchTerm.trim().toLowerCase();
      var filtered = DEALS.filter(function (deal) {
        var matchesCat = activeCategory === 'All' || deal.category === activeCategory;
        if (!matchesCat) return false;
        if (!query) return true;
        var haystack = [
          deal.name,
          deal.category,
          deal.description,
          deal.serves,
          deal.highlights.join(' ')
        ]
          .join(' ')
          .toLowerCase();
        return haystack.indexOf(query) !== -1;
      });

      if (countEl) {
        countEl.textContent =
          filtered.length + (filtered.length === 1 ? ' offer shown' : ' offers shown');
      }

      if (filtered.length === 0) {
        gridEl.innerHTML = '';
        emptyStateEl.hidden = false;
        return;
      }

      emptyStateEl.hidden = true;
      gridEl.innerHTML = filtered
        .map(function (deal) {
          var savings = deal.originalPrice - deal.price;
          return (
            '<article class="card deal-card" data-deal-id="' +
            escapeHTML(deal.id) +
            '">' +
            '  <div class="deal-card-banner">' +
            '    <div class="deal-card-banner-top">' +
            '      <span class="badge badge-solid">' +
            escapeHTML(deal.badge) +
            '</span>' +
            '      <span class="deal-serves">' +
            escapeHTML(deal.serves) +
            '</span>' +
            '    </div>' +
            '    <div class="deal-card-urdu">' +
            escapeHTML(deal.urduTag) +
            '</div>' +
            '  </div>' +
            '  <div class="deal-card-body">' +
            '    <div>' +
            '      <span class="badge">' +
            escapeHTML(deal.category) +
            '</span>' +
            '    </div>' +
            '    <h3 class="deal-card-title">' +
            escapeHTML(deal.name) +
            '</h3>' +
            '    <p class="deal-card-desc">' +
            escapeHTML(deal.description) +
            '</p>' +
            '    <ul class="deal-highlights">' +
            deal.highlights
              .map(function (item) {
                return '<li>' + escapeHTML(item) + '</li>';
              })
              .join('') +
            '    </ul>' +
            '    <div class="deal-card-footer">' +
            '      <div class="deal-price-wrap">' +
            '        <span class="deal-price-old">' +
            api.formatPKR(deal.originalPrice) +
            '</span>' +
            '        <span class="deal-price-current">' +
            api.formatPKR(deal.price) +
            '</span>' +
            '        <span class="form-hint">Save ' +
            api.formatPKR(savings) +
            '</span>' +
            '      </div>' +
            '      <button type="button" class="btn-primary" data-add-deal="' +
            escapeHTML(deal.id) +
            '">Add to Cart</button>' +
            '    </div>' +
            '  </div>' +
            '</article>'
          );
        })
        .join('');
    }

    function setCategory(cat) {
      activeCategory = cat;
      categoryBtns.forEach(function (btn) {
        var isMatch = btn.getAttribute('data-category') === cat;
        btn.classList.toggle('is-active', isMatch);
        btn.setAttribute('aria-pressed', String(isMatch));
      });
      renderDeals();
    }

    function resetFilters() {
      activeCategory = 'All';
      searchTerm = '';
      if (searchInput) searchInput.value = '';
      if (clearSearchBtn) clearSearchBtn.hidden = true;
      setCategory('All');
    }

    function showPromoAlert(type, htmlContent) {
      if (!promoAlert) return;
      promoAlert.className = 'alert alert-' + type;
      promoAlert.innerHTML = htmlContent;
      promoAlert.hidden = false;
    }

    function renderSavedPromo() {
      var saved = api.getPromo();
      if (!saved) {
        if (promoAlert) promoAlert.hidden = true;
        return;
      }
      if (promoInput) promoInput.value = saved.code;
      showPromoAlert(
        'success',
        '<div><strong>Active Code: ' +
          escapeHTML(saved.code) +
          '</strong> — ' +
          escapeHTML(saved.label) +
          '</div>' +
          '<button type="button" class="btn-outline btn-sm" id="remove-promo-btn">Remove</button>'
      );
    }

    if (searchInput) {
      searchInput.addEventListener('input', function () {
        searchTerm = searchInput.value;
        if (clearSearchBtn) clearSearchBtn.hidden = searchTerm.length === 0;
        renderDeals();
      });
    }

    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', function () {
        searchTerm = '';
        searchInput.value = '';
        clearSearchBtn.hidden = true;
        searchInput.focus();
        renderDeals();
      });
    }

    categoryBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        setCategory(btn.getAttribute('data-category'));
      });
    });

    if (resetFiltersBtn) {
      resetFiltersBtn.addEventListener('click', resetFilters);
    }

    gridEl.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-add-deal]');
      if (!btn) return;
      var dealId = btn.getAttribute('data-add-deal');
      var deal = DEALS.find(function (d) {
        return d.id === dealId;
      });
      if (!deal) return;

      api.addToCart({
        id: deal.id,
        name: deal.name,
        price: deal.price,
        quantity: 1,
        category: deal.category,
        meta: deal.serves + ' • ' + deal.category
      });
    });

    if (promoForm) {
      promoForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var result = api.setPromo(promoInput.value);
        if (!result.valid) {
          showPromoAlert('error', '<div>' + escapeHTML(result.message) + '</div>');
          return;
        }
        renderSavedPromo();
        api.showToast(
          'Promo ' + result.promo.code + ' saved to your order.',
          'success',
          'Promo Applied'
        );
      });
    }

    if (promoAlert) {
      promoAlert.addEventListener('click', function (e) {
        if (e.target && e.target.id === 'remove-promo-btn') {
          api.clearPromo();
          if (promoInput) promoInput.value = '';
          showPromoAlert(
            'info',
            '<div>Promo code removed. You can apply another code anytime.</div>'
          );
        }
      });
    }

    promoChips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var code = chip.getAttribute('data-promo-fill');
        if (promoInput) promoInput.value = code;
        var result = api.setPromo(code);
        if (result.valid) {
          renderSavedPromo();
          api.showToast(
            'Promo ' + result.promo.code + ' applied.',
            'success',
            'Promo Applied'
          );
        }
      });
    });

    renderSavedPromo();
    renderDeals();
  }

  /* ========================================================================
     2. BUILD YOUR PLATTER PAGE (pages/build-platter.html)
     ======================================================================== */
  function initBuildPlatterPage() {
    var builderRoot = document.getElementById('platter-builder-root');
    if (!builderRoot) return;

    var api = getCartAPI();

    var PLATTER_SIZES = {
      duo: {
        id: 'duo',
        name: 'Duo Charcoal Platter',
        serves: 'Serves 2',
        price: 2200,
        includedBBQ: 2,
        includedBreads: 2
      },
      family: {
        id: 'family',
        name: 'Family Dastarkhwan',
        serves: 'Serves 4',
        price: 4100,
        includedBBQ: 4,
        includedBreads: 4
      },
      mehfil: {
        id: 'mehfil',
        name: 'Grand Mehfil Platter',
        serves: 'Serves 6',
        price: 5900,
        includedBBQ: 6,
        includedBreads: 6
      }
    };

    var BBQ_ITEMS = {
      'malai-boti': { name: 'Chicken Malai Boti', extraPrice: 650 },
      'seekh-kabab': { name: 'Beef Seekh Kabab', extraPrice: 550 },
      'mutton-chops': { name: 'Peshawari Mutton Chops', extraPrice: 950 },
      'reshmi-kabab': { name: 'Chicken Reshmi Kabab', extraPrice: 600 },
      'lahori-chargha': { name: 'Lahori Chargha Quarter', extraPrice: 700 },
      'chapli-kabab': { name: 'Peshawari Chapli Kabab', extraPrice: 580 },
      'behari-boti': { name: 'Beef Behari Boti', extraPrice: 690 },
      'fish-tikka': { name: 'Grilled Pomfret Fish Tikka', extraPrice: 880 }
    };

    var BREAD_ITEMS = {
      'roghni-naan': { name: 'Roghni Naan', price: 0 },
      'tandoori-roti': { name: 'Tandoori Khamiri Roti', price: 0 },
      'garlic-naan': { name: 'Garlic Butter Naan', price: 180 },
      'kalonji-cheese': { name: 'Kalonji Cheese Naan', price: 280 },
      'peshawari-naan': { name: 'Peshawari Dry-Fruit Naan', price: 320 }
    };

    var SIDE_ITEMS = {
      'mint-raita': { name: 'Mint & Coriander Raita', price: 0 },
      'imli-chutney': { name: 'Imli & Khajoor Chutney', price: 0 },
      'kachumber-salad': { name: 'Kachumber & Pickled Onion', price: 180 },
      'kabuli-pulao': { name: 'Kabuli Pulao Sharing Bowl', price: 750 },
      'dal-makhani': { name: 'Smoked Dal Makhani', price: 680 },
      'shahi-kulfi': { name: 'Matka Shahi Kulfi Duo', price: 520 }
    };

    var step1El = document.getElementById('step-platter-size');
    var step2El = document.getElementById('step-bbq-items');
    var step3El = document.getElementById('step-breads');
    var bbqCounterBadge = document.getElementById('bbq-counter-badge');
    var summaryLinesEl = document.getElementById('platter-summary-lines');
    var summaryTotalEl = document.getElementById('platter-total');
    var summaryAlertEl = document.getElementById('platter-alert');
    var addBtn = document.getElementById('add-platter-btn');
    var resetBtn = document.getElementById('reset-platter-btn');
    var notesInput = document.getElementById('platter-spice-notes');

    function getState() {
      var sizeRadio = builderRoot.querySelector('input[name="platterSize"]:checked');
      var size = sizeRadio ? PLATTER_SIZES[sizeRadio.value] : null;

      var bbqKeys = Array.prototype.map.call(
        builderRoot.querySelectorAll('input[name="bbqItem"]:checked'),
        function (el) {
          return el.value;
        }
      );

      var breadKeys = Array.prototype.map.call(
        builderRoot.querySelectorAll('input[name="breadItem"]:checked'),
        function (el) {
          return el.value;
        }
      );

      var sideKeys = Array.prototype.map.call(
        builderRoot.querySelectorAll('input[name="sideItem"]:checked'),
        function (el) {
          return el.value;
        }
      );

      var spiceRadio = builderRoot.querySelector('input[name="spiceLevel"]:checked');
      var spiceLevel = spiceRadio ? spiceRadio.value : 'Classic Lahori Medium';
      var notes = notesInput ? notesInput.value.trim() : '';

      return {
        size: size,
        bbqKeys: bbqKeys,
        breadKeys: breadKeys,
        sideKeys: sideKeys,
        spiceLevel: spiceLevel,
        notes: notes
      };
    }

    function syncOptionCardClasses() {
      builderRoot.querySelectorAll('.option-card').forEach(function (card) {
        var input = card.querySelector('input');
        if (input) {
          card.classList.toggle('is-selected', input.checked);
        }
      });
    }

    function calculatePricing(state) {
      var basePrice = state.size ? state.size.price : 0;
      var includedAllowance = state.size ? state.size.includedBBQ : 0;

      var bbqExtraTotal = 0;
      var bbqBreakdown = state.bbqKeys.map(function (key, index) {
        var item = BBQ_ITEMS[key];
        var isIncluded = state.size && index < includedAllowance;
        var charge = isIncluded ? 0 : item.extraPrice;
        bbqExtraTotal += charge;
        return {
          name: item.name,
          isIncluded: isIncluded,
          charge: charge
        };
      });

      var breadTotal = 0;
      var breadBreakdown = state.breadKeys.map(function (key) {
        var item = BREAD_ITEMS[key];
        breadTotal += item.price;
        return item;
      });

      var sideTotal = 0;
      var sideBreakdown = state.sideKeys.map(function (key) {
        var item = SIDE_ITEMS[key];
        sideTotal += item.price;
        return item;
      });

      var total = basePrice + bbqExtraTotal + breadTotal + sideTotal;
      return {
        basePrice: basePrice,
        includedAllowance: includedAllowance,
        bbqBreakdown: bbqBreakdown,
        bbqExtraTotal: bbqExtraTotal,
        breadBreakdown: breadBreakdown,
        breadTotal: breadTotal,
        sideBreakdown: sideBreakdown,
        sideTotal: sideTotal,
        total: total
      };
    }

    function renderSummary() {
      syncOptionCardClasses();
      var state = getState();
      var pricing = calculatePricing(state);

      if (bbqCounterBadge) {
        var allowanceText = state.size
          ? state.bbqKeys.length + ' / ' + state.size.includedBBQ + ' included'
          : state.bbqKeys.length + ' selected';
        bbqCounterBadge.textContent = allowanceText;
      }

      var lines = [];

      if (state.size) {
        lines.push(
          '<div class="summary-line">' +
            '<span><strong>' +
            escapeHTML(state.size.name) +
            '</strong> (' +
            escapeHTML(state.size.serves) +
            ')</span>' +
            '<strong>' +
            api.formatPKR(pricing.basePrice) +
            '</strong>' +
            '</div>'
        );
      } else {
        lines.push(
          '<div class="summary-line summary-line-muted">' +
            '<span>1. Platter Size</span>' +
            '<span>Not selected</span>' +
            '</div>'
        );
      }

      if (pricing.bbqBreakdown.length > 0) {
        pricing.bbqBreakdown.forEach(function (bbq) {
          lines.push(
            '<div class="summary-line">' +
              '<span>• ' +
              escapeHTML(bbq.name) +
              '</span>' +
              '<span>' +
              (bbq.charge === 0 ? 'Included' : '+' + api.formatPKR(bbq.charge)) +
              '</span>' +
              '</div>'
          );
        });
      } else {
        lines.push(
          '<div class="summary-line summary-line-muted">' +
            '<span>2. BBQ Skewers (min 2)</span>' +
            '<span>Select items</span>' +
            '</div>'
        );
      }

      if (pricing.breadBreakdown.length > 0) {
        pricing.breadBreakdown.forEach(function (bread) {
          lines.push(
            '<div class="summary-line">' +
              '<span>• ' +
              escapeHTML(bread.name) +
              '</span>' +
              '<span>' +
              (bread.price === 0 ? 'Included' : '+' + api.formatPKR(bread.price)) +
              '</span>' +
              '</div>'
          );
        });
      } else {
        lines.push(
          '<div class="summary-line summary-line-muted">' +
            '<span>3. Tandoori Breads (min 1)</span>' +
            '<span>Select bread</span>' +
            '</div>'
        );
      }

      pricing.sideBreakdown.forEach(function (side) {
        lines.push(
          '<div class="summary-line">' +
            '<span>• ' +
            escapeHTML(side.name) +
            '</span>' +
            '<span>' +
            (side.price === 0 ? 'Complimentary' : '+' + api.formatPKR(side.price)) +
            '</span>' +
            '</div>'
        );
      });

      lines.push(
        '<div class="summary-line summary-line-muted">' +
          '<span>Spice Level</span>' +
          '<span>' +
          escapeHTML(state.spiceLevel) +
          '</span>' +
          '</div>'
      );

      if (state.notes) {
        lines.push(
          '<div class="summary-line summary-line-muted">' +
            '<span>Chef Note</span>' +
            '<span>' +
            escapeHTML(state.notes) +
            '</span>' +
            '</div>'
        );
      }

      summaryLinesEl.innerHTML = lines.join('');
      summaryTotalEl.textContent = api.formatPKR(pricing.total);
    }

    function clearValidationHighlights() {
      [step1El, step2El, step3El].forEach(function (el) {
        if (el) el.classList.remove('has-error');
      });
    }

    function validatePlatter(state) {
      clearValidationHighlights();
      var errors = [];
      var firstErrorEl = null;

      if (!state.size) {
        errors.push('Select a platter size in Step 1.');
        if (step1El) {
          step1El.classList.add('has-error');
          firstErrorEl = firstErrorEl || step1El;
        }
      }

      if (state.bbqKeys.length < 2) {
        errors.push('Choose at least 2 BBQ items in Step 2.');
        if (step2El) {
          step2El.classList.add('has-error');
          firstErrorEl = firstErrorEl || step2El;
        }
      }

      if (state.breadKeys.length < 1) {
        errors.push('Select at least 1 tandoori bread option in Step 3.');
        if (step3El) {
          step3El.classList.add('has-error');
          firstErrorEl = firstErrorEl || step3El;
        }
      }

      return {
        valid: errors.length === 0,
        errors: errors,
        firstErrorEl: firstErrorEl
      };
    }

    builderRoot.addEventListener('change', function () {
      clearValidationHighlights();
      if (summaryAlertEl) summaryAlertEl.hidden = true;
      renderSummary();
    });

    if (notesInput) {
      notesInput.addEventListener('input', renderSummary);
    }

    if (addBtn) {
      addBtn.addEventListener('click', function () {
        var state = getState();
        var check = validatePlatter(state);

        if (!check.valid) {
          summaryAlertEl.className = 'alert alert-error';
          summaryAlertEl.innerHTML =
            '<div><strong>Complete required steps:</strong><ul style="margin:0.35rem 0 0 1.1rem;padding:0;">' +
            check.errors
              .map(function (err) {
                return '<li>' + escapeHTML(err) + '</li>';
              })
              .join('') +
            '</ul></div>';
          summaryAlertEl.hidden = false;
          if (check.firstErrorEl) {
            check.firstErrorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          api.showToast(check.errors[0], 'error', 'Incomplete Platter');
          return;
        }

        var pricing = calculatePricing(state);
        var bbqNames = pricing.bbqBreakdown.map(function (b) {
          return b.name;
        });
        var breadNames = pricing.breadBreakdown.map(function (b) {
          return b.name;
        });
        var metaSummary =
          state.size.serves +
          ' | BBQ: ' +
          bbqNames.join(', ') +
          ' | Breads: ' +
          breadNames.join(', ') +
          ' | Spice: ' +
          state.spiceLevel +
          (state.notes ? ' | Note: ' + state.notes : '');

        api.addToCart({
          id: 'custom-platter-' + state.size.id,
          name: 'Custom ' + state.size.name,
          price: pricing.total,
          quantity: 1,
          category: 'Custom BBQ Platter',
          meta: metaSummary
        });

        summaryAlertEl.className = 'alert alert-success';
        summaryAlertEl.innerHTML =
          '<div><strong>Platter added!</strong> Your custom ' +
          escapeHTML(state.size.name) +
          ' (' +
          api.formatPKR(pricing.total) +
          ') is in your DineIn cart.</div>';
        summaryAlertEl.hidden = false;
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        builderRoot.querySelectorAll('input[type="checkbox"]').forEach(function (cb) {
          cb.checked = cb.value === 'mint-raita' || cb.value === 'imli-chutney';
        });
        var defaultSize = builderRoot.querySelector(
          'input[name="platterSize"][value="family"]'
        );
        if (defaultSize) defaultSize.checked = true;
        var defaultSpice = builderRoot.querySelector(
          'input[name="spiceLevel"][value="Classic Lahori Medium"]'
        );
        if (defaultSpice) defaultSpice.checked = true;
        if (notesInput) notesInput.value = '';
        clearValidationHighlights();
        if (summaryAlertEl) summaryAlertEl.hidden = true;
        renderSummary();
      });
    }

    renderSummary();
  }

  /* ========================================================================
     3. GIFT VOUCHERS PAGE (pages/gift-vouchers.html)
     ======================================================================== */
  function initGiftVouchersPage() {
    var form = document.getElementById('voucher-form');
    if (!form) return;

    var api = getCartAPI();

    var amountBtns = document.querySelectorAll('[data-voucher-amount]');
    var customAmountWrap = document.getElementById('custom-amount-wrap');
    var customAmountInput = document.getElementById('voucher-custom-amount');
    var themeBtns = document.querySelectorAll('[data-voucher-theme]');
    var deliveryRadios = form.querySelectorAll('input[name="deliveryFormat"]');

    var recipientNameInput = document.getElementById('recipient-name');
    var recipientContactInput = document.getElementById('recipient-contact');
    var senderNameInput = document.getElementById('sender-name');
    var deliveryDateInput = document.getElementById('delivery-date');
    var messageInput = document.getElementById('voucher-message');
    var charCountEl = document.getElementById('message-char-count');

    var previewOccasionEl = document.getElementById('preview-occasion');
    var previewAmountEl = document.getElementById('preview-amount');
    var previewMessageEl = document.getElementById('preview-message');
    var previewRecipientEl = document.getElementById('preview-recipient');
    var previewSenderEl = document.getElementById('preview-sender');
    var previewFormatEl = document.getElementById('preview-format');
    var previewCodeEl = document.getElementById('preview-code');

    var summaryValueEl = document.getElementById('summary-voucher-value');
    var summaryFeeEl = document.getElementById('summary-packaging-fee');
    var summaryFormatEl = document.getElementById('summary-format-label');
    var summaryTotalEl = document.getElementById('summary-voucher-total');
    var voucherAlertEl = document.getElementById('voucher-alert');

    var selectedPreset = 5000;
    var isCustomAmount = false;
    var selectedTheme = 'Eid Mubarak';

    if (deliveryDateInput && !deliveryDateInput.value) {
      var today = new Date();
      var yyyy = today.getFullYear();
      var mm = String(today.getMonth() + 1).padStart(2, '0');
      var dd = String(today.getDate()).padStart(2, '0');
      deliveryDateInput.min = yyyy + '-' + mm + '-' + dd;
      deliveryDateInput.value = yyyy + '-' + mm + '-' + dd;
    }

    function getActiveAmount() {
      if (!isCustomAmount) return selectedPreset;
      var parsed = parseInt(customAmountInput ? customAmountInput.value : '0', 10);
      return isNaN(parsed) ? 0 : parsed;
    }

    function getDeliveryFormat() {
      var checked = form.querySelector('input[name="deliveryFormat"]:checked');
      if (checked && checked.value === 'printed') {
        return {
          key: 'printed',
          label: 'Gold-Foil Keepsake Box',
          fee: 350
        };
      }
      return {
        key: 'digital',
        label: 'Digital E-Voucher (Instant)',
        fee: 0
      };
    }

    function buildPreviewCode(amount, recipient) {
      var clean = (recipient || 'DINE').replace(/[^a-zA-Z]/g, '').toUpperCase();
      var prefix = (clean.slice(0, 4) || 'DINE').padEnd(4, 'X');
      var amtTag = Math.max(10, Math.round((amount || 5000) / 100));
      return 'DINE-' + prefix + '-' + amtTag;
    }

    function updatePreviewAndSummary() {
      var amount = getActiveAmount();
      var format = getDeliveryFormat();
      var total = (amount > 0 ? amount : 0) + format.fee;

      var recipient = recipientNameInput ? recipientNameInput.value.trim() : '';
      var sender = senderNameInput ? senderNameInput.value.trim() : '';
      var message = messageInput ? messageInput.value.trim() : '';

      if (charCountEl && messageInput) {
        charCountEl.textContent = messageInput.value.length + ' / 160 characters';
      }

      if (previewOccasionEl) previewOccasionEl.textContent = selectedTheme;
      if (previewAmountEl) {
        previewAmountEl.textContent =
          amount > 0 ? api.formatPKR(amount) : 'PKR —';
      }
      if (previewMessageEl) {
        previewMessageEl.textContent = message
          ? '"' + message + '"'
          : '"Wishing you an unforgettable evening of charcoal-grilled flavours and warm hospitality."';
      }
      if (previewRecipientEl) {
        previewRecipientEl.textContent = recipient || 'Honoured Guest';
      }
      if (previewSenderEl) {
        previewSenderEl.textContent = sender || 'Your Name';
      }
      if (previewFormatEl) {
        previewFormatEl.textContent = format.label;
      }
      if (previewCodeEl) {
        previewCodeEl.textContent = buildPreviewCode(amount, recipient);
      }

      if (summaryValueEl) {
        summaryValueEl.textContent = amount > 0 ? api.formatPKR(amount) : 'PKR 0';
      }
      if (summaryFormatEl) summaryFormatEl.textContent = format.label;
      if (summaryFeeEl) summaryFeeEl.textContent = api.formatPKR(format.fee);
      if (summaryTotalEl) summaryTotalEl.textContent = api.formatPKR(total);

      form.querySelectorAll('.option-card').forEach(function (card) {
        var input = card.querySelector('input');
        if (input) card.classList.toggle('is-selected', input.checked);
      });
    }

    function setFieldError(inputEl, errorId, msg) {
      var errEl = document.getElementById(errorId);
      if (inputEl) {
        inputEl.classList.toggle('is-invalid', Boolean(msg));
      }
      if (errEl) {
        errEl.textContent = msg || '';
      }
    }

    function isValidContact(val) {
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      var pkPhoneRegex = /^(\+92|0)?3\d{2}[-\s]?\d{7}$/;
      return emailRegex.test(val) || pkPhoneRegex.test(val);
    }

    function validateVoucherForm() {
      var valid = true;
      var amount = getActiveAmount();

      if (isCustomAmount) {
        if (!amount || amount < 1000 || amount > 100000) {
          setFieldError(
            customAmountInput,
            'error-custom-amount',
            'Enter a custom amount between PKR 1,000 and PKR 100,000.'
          );
          valid = false;
        } else {
          setFieldError(customAmountInput, 'error-custom-amount', '');
        }
      } else {
        setFieldError(customAmountInput, 'error-custom-amount', '');
      }

      var recipient = recipientNameInput.value.trim();
      if (recipient.length < 2) {
        setFieldError(
          recipientNameInput,
          'error-recipient-name',
          'Please enter the recipient’s full name (at least 2 characters).'
        );
        valid = false;
      } else {
        setFieldError(recipientNameInput, 'error-recipient-name', '');
      }

      var contact = recipientContactInput.value.trim();
      if (!isValidContact(contact)) {
        setFieldError(
          recipientContactInput,
          'error-recipient-contact',
          'Enter a valid email or Pakistani mobile number (e.g. 0300-1234567).'
        );
        valid = false;
      } else {
        setFieldError(recipientContactInput, 'error-recipient-contact', '');
      }

      var sender = senderNameInput.value.trim();
      if (sender.length < 2) {
        setFieldError(
          senderNameInput,
          'error-sender-name',
          'Please enter your name so the recipient knows who sent it.'
        );
        valid = false;
      } else {
        setFieldError(senderNameInput, 'error-sender-name', '');
      }

      var dateVal = deliveryDateInput.value;
      if (!dateVal) {
        setFieldError(
          deliveryDateInput,
          'error-delivery-date',
          'Choose a delivery date.'
        );
        valid = false;
      } else {
        setFieldError(deliveryDateInput, 'error-delivery-date', '');
      }

      return valid;
    }

    amountBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var val = btn.getAttribute('data-voucher-amount');
        amountBtns.forEach(function (b) {
          b.classList.toggle('is-active', b === btn);
        });

        if (val === 'custom') {
          isCustomAmount = true;
          if (customAmountWrap) customAmountWrap.hidden = false;
          if (customAmountInput) customAmountInput.focus();
        } else {
          isCustomAmount = false;
          selectedPreset = parseInt(val, 10);
          if (customAmountWrap) customAmountWrap.hidden = true;
          setFieldError(customAmountInput, 'error-custom-amount', '');
        }
        updatePreviewAndSummary();
      });
    });

    themeBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        selectedTheme = btn.getAttribute('data-voucher-theme');
        themeBtns.forEach(function (b) {
          var active = b === btn;
          b.classList.toggle('is-active', active);
          b.setAttribute('aria-pressed', String(active));
        });
        updatePreviewAndSummary();
      });
    });

    [
      customAmountInput,
      recipientNameInput,
      recipientContactInput,
      senderNameInput,
      deliveryDateInput,
      messageInput
    ].forEach(function (el) {
      if (!el) return;
      el.addEventListener('input', function () {
        if (voucherAlertEl) voucherAlertEl.hidden = true;
        updatePreviewAndSummary();
      });
    });

    deliveryRadios.forEach(function (radio) {
      radio.addEventListener('change', updatePreviewAndSummary);
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateVoucherForm()) {
        if (voucherAlertEl) {
          voucherAlertEl.className = 'alert alert-error';
          voucherAlertEl.innerHTML =
            '<div>Please fix the highlighted voucher fields before adding to cart.</div>';
          voucherAlertEl.hidden = false;
        }
        api.showToast(
          'Please check the highlighted voucher details.',
          'error',
          'Validation Needed'
        );
        return;
      }

      var amount = getActiveAmount();
      var format = getDeliveryFormat();
      var total = amount + format.fee;
      var recipient = recipientNameInput.value.trim();
      var sender = senderNameInput.value.trim();
      var contact = recipientContactInput.value.trim();

      api.addToCart({
        id: 'gift-voucher-' + amount + '-' + format.key,
        name: 'DineIn Gift Voucher (' + api.formatPKR(amount) + ')',
        price: total,
        quantity: 1,
        category: 'Gift Voucher',
        meta:
          selectedTheme +
          ' | For ' +
          recipient +
          ' (' +
          contact +
          ') | From ' +
          sender +
          ' | ' +
          format.label
      });

      if (voucherAlertEl) {
        voucherAlertEl.className = 'alert alert-success';
        voucherAlertEl.innerHTML =
          '<div><strong>Voucher ready!</strong> ' +
          api.formatPKR(amount) +
          ' gift voucher for <strong>' +
          escapeHTML(recipient) +
          '</strong> added to your DineIn cart.</div>';
        voucherAlertEl.hidden = false;
      }
    });

    updatePreviewAndSummary();
  }

  document.addEventListener('DOMContentLoaded', function () {
    initDealsPage();
    initBuildPlatterPage();
    initGiftVouchersPage();
  });
})(window, document);
