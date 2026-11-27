# AI Log — Session 01 (26i-3171)

**Date:** 2026-11-27
**Project:** Dine in (Group 03, Section SE-D)
**Member:** Badiuzzaman Mian (26I-3171)

## Prompt

> Read index.html, css/style.css, and js/app.js in this repository first so you match our exact DineIn design system (--color-charcoal: #1E1E1E, --color-terracotta: #D9532F, --color-cream: #FAF7F2, Georgia headings, Segoe UI body, .navbar, .hero, .card, .form-card, .summary-box, .btn-primary, .badge, .alert, .toast-container). Do NOT use Bootstrap or jQuery.
>
> Create docs/ai-logs/26i-3171 if it doesn't exist, and create my 3 pages inside pages/ plus a custom stylesheet css/26i-3171.css matching my prototype layouts:
> - pages/deals.html — Deals hero banner with a live countdown timer (Expires in 02:15:30), search input and category filter dropdown, and #deals-grid container for deal cards.
> - pages/build-platter.html — Interactive platter builder matching my prototype: category tabs (Bases, Items, Sides), an item selection grid, a live Platter Canvas showing chosen items, a .summary-box displaying Total Calories, Subtotal, Total Price, and an Add to Cart / Place Order button, plus a sticky mobile summary bar at the bottom on small screens.
> - pages/gift-vouchers.html — Toggle between e-Gift Cards and Physical Cards, a live visual voucher card preview, preset/custom Amount input, Recipient Name, conditional Recipient Email or Delivery Address field, Message textarea, and Buy Now button.
>
> Copy the exact <header class="navbar"> and <footer class="footer"> from index.html (updating relative paths to ../index.html, ../css/style.css, ../css/26i-3171.css, ../js/app.js, and ../js/26i-3171.js), mark the active .nav-link on each page, and keep [data-cart-badge].

## Summary Response

Created the 3 assigned Module 3 pages, custom stylesheet, and interactive ES6 script matching the **Dine in** design system and paper prototype layouts:

1. **Shared Baseline & Navigation**
   - Checked out the shared `css/style.css` and `js/app.js` verbatim from `origin/i263169` so all three pages resolve relative assets (`../css/style.css`, `../js/app.js`) and integrate with `window.DineInCart` without merge divergence.
   - Copied the shared `<header class="navbar">` (with `[data-cart-badge]` and active `.nav-link`) and `<footer class="footer">` across all 3 pages.

2. **`css/26i-3171.css` & `js/26i-3171.js`**
   - Styled and implemented all page-specific layouts using `--color-charcoal`, `--color-terracotta`, `--color-cream`, Georgia headings, and Segoe UI body text without Bootstrap or jQuery.

3. **`pages/deals.html`**
   - Added `.deals-hero` with a live ticking `Expires in 02:15:30` countdown (`#deals-countdown`), real-time search (`#deals-search`) and category dropdown (`#deals-category`), and `#deals-grid` rendering 6 deal cards with discount badges, strikethrough original prices, and `[data-add-to-cart]` buttons.

4. **`pages/build-platter.html`**
   - Built an interactive 3-column platter builder with `Bases`, `Items`, and `Sides` category tabs, item selection grid, live visual **Platter Canvas** (`#platter-canvas`), `.summary-box` displaying **Total Calories**, **Subtotal**, estimated 8% tax, **Total Price**, payment selector, and **Add to Cart / Place Order** button with confirmation popup modal, plus a sticky `.mobile-summary-bar` on small screens.

5. **`pages/gift-vouchers.html`**
   - Implemented e-Gift Cards vs. Physical Cards toggle cards, live visual voucher card preview, `$25`/`$50`/`$100`/`$150` preset buttons and custom amount input, Recipient Name, conditional Recipient Email or Delivery Address validation, Message textarea with live character count, and **Buy Now** cart integration.
