/**
 * DineIn Restaurant — Shared UI, Navigation, Menu Filtering, Dish Details & Cart
 */

(function () {
  'use strict';

  const CART_STORAGE_KEY = 'dinein_cart_v1';

  // Resolve relative path prefix depending on whether we are in /pages/ or root
  const isSubPage = window.location.pathname.replace(/\\/g, '/').includes('/pages/');
  const ROOT_PREFIX = isSubPage ? '../' : '';

  function resolveAsset(path) {
    return ROOT_PREFIX + path;
  }

  function formatPrice(amount) {
    return '$' + Number(amount).toFixed(2);
  }

  /* ========================================================================
     Cart State (LocalStorage)
     ======================================================================== */
  function getCart() {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      return [];
    }
  }

  function saveCart(cart) {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (err) {
      // Ignore storage quota errors gracefully
    }
    updateCartBadge();
    renderCartDrawer();
  }

  function addToCart(dishId, quantity) {
    const qty = Math.max(1, Math.min(20, parseInt(quantity, 10) || 1));
    const menu = window.DINEIN_MENU || [];
    const dish = menu.find(function (item) {
      return item.id === dishId;
    });
    if (!dish) return;

    const cart = getCart();
    const existing = cart.find(function (item) {
      return item.id === dishId;
    });

    if (existing) {
      existing.qty = Math.min(20, existing.qty + qty);
    } else {
      cart.push({ id: dish.id, qty: qty });
    }

    saveCart(cart);
    showToast('Added ' + qty + ' × ' + dish.name + ' to your order.');
  }

  function updateCartItemQty(dishId, delta) {
    const cart = getCart();
    const index = cart.findIndex(function (item) {
      return item.id === dishId;
    });
    if (index === -1) return;

    cart[index].qty += delta;
    if (cart[index].qty <= 0) {
      cart.splice(index, 1);
    }
    saveCart(cart);
  }

  function removeCartItem(dishId) {
    const cart = getCart().filter(function (item) {
      return item.id !== dishId;
    });
    saveCart(cart);
  }

  function clearCart() {
    saveCart([]);
    showToast('Your order cart has been cleared.');
  }

  function updateCartBadge() {
    const totalCount = getCart().reduce(function (sum, item) {
      return sum + (item.qty || 0);
    }, 0);
    document.querySelectorAll('[data-cart-count]').forEach(function (el) {
      el.textContent = String(totalCount);
    });
  }

  /* ========================================================================
     Toast Notification
     ======================================================================== */
  let toastTimer = null;

  function showToast(message) {
    const toast = document.getElementById('dinein-toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove('show');
    }, 2800);
  }

  /* ========================================================================
     Cart Drawer UI
     ======================================================================== */
  function openCartDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const backdrop = document.getElementById('cart-backdrop');
    if (drawer && backdrop) {
      renderCartDrawer();
      drawer.classList.add('open');
      backdrop.classList.add('open');
      drawer.setAttribute('aria-hidden', 'false');
    }
  }

  function closeCartDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const backdrop = document.getElementById('cart-backdrop');
    if (drawer && backdrop) {
      drawer.classList.remove('open');
      backdrop.classList.remove('open');
      drawer.setAttribute('aria-hidden', 'true');
    }
  }

  function renderCartDrawer() {
    const body = document.getElementById('cart-drawer-body');
    const totalEl = document.getElementById('cart-subtotal');
    if (!body || !totalEl) return;

    const cart = getCart();
    const menu = window.DINEIN_MENU || [];

    if (cart.length === 0) {
      body.innerHTML =
        '<div class="cart-empty">' +
        '<p><strong>Your order is currently empty.</strong></p>' +
        '<p style="margin-top:8px;">Explore our seasonal menu to add signature dishes.</p>' +
        '</div>';
      totalEl.textContent = '$0.00';
      return;
    }

    let subtotal = 0;
    const html = cart
      .map(function (entry) {
        const dish = menu.find(function (d) {
          return d.id === entry.id;
        });
        if (!dish) return '';
        const lineTotal = dish.price * entry.qty;
        subtotal += lineTotal;

        return (
          '<div class="cart-item">' +
          '<img src="' +
          resolveAsset(dish.image) +
          '" alt="' +
          dish.name +
          '" />' +
          '<div>' +
          '<div class="cart-item-title">' +
          dish.name +
          '</div>' +
          '<div class="cart-item-price">' +
          formatPrice(dish.price) +
          ' each · <strong>' +
          formatPrice(lineTotal) +
          '</strong></div>' +
          '<div class="cart-item-qty">' +
          '<button type="button" class="cart-mini-btn" data-cart-dec="' +
          dish.id +
          '" aria-label="Decrease quantity">-</button>' +
          '<span>' +
          entry.qty +
          '</span>' +
          '<button type="button" class="cart-mini-btn" data-cart-inc="' +
          dish.id +
          '" aria-label="Increase quantity">+</button>' +
          '</div>' +
          '</div>' +
          '<button type="button" class="cart-remove-btn" data-cart-remove="' +
          dish.id +
          '">Remove</button>' +
          '</div>'
        );
      })
      .join('');

    body.innerHTML = html;
    totalEl.textContent = formatPrice(subtotal);
  }

  function initGlobalControls() {
    // Mobile menu toggle
    const toggleBtn = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('primary-nav');
    if (toggleBtn && navLinks) {
      toggleBtn.addEventListener('click', function () {
        const isOpen = navLinks.classList.toggle('open');
        toggleBtn.setAttribute('aria-expanded', String(isOpen));
      });
    }

    // Cart drawer open/close
    document.querySelectorAll('[data-open-cart]').forEach(function (btn) {
      btn.addEventListener('click', openCartDrawer);
    });

    const closeBtn = document.getElementById('cart-close-btn');
    const backdrop = document.getElementById('cart-backdrop');
    if (closeBtn) closeBtn.addEventListener('click', closeCartDrawer);
    if (backdrop) backdrop.addEventListener('click', closeCartDrawer);

    const clearBtn = document.getElementById('cart-clear-btn');
    if (clearBtn) clearBtn.addEventListener('click', clearCart);

    const checkoutBtn = document.getElementById('cart-checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', function () {
        if (getCart().length === 0) {
          showToast('Add at least one dish before placing an order.');
          return;
        }
        clearCart();
        closeCartDrawer();
        showToast('Thank you! Your DineIn order request has been received.');
      });
    }

    // Delegate cart item actions + quick add-to-cart buttons
    document.addEventListener('click', function (e) {
      const addBtn = e.target.closest('[data-add-to-cart]');
      if (addBtn) {
        addToCart(addBtn.getAttribute('data-add-to-cart'), 1);
        return;
      }

      const incBtn = e.target.closest('[data-cart-inc]');
      if (incBtn) {
        updateCartItemQty(incBtn.getAttribute('data-cart-inc'), 1);
        return;
      }

      const decBtn = e.target.closest('[data-cart-dec]');
      if (decBtn) {
        updateCartItemQty(decBtn.getAttribute('data-cart-dec'), -1);
        return;
      }

      const remBtn = e.target.closest('[data-cart-remove]');
      if (remBtn) {
        removeCartItem(remBtn.getAttribute('data-cart-remove'));
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeCartDrawer();
    });

    updateCartBadge();
  }

  /* ========================================================================
     Card Renderer Helper
     ======================================================================== */
  function createDishCardHTML(dish) {
    const detailsHref = ROOT_PREFIX + 'pages/dish-details.html?id=' + encodeURIComponent(dish.id);
    const tagClass = dish.featured ? 'dish-tag dish-tag-accent' : 'dish-tag';

    return (
      '<article class="dish-card">' +
      '<div class="dish-card-media">' +
      '<a href="' +
      detailsHref +
      '">' +
      '<img src="' +
      resolveAsset(dish.image) +
      '" alt="' +
      dish.name +
      '" loading="lazy" />' +
      '</a>' +
      '<span class="' +
      tagClass +
      '">' +
      dish.tag +
      '</span>' +
      '</div>' +
      '<div class="dish-card-body">' +
      '<div class="dish-meta-row">' +
      '<span class="dish-category">' +
      dish.category +
      '</span>' +
      '<span class="dish-price">' +
      formatPrice(dish.price) +
      '</span>' +
      '</div>' +
      '<h3 class="dish-title"><a href="' +
      detailsHref +
      '">' +
      dish.name +
      '</a></h3>' +
      '<p class="dish-desc">' +
      dish.shortDesc +
      '</p>' +
      '<div class="dish-card-actions">' +
      '<a href="' +
      detailsHref +
      '" class="btn btn-secondary btn-sm">Details</a>' +
      '<button type="button" class="btn btn-primary btn-sm" data-add-to-cart="' +
      dish.id +
      '">Add to Cart</button>' +
      '</div>' +
      '</div>' +
      '</article>'
    );
  }

  /* ========================================================================
     Page 1: Home (Featured Dishes)
     ======================================================================== */
  function initHomePage() {
    const grid = document.getElementById('featured-dishes-grid');
    if (!grid) return;

    const featured = (window.DINEIN_MENU || []).filter(function (dish) {
      return dish.featured;
    });
    grid.innerHTML = featured.slice(0, 4).map(createDishCardHTML).join('');
  }

  /* ========================================================================
     Page 2: Full Menu (Category Filter, Live Search, Sorting)
     ======================================================================== */
  function initFullMenuPage() {
    const grid = document.getElementById('full-menu-grid');
    if (!grid) return;

    const searchInput = document.getElementById('menu-search');
    const sortSelect = document.getElementById('menu-sort');
    const pillsContainer = document.getElementById('category-pills');
    const countLabel = document.getElementById('menu-result-count');
    const emptyState = document.getElementById('menu-empty-state');
    const resetBtn = document.getElementById('reset-filters-btn');

    let activeCategory = 'All';
    let searchQuery = '';
    let sortBy = 'featured';

    function renderMenu() {
      const menu = (window.DINEIN_MENU || []).slice();

      let filtered = menu.filter(function (dish) {
        const matchesCat = activeCategory === 'All' || dish.category === activeCategory;
        const q = searchQuery.trim().toLowerCase();
        const matchesQuery =
          !q ||
          dish.name.toLowerCase().includes(q) ||
          dish.shortDesc.toLowerCase().includes(q) ||
          dish.category.toLowerCase().includes(q) ||
          dish.ingredients.some(function (ing) {
            return ing.toLowerCase().includes(q);
          });
        return matchesCat && matchesQuery;
      });

      if (sortBy === 'price-asc') {
        filtered.sort(function (a, b) {
          return a.price - b.price;
        });
      } else if (sortBy === 'price-desc') {
        filtered.sort(function (a, b) {
          return b.price - a.price;
        });
      } else {
        filtered.sort(function (a, b) {
          return Number(b.featured) - Number(a.featured);
        });
      }

      if (countLabel) {
        countLabel.textContent =
          'Showing ' + filtered.length + ' of ' + menu.length + ' dishes';
      }

      if (filtered.length === 0) {
        grid.innerHTML = '';
        if (emptyState) emptyState.hidden = false;
      } else {
        if (emptyState) emptyState.hidden = true;
        grid.innerHTML = filtered.map(createDishCardHTML).join('');
      }
    }

    if (pillsContainer) {
      pillsContainer.addEventListener('click', function (e) {
        const pill = e.target.closest('.filter-pill');
        if (!pill) return;

        pillsContainer.querySelectorAll('.filter-pill').forEach(function (btn) {
          btn.classList.remove('active');
        });
        pill.classList.add('active');
        activeCategory = pill.getAttribute('data-category') || 'All';
        renderMenu();
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', function () {
        searchQuery = searchInput.value;
        renderMenu();
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener('change', function () {
        sortBy = sortSelect.value;
        renderMenu();
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        activeCategory = 'All';
        searchQuery = '';
        sortBy = 'featured';
        if (searchInput) searchInput.value = '';
        if (sortSelect) sortSelect.value = 'featured';
        if (pillsContainer) {
          pillsContainer.querySelectorAll('.filter-pill').forEach(function (btn) {
            btn.classList.toggle('active', btn.getAttribute('data-category') === 'All');
          });
        }
        renderMenu();
      });
    }

    renderMenu();
  }

  /* ========================================================================
     Page 3: Dish Details (URL Param Lookup, Quantity Selector, Add to Cart)
     ======================================================================== */
  function initDishDetailsPage() {
    const container = document.getElementById('dish-detail-container');
    if (!container) return;

    const menu = window.DINEIN_MENU || [];
    const params = new URLSearchParams(window.location.search);
    const requestedId = params.get('id');
    const dish =
      menu.find(function (item) {
        return item.id === requestedId;
      }) || menu[2] || menu[0];

    if (!dish) return;

    document.title = dish.name + ' | DineIn Restaurant';

    const breadcrumbTitle = document.getElementById('breadcrumb-dish-name');
    if (breadcrumbTitle) breadcrumbTitle.textContent = dish.name;

    const imgEl = document.getElementById('detail-image');
    const tagEl = document.getElementById('detail-tag');
    const catEl = document.getElementById('detail-category');
    const titleEl = document.getElementById('detail-title');
    const metaEl = document.getElementById('detail-meta');
    const priceEl = document.getElementById('detail-price');
    const descEl = document.getElementById('detail-description');
    const ingEl = document.getElementById('detail-ingredients');
    const dietaryEl = document.getElementById('detail-dietary');

    if (imgEl) {
      imgEl.src = resolveAsset(dish.image);
      imgEl.alt = dish.name;
    }
    if (tagEl) tagEl.textContent = dish.tag;
    if (catEl) catEl.textContent = dish.category;
    if (titleEl) titleEl.textContent = dish.name;
    if (metaEl) {
      metaEl.innerHTML =
        '<span>Prep time: <strong>' +
        dish.prepTime +
        '</strong></span>' +
        '<span>Energy: <strong>' +
        dish.calories +
        '</strong></span>' +
        '<span>Guest Rating: <strong>' +
        dish.rating +
        ' / 5.0</strong></span>';
    }
    if (priceEl) priceEl.textContent = formatPrice(dish.price);
    if (descEl) descEl.textContent = dish.fullDesc;
    if (ingEl) {
      ingEl.innerHTML = dish.ingredients
        .map(function (item) {
          return '<li class="ingredient-chip">' + item + '</li>';
        })
        .join('');
    }
    if (dietaryEl) dietaryEl.textContent = dish.dietary;

    // Quantity selector & Add to Cart
    let quantity = 1;
    const qtyDisplay = document.getElementById('qty-value');
    const decBtn = document.getElementById('qty-dec');
    const incBtn = document.getElementById('qty-inc');
    const addBtn = document.getElementById('detail-add-to-cart');
    const feedback = document.getElementById('detail-feedback');

    function syncQty() {
      if (qtyDisplay) qtyDisplay.textContent = String(quantity);
      if (addBtn) {
        addBtn.textContent =
          'Add to Cart — ' + formatPrice(dish.price * quantity);
      }
    }

    if (decBtn) {
      decBtn.addEventListener('click', function () {
        if (quantity > 1) {
          quantity -= 1;
          syncQty();
        }
      });
    }

    if (incBtn) {
      incBtn.addEventListener('click', function () {
        if (quantity < 20) {
          quantity += 1;
          syncQty();
        }
      });
    }

    if (addBtn) {
      addBtn.addEventListener('click', function () {
        addToCart(dish.id, quantity);
        if (feedback) {
          feedback.textContent =
            quantity + ' × ' + dish.name + ' added to your order cart.';
          feedback.classList.add('visible');
        }
      });
    }

    syncQty();

    // Related dishes
    const relatedGrid = document.getElementById('related-dishes-grid');
    if (relatedGrid) {
      const related = menu
        .filter(function (item) {
          return item.id !== dish.id;
        })
        .slice(0, 3);
      relatedGrid.innerHTML = related.map(createDishCardHTML).join('');
    }
  }

  /* ========================================================================
     Bootstrap
     ======================================================================== */
  document.addEventListener('DOMContentLoaded', function () {
    initGlobalControls();
    initHomePage();
    initFullMenuPage();
    initDishDetailsPage();
  });
})();
