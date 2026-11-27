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
