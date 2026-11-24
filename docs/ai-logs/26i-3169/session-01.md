# AI Log — Session 01 (26i-3169)

**Date:** 2026-11-24
**Project:** Dine in (Group 03, Section SE-D)

## Prompt

> Create a shared design system and base files for a restaurant online ordering website titled "Dine in" (Group 03, Section SE-D). Keep the HTML, CSS, and JavaScript clean, simple, and human-readable using vanilla HTML5, CSS3, and ES6 JavaScript (no frameworks).
> 1. Create css/style.css with warm restaurant colors (deep charcoal #1E1E1E, warm terracotta/orange #D9532F, cream background #FAF7F2), responsive navbar with links to all 15 pages inside pages/ folder, clean footer, buttons, cards, and form styles.
> 2. Create js/app.js with a simple localStorage-based shopping cart system (add to cart, update quantity, remove item, calculate subtotal/tax/delivery, update cart badge count) and basic navbar mobile toggle.
> Do not overwrite index.html yet—just create css/style.css and js/app.js.

## Summary Response

Created the shared design system and client-side base files for **Dine in** (Group 03, Section SE-D) without modifying `index.html`:

1. **`css/style.css`**
   - **Color tokens (`:root`)**: Deep charcoal (`#1E1E1E`), warm terracotta (`#D9532F`), and cream background (`#FAF7F2`) alongside matching surface, border, and status colors.
   - **Responsive navbar**: Sticky `.navbar` designed to hold all 15 `pages/` links (supporting both wrapped `.navbar-links` and optional `.nav-dropdown` groups), `.cart-link` / `.cart-badge`, and a collapsible mobile menu (`.navbar-toggle` + `.navbar-menu.is-open`) below `1024px`.
   - **Components**: Clean `.footer` grid, button variants (`.btn-primary`, `.btn-secondary`, `.btn-outline`, `.btn-ghost`, `.btn-danger`, `.btn-sm`, `.btn-lg`, `.btn-block`), `.card` & `.badge` styles, form controls (`.form-control`, `.form-select`, `.form-textarea`, `.form-check`, validation states), and cart/summary/toast helpers.

2. **`js/app.js`**
   - **`localStorage` cart system** (`dinein_cart_v1`, exposed on `window.DineInCart`): `getCart()`, `addToCart()`, `updateQuantity()`, `removeFromCart()`, `clearCart()`, `getCartCount()`, `calculateTotals()` (subtotal, 8% tax via `DEFAULT_TAX_RATE`, `$4.99` delivery via `DEFAULT_DELIVERY_FEE` waived when empty or `orderType: 'pickup'`, and total), `formatCurrency()`, and `updateCartBadge()`.
   - **Declarative add-to-cart & feedback**: Supports `[data-add-to-cart]` buttons via event delegation, `dinein:cart-updated` custom events, cross-tab `storage` sync, and `showToast()`.
   - **Navbar mobile toggle**: `initNavbarToggle()` handles `.navbar-toggle` / `.navbar-menu` open/close, Escape and outside-click dismissal, `.nav-dropdown-toggle` on mobile, and automatic `.active` highlighting for the current page.

*Note: `node` was not installed in the workspace environment, so runtime/syntax checks via Node were not executed; `git status -s` confirmed only `css/style.css` and `js/app.js` were added.*
