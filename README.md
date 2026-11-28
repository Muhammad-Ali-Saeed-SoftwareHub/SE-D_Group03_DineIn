i263166
# SE-D_Group03_DineIn

**DineIn** is a responsive restaurant web application built with **HTML5**, **CSS3**, and **Vanilla JavaScript** for Section SE-D, Group 03.

## Assigned Pages Implemented (Branch: `i263166`)

- **`index.html`** — Restaurant landing page featuring the hero banner, featured signature dishes, culinary story (`#about`), special offers (`#offers`), guest testimonials (`#testimonials`), and shared header/footer.
- **`pages/full-menu.html`** — Interactive full menu with category filter pills (`All`, `Starters`, `Mains`, `Wood-Fired & Pasta`, `Desserts`, `Beverages`), live search by dish name/ingredients, price sorting, and quick add-to-cart actions.
- **`pages/dish-details.html`** — Dynamic dish detail page driven by `?id=<dish-id>` URL parameters, displaying high-resolution imagery, description, dietary notes, ingredient chips, a quantity selector (`1–20`), `localStorage` cart integration, and related dish recommendations.

## Shared Assets & Design System

- **`css/styles.css`** — Shared responsive stylesheet using the group leader's exact CSS custom properties (`--color-charcoal`, `--color-terracotta`, `--color-cream`, `--color-surface`, `--color-surface-alt`, `--color-border`, `--color-text`, `--color-muted`).
- **`js/menu-data.js`** — Centralized menu catalog (`window.DINEIN_MENU`) shared across all three pages.
- **`js/main.js`** — Vanilla JavaScript handling mobile navigation, menu filtering/search/sorting, dish detail rendering, quantity controls, toast notifications, and the persistent `localStorage` order cart drawer.
- **`images/`** — Local food and restaurant photography for every dish and section.

## Project Structure

```text
SE-D_Group03_DineIn/
├── index.html
├── README.md
├── css/
│   └── styles.css
├── js/
│   ├── menu-data.js
│   └── main.js
├── pages/
│   ├── full-menu.html
│   └── dish-details.html
├── images/
│   ├── hero-dining.jpg
│   ├── about-chef.jpg
│   ├── dish-bruschetta.jpg
│   ├── dish-calamari.jpg
│   ├── dish-steak.jpg
│   ├── dish-salmon.jpg
│   ├── dish-pasta.jpg
│   ├── dish-pizza.jpg
│   ├── dish-tiramisu.jpg
│   └── dish-mocktail.jpg
└── docs/
```

## How to Run

Open `index.html` directly in any modern browser, or serve the repository folder with a local static server (e.g., VS Code Live Server or `python -m http.server`).
# Dine in

## Overview
**Dine in** is a multi-page restaurant and online ordering web application built for **Theme #19: Restaurant with online ordering** (Category: Food) by **Group 03**, **Section SE-D**. It covers dish discovery, menu filtering and customization, cart and checkout workflows, order tracking, platters/deals/vouchers, table reservations and catering, and customer reviews, chef profiles, and support FAQs.

## Links
- **Live Website:** https://muhammad-ali-saeed-softwarehub.github.io/SE-D_Group03_DineIn/
- **Google Form (Usability Feedback):** https://docs.google.com/forms/d/e/1FAIpQLSe24w8w8YXxBack52xmOUAOzrTbk5FKXKqHJ6JFFHZ66pQhYA/viewform?usp=sharing&ouid=117568575186808131902

## Pages & Modules by Team Member

### 1. Muhammad Danyal Khan (`26I-3166`) — Core Experience & Discovery
- `index.html` — Home Page: Hero section, featured dishes, quick order search
- `full-menu.html` — Full Menu: Category filter, price sorting, search
- `dish-details.html` — Dish Details: Customization options, spice/portion calculator, add to cart

### 2. Muhammad Ali Saeed (`26I-3169`) — Ordering & Checkout Flow
- `cart.html` — Shopping Cart: Quantity update, promo code calculator, saved cart items
- `checkout.html` — Online Checkout: Delivery address form validation, payment selection, order confirmation
- `order-tracking.html` — Live Order Tracking: Order ID lookup, step-by-step status tracker, saved recent orders

