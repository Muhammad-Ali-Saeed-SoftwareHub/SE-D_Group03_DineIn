/**
 * DineIn Restaurant — Shared Menu Catalog
 * Used across index.html, pages/full-menu.html, and pages/dish-details.html
 */

window.DINEIN_MENU = [
  {
    id: 'heirloom-bruschetta',
    name: 'Roasted Garlic & Heirloom Bruschetta',
    category: 'Starters',
    price: 11.50,
    tag: 'Vegetarian',
    featured: false,
    prepTime: '12 mins',
    calories: '320 kcal',
    rating: '4.8',
    image: 'images/dish-bruschetta.jpg',
    shortDesc: 'Charred artisan sourdough topped with marinated heirloom tomatoes, whipped ricotta, and aged balsamic.',
    fullDesc: 'Thick slices of hearth-baked sourdough rubbed with roasted garlic, layered with vine-ripened heirloom tomatoes, cold-pressed olive oil, fresh sweet basil, and a velvety reduction of 12-year Modena balsamic.',
    ingredients: [
      'Artisan Sourdough',
      'Heirloom Tomatoes',
      'Roasted Garlic',
      'Fresh Basil',
      'Whipped Ricotta',
      'Aged Balsamic Glaze',
      'Extra Virgin Olive Oil'
    ],
    dietary: 'Vegetarian • Contains Wheat & Dairy'
  },
  {
    id: 'crispy-calamari',
    name: 'Crispy Sea Salt Calamari',
    category: 'Starters',
    price: 14.75,
    tag: 'Guest Favorite',
    featured: true,
    prepTime: '14 mins',
    calories: '440 kcal',
    rating: '4.9',
    image: 'images/dish-calamari.jpg',
    shortDesc: 'Lightly dusted tender squid rings flash-fried to golden crispness, served with charred lemon and herb aioli.',
    fullDesc: 'Wild-caught squid delicately tossed in seasoned semolina flour and flash-fried for an airy crunch. Finished with flaky sea salt, cracked black pepper, roasted garlic herb aioli, and flame-charred lemon.',
    ingredients: [
      'Wild Calamari Rings',
      'Semolina Flour',
      'Flaky Sea Salt',
      'Roasted Garlic Aioli',
      'Charred Lemon',
      'Fresh Parsley',
      'Smoked Paprika'
    ],
    dietary: 'Seafood • Contains Wheat & Egg'
  },
  {
    id: 'wood-fired-ribeye',
    name: 'Wood-Fired Ribeye Steak',
    category: 'Mains',
    price: 34.00,
    tag: "Chef's Signature",
    featured: true,
    prepTime: '22 mins',
    calories: '780 kcal',
    rating: '4.9',
    image: 'images/dish-steak.jpg',
    shortDesc: 'Prime 12oz ribeye seared over oak embers with rosemary compound butter, baby potatoes, and charred asparagus.',
    fullDesc: 'Dry-aged 28 days and grilled over seasoned oak wood for a caramelized crust and juicy center. Basted with rosemary-thyme butter and plated alongside crispy herb baby potatoes and tender grilled asparagus.',
    ingredients: [
      'Prime 12oz Ribeye',
      'Rosemary Herb Butter',
      'Baby Gold Potatoes',
      'Grilled Asparagus',
      'Cracked Black Pepper',
      'Maldon Sea Salt'
    ],
    dietary: 'Gluten-Free • High Protein'
  },
  {
    id: 'seared-atlantic-salmon',
    name: 'Pan-Seared Atlantic Salmon',
    category: 'Mains',
    price: 27.50,
    tag: 'Gluten-Free',
    featured: true,
    prepTime: '18 mins',
    calories: '610 kcal',
    rating: '4.8',
    image: 'images/dish-salmon.jpg',
    shortDesc: 'Crispy-skin Atlantic salmon fillet over creamy saffron risotto with charred broccolini and citrus herb oil.',
    fullDesc: 'Sustainably sourced Atlantic salmon seared skin-side down until golden and crisp, resting on slow-simmered Arborio saffron risotto with roasted broccolini and bright chive-lemon oil.',
    ingredients: [
      'Atlantic Salmon Fillet',
      'Saffron Arborio Risotto',
      'Charred Broccolini',
      'Parmigiano Reggiano',
      'Citrus Herb Oil',
      'Fresh Chives'
    ],
    dietary: 'Gluten-Free • Rich in Omega-3'
  },
  {
    id: 'truffle-tagliatelle',
    name: 'Truffle Wild Mushroom Tagliatelle',
    category: 'Wood-Fired & Pasta',
    price: 23.00,
    tag: 'Vegetarian',
    featured: true,
    prepTime: '16 mins',
    calories: '640 kcal',
    rating: '4.9',
    image: 'images/dish-pasta.jpg',
    shortDesc: 'Hand-rolled egg tagliatelle tossed with sautéed wild mushrooms, black truffle cream, and aged parmesan.',
    fullDesc: 'Freshly extruded bronze-die tagliatelle folded into a silky emulsion of roasted cremini and porcini mushrooms, black summer truffle paste, fresh thyme, and 24-month aged Parmigiano Reggiano.',
    ingredients: [
      'Fresh Egg Tagliatelle',
      'Porcini & Cremini Mushrooms',
      'Black Truffle Paste',
      '24-Month Parmesan',
      'Fresh Thyme',
      'Cultured Butter'
    ],
    dietary: 'Vegetarian • Contains Wheat, Egg & Dairy'
  },
  {
    id: 'burrata-margherita-pizza',
    name: 'Wood-Fired Burrata Margherita',
    category: 'Wood-Fired & Pasta',
    price: 19.50,
    tag: 'Wood-Fired',
    featured: false,
    prepTime: '12 mins',
    calories: '690 kcal',
    rating: '4.8',
    image: 'images/dish-pizza.jpg',
    shortDesc: '72-hour fermented Neapolitan dough topped with crushed San Marzano tomatoes, creamy burrata, and basil.',
    fullDesc: 'Hand-stretched sourdough crust baked at 850°F in our brick oven for leopard-spotted char, finished with crushed San Marzano tomatoes, fresh Pugliese burrata, sweet basil leaves, and extra virgin olive oil.',
    ingredients: [
      '72-Hour Sourdough Crust',
      'San Marzano Tomatoes',
      'Fresh Burrata',
      'Sweet Basil Leaves',
      'Extra Virgin Olive Oil',
      'Sea Salt'
    ],
    dietary: 'Vegetarian • Contains Wheat & Dairy'
  },
  {
    id: 'espresso-tiramisu',
    name: 'Classic Espresso Tiramisu',
    category: 'Desserts',
    price: 10.50,
    tag: 'House Made',
    featured: false,
    prepTime: '8 mins',
    calories: '420 kcal',
    rating: '4.9',
    image: 'images/dish-tiramisu.jpg',
    shortDesc: 'Espresso-soaked savoiardi layered with whipped mascarpone zabaglione, dark cocoa, and chocolate curls.',
    fullDesc: 'Crafted daily using freshly pulled dark-roast espresso, delicate ladyfinger biscuits, velvety mascarpone cream, and a generous dusting of Dutch-process cocoa powder with shaved dark chocolate.',
    ingredients: [
      'Mascarpone Cheese',
      'Dark Roast Espresso',
      'Savoiardi Biscuits',
      'Dutch Cocoa Powder',
      'Dark Chocolate Curls',
      'Vanilla Bean'
    ],
    dietary: 'Vegetarian • Contains Wheat, Egg & Dairy'
  },
  {
    id: 'blood-orange-fizz',
    name: 'Blood Orange & Rosemary Fizz',
    category: 'Beverages',
    price: 7.50,
    tag: 'Zero-Proof',
    featured: false,
    prepTime: '5 mins',
    calories: '110 kcal',
    rating: '4.7',
    image: 'images/dish-mocktail.jpg',
    shortDesc: 'Fresh-pressed blood orange juice shaken with rosemary-infused syrup and topped with crisp sparkling mineral water.',
    fullDesc: 'Bright seasonal blood orange juice balanced with house-steeped garden rosemary syrup, fresh lime zest, and effervescent sparkling water over hand-cut crystal ice.',
    ingredients: [
      'Fresh Blood Orange Juice',
      'House Rosemary Syrup',
      'Sparkling Mineral Water',
      'Fresh Lime Zest',
      'Fresh Rosemary Sprig'
    ],
    dietary: 'Vegan • Gluten-Free • Non-Alcoholic'
  }
];
