/**
 * DineIn — Shared Application Helpers
 * Exposes window.DineInCart with localStorage cart/promo persistence,
 * PKR formatting, shared toast notifications, navbar toggle, and cart drawer.
 */
(function (window, document) {
  'use strict';

  var CART_STORAGE_KEY = 'dinein_cart_items_v1';
  var PROMO_STORAGE_KEY = 'dinein_active_promo_v1';

  var PROMO_CATALOG = {
    DINEIN15: {
      code: 'DINEIN15',
      type: 'percent',
      value: 15,
      minSubtotal: 2000,
      label: '15% off orders PKR 2,000+'
    },
    BBQ500: {
      code: 'BBQ500',
      type: 'fixed',
      value: 500,
      minSubtotal: 2500,
      label: 'PKR 500 off BBQ & Deals (min PKR 2,500)'
    },
    WELCOME10: {
      code: 'WELCOME10',
      type: 'percent',
      value: 10,
      minSubtotal: 0,
      label: '10% welcome discount on any order'
    },
    MEHFIL20: {
      code: 'MEHFIL20',
      type: 'percent',
      value: 20,
      minSubtotal: 6000,
      label: '20% off family feasts PKR 6,000+'
    }
  };

  function safeParse(raw, fallback) {
    try {
      return raw ? JSON.parse(raw) : fallback;
    } catch (err) {
      return fallback;
    }
  }

  function formatPKR(amount) {
    var num = Math.round(Number(amount) || 0);
    return 'PKR ' + num.toLocaleString('en-PK');
  }

  function escapeHTML(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function ensureToastContainer() {
    var container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      container.setAttribute('aria-live', 'polite');
      container.setAttribute('aria-atomic', 'false');
      document.body.appendChild(container);
    }
    return container;
  }

  function showToast(message, type, title) {
    var container = ensureToastContainer();
    var toastType = type || 'success';
    var defaultTitle =
      toastType === 'error'
        ? 'Action Required'
        : toastType === 'info'
        ? 'DineIn Update'
        : 'Added to Order';

    var toast = document.createElement('div');
    toast.className = 'toast toast-' + toastType;
    toast.setAttribute('role', 'status');
    toast.innerHTML =
      '<div>' +
      '<span class="toast-title">' +
      escapeHTML(title || defaultTitle) +
      '</span>' +
      '<span class="toast-message">' +
      escapeHTML(message) +
      '</span>' +
      '</div>' +
      '<button type="button" class="toast-close" aria-label="Dismiss notification">&times;</button>';

    var dismiss = function () {
      if (toast.classList.contains('is-leaving')) return;
      toast.classList.add('is-leaving');
      window.setTimeout(function () {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 220);
    };

    toast.querySelector('.toast-close').addEventListener('click', dismiss);
    container.appendChild(toast);
    window.setTimeout(dismiss, 4000);
  }

  function getCart() {
    var parsed = safeParse(window.localStorage.getItem(CART_STORAGE_KEY), []);
    return Array.isArray(parsed) ? parsed : [];
  }

  function saveCart(items) {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    updateCartUI();
    window.dispatchEvent(
      new CustomEvent('dinein:cart-updated', { detail: { items: items } })
    );
  }

  function buildCartKey(item) {
    if (item.cartKey) return String(item.cartKey);
    var metaKey = item.meta ? JSON.stringify(item.meta) : '';
    return String(item.id || item.name) + '::' + metaKey;
  }

  function addToCart(item) {
    if (!item || !item.name) {
      return getCart();
    }

    var price = Math.max(0, Number(item.price) || 0);
    var qty = Math.max(1, parseInt(item.quantity, 10) || 1);
    var cart = getCart();
    var cartKey = buildCartKey(item);

    var existing = cart.find(function (entry) {
      return entry.cartKey === cartKey;
    });

    if (existing) {
      existing.quantity += qty;
    } else {
      cart.push({
        cartKey: cartKey,
        id: item.id || cartKey,
        name: String(item.name),
        price: price,
        quantity: qty,
        category: item.category || 'Menu Item',
        meta: item.meta || ''
      });
    }

    saveCart(cart);
    showToast(
      qty + 'x ' + item.name + ' (' + formatPKR(price * qty) + ')',
      'success',
      'Added to DineIn Cart'
    );
    return cart;
  }

  function updateQuantity(cartKey, delta) {
    var cart = getCart();
    var next = [];

    cart.forEach(function (item) {
      if (item.cartKey === cartKey) {
        var updatedQty = item.quantity + delta;
        if (updatedQty > 0) {
          item.quantity = updatedQty;
          next.push(item);
        }
      } else {
        next.push(item);
      }
    });

    saveCart(next);
    return next;
  }

  function removeFromCart(cartKey) {
    var cart = getCart().filter(function (item) {
      return item.cartKey !== cartKey;
    });
    saveCart(cart);
    showToast('Item removed from your order.', 'info', 'Cart Updated');
    return cart;
  }

  function clearCart() {
    saveCart([]);
    showToast('Your DineIn order cart has been cleared.', 'info', 'Cart Cleared');
  }

  function getCount() {
    return getCart().reduce(function (sum, item) {
      return sum + (Number(item.quantity) || 0);
    }, 0);
  }

  function getSubtotal() {
    return getCart().reduce(function (sum, item) {
      return sum + (Number(item.price) || 0) * (Number(item.quantity) || 0);
    }, 0);
  }

  function getPromo() {
    var code = window.localStorage.getItem(PROMO_STORAGE_KEY);
    if (!code) return null;
    return PROMO_CATALOG[code.toUpperCase()] || null;
  }

  function validatePromoCode(rawCode) {
    var normalized = String(rawCode || '').trim().toUpperCase();
    if (!normalized) {
      return { valid: false, message: 'Please enter a promo code first.' };
    }
    var promo = PROMO_CATALOG[normalized];
    if (!promo) {
      return {
        valid: false,
        message:
          'Code "' +
          normalized +
          '" is not active. Try DINEIN15, BBQ500, WELCOME10, or MEHFIL20.'
      };
    }
    return { valid: true, promo: promo };
  }

  function setPromo(rawCode) {
    var result = validatePromoCode(rawCode);
    if (!result.valid) return result;
    window.localStorage.setItem(PROMO_STORAGE_KEY, result.promo.code);
    updateCartUI();
    window.dispatchEvent(
      new CustomEvent('dinein:promo-updated', { detail: { promo: result.promo } })
    );
    return result;
  }

  function clearPromo() {
    window.localStorage.removeItem(PROMO_STORAGE_KEY);
    updateCartUI();
    window.dispatchEvent(
      new CustomEvent('dinein:promo-updated', { detail: { promo: null } })
    );
  }

  function calculateDiscount(subtotal, promo) {
    if (!promo || subtotal <= 0) return 0;
    if (subtotal < promo.minSubtotal) return 0;
    if (promo.type === 'percent') {
      return Math.round((subtotal * promo.value) / 100);
    }
    return Math.min(subtotal, promo.value);
  }

  function ensureCartDrawer() {
    var backdrop = document.getElementById('dinein-cart-drawer');
    if (backdrop) return backdrop;

    backdrop = document.createElement('div');
    backdrop.id = 'dinein-cart-drawer';
    backdrop.className = 'cart-drawer-backdrop';
    backdrop.setAttribute('aria-hidden', 'true');
    backdrop.innerHTML =
      '<aside class="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-drawer-title">' +
      '  <div class="cart-drawer-header">' +
      '    <h2 id="cart-drawer-title">Your DineIn Order</h2>' +
      '    <button type="button" class="cart-drawer-close" aria-label="Close cart">&times;</button>' +
      '  </div>' +
      '  <div class="cart-drawer-body" id="cart-drawer-items"></div>' +
      '  <div class="cart-drawer-footer" id="cart-drawer-footer"></div>' +
      '</aside>';

    document.body.appendChild(backdrop);

    backdrop.addEventListener('click', function (e) {
      if (e.target === backdrop || e.target.closest('.cart-drawer-close')) {
        closeCartDrawer();
      }
    });

    backdrop.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-cart-action]');
      if (!btn) return;
      var action = btn.getAttribute('data-cart-action');
      var key = btn.getAttribute('data-cart-key');
      if (action === 'inc') updateQuantity(key, 1);
      if (action === 'dec') updateQuantity(key, -1);
      if (action === 'remove') removeFromCart(key);
      if (action === 'clear') clearCart();
      if (action === 'checkout') {
        showToast(
          'Your DineIn order summary is ready for checkout.',
          'success',
          'Order Confirmed'
        );
        closeCartDrawer();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && backdrop.classList.contains('is-open')) {
        closeCartDrawer();
      }
    });

    return backdrop;
  }

  function openCartDrawer() {
    var backdrop = ensureCartDrawer();
    renderCartDrawer();
    backdrop.classList.add('is-open');
    backdrop.setAttribute('aria-hidden', 'false');
  }

  function closeCartDrawer() {
    var backdrop = document.getElementById('dinein-cart-drawer');
    if (!backdrop) return;
    backdrop.classList.remove('is-open');
    backdrop.setAttribute('aria-hidden', 'true');
  }

  function renderCartDrawer() {
    var itemsEl = document.getElementById('cart-drawer-items');
    var footerEl = document.getElementById('cart-drawer-footer');
    if (!itemsEl || !footerEl) return;

    var cart = getCart();
    var subtotal = getSubtotal();
    var promo = getPromo();
    var discount = calculateDiscount(subtotal, promo);
    var total = Math.max(0, subtotal - discount);

    if (cart.length === 0) {
      itemsEl.innerHTML =
        '<div class="alert alert-info">' +
        '  <div>' +
        '    <strong>Your table tray is empty.</strong>' +
        '    <p style="margin:0.35rem 0 0;">Add a seasonal deal, build a custom BBQ platter, or send a DineIn gift voucher.</p>' +
        '  </div>' +
        '</div>';
      footerEl.innerHTML =
        '<div class="cart-summary-total"><span>Total</span><span>' +
        formatPKR(0) +
        '</span></div>';
      return;
    }

    itemsEl.innerHTML = cart
      .map(function (item) {
        var metaText =
          typeof item.meta === 'string' && item.meta
            ? item.meta
            : item.category || '';
        return (
          '<div class="cart-item-card">' +
          '  <div class="cart-item-top">' +
          '    <div>' +
          '      <div class="cart-item-title">' +
          escapeHTML(item.name) +
          '</div>' +
          (metaText
            ? '<div class="cart-item-meta">' + escapeHTML(metaText) + '</div>'
            : '') +
          '    </div>' +
          '    <button type="button" class="btn-outline btn-sm" data-cart-action="remove" data-cart-key="' +
          escapeHTML(item.cartKey) +
          '" aria-label="Remove ' +
          escapeHTML(item.name) +
          '">Remove</button>' +
          '  </div>' +
          '  <div class="cart-item-bottom">' +
          '    <div class="qty-stepper">' +
          '      <button type="button" data-cart-action="dec" data-cart-key="' +
          escapeHTML(item.cartKey) +
          '" aria-label="Decrease quantity">-</button>' +
          '      <span>' +
          item.quantity +
          '</span>' +
          '      <button type="button" data-cart-action="inc" data-cart-key="' +
          escapeHTML(item.cartKey) +
          '" aria-label="Increase quantity">+</button>' +
          '    </div>' +
          '    <strong>' +
          formatPKR(item.price * item.quantity) +
          '</strong>' +
          '  </div>' +
          '</div>'
        );
      })
      .join('');

    var promoLine = '';
    if (promo) {
      if (discount > 0) {
        promoLine =
          '<div class="cart-summary-line" style="color:var(--color-success);">' +
          '  <span>Promo (' +
          escapeHTML(promo.code) +
          ')</span>' +
          '  <span>-' +
          formatPKR(discount) +
          '</span>' +
          '</div>';
      } else {
        promoLine =
          '<div class="cart-summary-line" style="color:var(--color-warning);font-size:0.82rem;">' +
          '  <span>Promo ' +
          escapeHTML(promo.code) +
          ' requires ' +
          formatPKR(promo.minSubtotal) +
          '</span>' +
          '  <span>Not met</span>' +
          '</div>';
      }
    }

    footerEl.innerHTML =
      '<div class="cart-summary-line"><span>Subtotal</span><span>' +
      formatPKR(subtotal) +
      '</span></div>' +
      promoLine +
      '<div class="cart-summary-total"><span>Total Payable</span><span>' +
      formatPKR(total) +
      '</span></div>' +
      '<div style="display:flex;gap:0.6rem;margin-top:0.35rem;">' +
      '  <button type="button" class="btn-outline btn-sm" data-cart-action="clear">Clear</button>' +
      '  <button type="button" class="btn-primary btn-block" data-cart-action="checkout">Proceed to Checkout</button>' +
      '</div>';
  }

  function updateCartUI() {
    var count = getCount();
    document.querySelectorAll('[data-cart-count]').forEach(function (badge) {
      badge.textContent = String(count);
    });
    renderCartDrawer();
  }

  function initNavbar() {
    var toggleBtn = document.querySelector('.navbar-toggle');
    var navWrap = document.querySelector('.navbar-nav-wrap');
    if (toggleBtn && navWrap) {
      toggleBtn.addEventListener('click', function () {
        var isOpen = navWrap.classList.toggle('is-open');
        toggleBtn.setAttribute('aria-expanded', String(isOpen));
      });
    }

    document.querySelectorAll('[data-open-cart]').forEach(function (trigger) {
      trigger.addEventListener('click', openCartDrawer);
    });

    updateCartUI();
  }

  window.DineInCart = {
    getCart: getCart,
    addToCart: addToCart,
    updateQuantity: updateQuantity,
    removeFromCart: removeFromCart,
    clearCart: clearCart,
    getCount: getCount,
    getSubtotal: getSubtotal,
    getPromo: getPromo,
    setPromo: setPromo,
    clearPromo: clearPromo,
    validatePromoCode: validatePromoCode,
    calculateDiscount: calculateDiscount,
    formatPKR: formatPKR,
    showToast: showToast,
    openCart: openCartDrawer,
    closeCart: closeCartDrawer,
    PROMO_CATALOG: PROMO_CATALOG
  };

  document.addEventListener('DOMContentLoaded', initNavbar);
})(window, document);
