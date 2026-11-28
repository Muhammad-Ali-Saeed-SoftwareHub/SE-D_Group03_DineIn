# AI Log — Session 04 (26i-3169)

**Date:** 2026-11-27
**Project:** Dine in (Group 03, Section SE-D)

## Prompt

> Update the header navbar and footer links in pages/cart.html, pages/checkout.html, and pages/order-tracking.html to match the exact 15 page filenames listed in README.md. Keep Home pointing to ../index.html, and use sibling filenames for all 14 pages inside pages/ (full-menu.html, dish-details.html, cart.html, checkout.html, order-tracking.html, deals.html, build-platter.html, gift-vouchers.html, reservations.html, catering.html, branches.html, reviews.html, about-chefs.html, contact-faq.html). Remove mismatched or non-project links (menu.html, specials.html, gift-cards.html, about.html, contact.html, order-history.html, profile.html, login.html). Keep the active class only on each page's own link (Cart on cart.html, Checkout on checkout.html, Track Order on order-tracking.html). Finally, save this session's prompt and summary response into docs/ai-logs/26i-3169/session-04.md.

## Summary Response

Updated the header navigation and footer links in `pages/cart.html`, `pages/checkout.html`, and `pages/order-tracking.html` to match the 15 project pages listed in `README.md`:

1. **Header Navbar (`.navbar-links`)**
   - Updated the top-level links (`../index.html`, `full-menu.html`, `deals.html`, `cart.html`, `checkout.html`, `order-tracking.html`, `reservations.html`) and the `More` dropdown (`dish-details.html`, `build-platter.html`, `gift-vouchers.html`, `catering.html`, `branches.html`, `reviews.html`, `about-chefs.html`, `contact-faq.html`) so all 15 project pages are linked using `../index.html` for Home and sibling filenames for all 14 pages inside `pages/`.
   - Removed all mismatched and non-project links (`menu.html`, `specials.html`, `gift-cards.html`, `about.html`, `contact.html`, `order-history.html`, `profile.html`, `login.html`).
   - Kept the `active` class exclusively on each page's own link (`Cart` in `pages/cart.html`, `Checkout` in `pages/checkout.html`, and `Track Order` in `pages/order-tracking.html`).

2. **Footer Links (`.footer-links`) & In-Page Link**
   - Updated the footer link columns (`Ordering & Deals` and `Dining & Support`) across all three pages to include all 15 exact project page links (`../index.html` and the 14 sibling `pages/` filenames) with no mismatched or non-project links.
   - Updated the "Continue Browsing Menu" button in `pages/cart.html` from `menu.html` to `full-menu.html` so no `menu.html` reference remains.

3. **Verification**
   - Ran a Python check over `pages/cart.html`, `pages/checkout.html`, and `pages/order-tracking.html` confirming each file has all 15 expected unique `href` targets in both `<header>` and `<footer>`, zero occurrences of the removed links (`menu.html`, `specials.html`, `gift-cards.html`, `about.html`, `contact.html`, `order-history.html`, `profile.html`, `login.html`), and `active` set only on each page's own link.