### 3. Badiuzzaman Mian (`26I-3171`) — Deals, Platters & Combos
- `deals.html` — Deals & Combos: Limited-time offers, countdown timer, bundle modal
- `build-platter.html` — Build Your Own Platter: Interactive item selector, live calorie & price calculator
- `gift-vouchers.html` — Gift Vouchers: Custom voucher amount calculator, recipient form validation, saved vouchers

### 4. Zarnab Mudassar (`26I-3200`) — Dining, Events & Reservations
- `reservations.html` — Table Reservation: Date/time/guests form validation, table availability check, saved booking
- `catering.html` — Catering & Events: Guest count cost estimator, event inquiry form, package tabs
- `branches.html` — Our Branches & Timings: City/area filter, branch gallery modal, opening status

### 5. Aiman Akbar (`26I-3209`) — Trust, Community & Support
- `reviews.html` — Customer Reviews: Rating filter, submit review form with validation, average rating calculator
- `about-chefs.html` — About Us & Chefs: Chef profiles rendered from JS, interactive timeline/gallery, specialty modal
- `contact-faq.html` — Contact Us & FAQs: Interactive FAQ accordion, support ticket form validation, saved inquiries

## Feature Matrix
| Feature | Page(s) | Owner |
| --- | --- | --- |
| Hero section, featured dishes & quick order search | `index.html` | Muhammad Danyal Khan (`26I-3166`) |
| Category filter, price sorting & menu search | `full-menu.html` | Muhammad Danyal Khan (`26I-3166`) |
| Dish customization, spice/portion calculator & add to cart | `dish-details.html` | Muhammad Danyal Khan (`26I-3166`) |
| Quantity update, promo code calculator & saved cart items | `cart.html` | Muhammad Ali Saeed (`26I-3169`) |
| Delivery address form validation, payment selection & order confirmation | `checkout.html` | Muhammad Ali Saeed (`26I-3169`) |
| Order ID lookup, step-by-step status tracker & saved recent orders | `order-tracking.html` | Muhammad Ali Saeed (`26I-3169`) |
| Limited-time offers, countdown timer & bundle modal | `deals.html` | Badiuzzaman Mian (`26I-3171`) |
| Interactive platter selector, live calorie & price calculator | `build-platter.html` | Badiuzzaman Mian (`26I-3171`) |
| Custom voucher amount calculator, recipient form validation & saved vouchers | `gift-vouchers.html` | Badiuzzaman Mian (`26I-3171`) |
| Date/time/guests form validation, table availability check & saved booking | `reservations.html` | Zarnab Mudassar (`26I-3200`) |
| Guest count cost estimator, event inquiry form & package tabs | `catering.html` | Zarnab Mudassar (`26I-3200`) |
| City/area filter, branch gallery modal & opening status | `branches.html` | Zarnab Mudassar (`26I-3200`) |
| Rating filter, submit review form with validation & average rating calculator | `reviews.html` | Aiman Akbar (`26I-3209`) |
| Chef profiles rendered from JS, interactive timeline/gallery & specialty modal | `about-chefs.html` | Aiman Akbar (`26I-3209`) |
| Interactive FAQ accordion, support ticket form validation & saved inquiries | `contact-faq.html` | Aiman Akbar (`26I-3209`) |

## Contribution Summary
| Name | Roll No | Focus Area | Pages |
| --- | --- | --- | --- |
| Muhammad Danyal Khan | `26I-3166` | Core Experience & Discovery | `index.html`, `full-menu.html`, `dish-details.html` |
| Muhammad Ali Saeed | `26I-3169` | Ordering & Checkout Flow | `cart.html`, `checkout.html`, `order-tracking.html` |
| Badiuzzaman Mian | `26I-3171` | Deals, Platters & Combos | `deals.html`, `build-platter.html`, `gift-vouchers.html` |
| Zarnab Mudassar | `26I-3200` | Dining, Events & Reservations | `reservations.html`, `catering.html`, `branches.html` |
| Aiman Akbar | `26I-3209` | Trust, Community & Support | `reviews.html`, `about-chefs.html`, `contact-faq.html` |