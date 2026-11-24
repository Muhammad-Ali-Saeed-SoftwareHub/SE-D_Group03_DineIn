# AI Log — Session 02 (26i-3169)

**Date:** 2026-11-24
**Project:** Dine in (Group 03, Section SE-D)

## Prompt

> Using the existing css/style.css and js/app.js, create my 3 assigned pages inside the pages/ folder for the "Dine in" restaurant online ordering website (Group 03, Section SE-D). Keep the HTML, CSS, and JavaScript clean, straightforward, and human-readable:
> 1. pages/cart.html: Shopping cart page that displays items from localStorage (plus a "Load Sample Items" button if the cart is empty so it can be easily tested), lets users increase/decrease quantities, remove items, apply a sample promo code (e.g., DINE10), shows subtotal, tax, delivery fee, total, and has a "Proceed to Checkout" button linking to checkout.html.
> 2. pages/checkout.html: Checkout page showing the order summary from the cart, customer delivery details form (full name, phone, delivery address, delivery instructions) with simple validation, payment method selection (Cash on Delivery / Card), and a "Place Order" button that saves a generated order ID and order details to localStorage and redirects to order-tracking.html.
> 3. pages/order-tracking.html: Order tracking page that reads the placed order from localStorage (with a default demo order fallback), displays the order ID, estimated delivery time, ordered items summary, and a clear 4-step visual status tracker (Order Confirmed -> Preparing Food -> Out for Delivery -> Delivered) with a button to simulate advancing the order status.
> Ensure all 3 pages use relative paths (../css/style.css and ../js/app.js) and include the consistent header navbar and footer. Also log this prompt and your summary response into docs/ai-logs/26i-3169/session-02.md.

## Summary Response

Created the 3 assigned pages inside `pages/` using `../css/style.css` and `../js/app.js`, with a consistent shared navbar (`.navbar`, mobile toggle, cart badge) and footer (`.footer`):

1. **`pages/cart.html`**
   - Reads and renders cart items from `localStorage` via `window.DineInCart` (`getCart`, `updateQuantity`, `removeFromCart`, `calculateTotals`).
   - Provides a **Load Sample Items** button when the cart is empty (and a **Clear Cart** button when populated), `+` / `-` quantity controls, item removal, and promo code support (`DINE10` for 10% off subtotal, saved in `dinein_promo_v1`).
   - Displays item count, subtotal, promo discount (when applied), 8% estimated tax, delivery fee, total, and a **Proceed to Checkout** button linking to `checkout.html`.

2. **`pages/checkout.html`**
   - Displays the live order summary from the cart (including any `DINE10` discount) and alerts if the cart is empty.
   - Includes a validated delivery details form (Full Name, Phone Number, Delivery Address, optional Delivery Instructions) and payment method selection (**Cash on Delivery** or **Card**, with conditional card fields and simple validation).
   - On **Place Order**, generates an order ID (`DI-XXXXX`), saves the order object (`dinein_active_order_v1`) to `localStorage`, clears the cart and promo code, and redirects to `order-tracking.html`.

3. **`pages/order-tracking.html`**
   - Loads `dinein_active_order_v1` from `localStorage` and falls back to a built-in demo order (`DI-73920`) with a clear notice banner if no placed order exists.
   - Displays the Order ID, estimated delivery time, ordered items and totals summary, delivery/payment details, and a 4-step visual progress tracker (**Order Confirmed** → **Preparing Food** → **Out for Delivery** → **Delivered**).
   - Includes **Advance Order Status** and **Reset Status** buttons to simulate order progression (persisting updates to `localStorage` for placed orders).
