/*
  ============================================================
  MINI-PROJET : BOUTIQUE DE VÊTEMENTS VOILÉS (AnBy Boutique)
  ============================================================
  Principe : cette application affiche un catalogue d'articles
  de mode voilée (hijabs, abayas, accessoires). L'utilisateur
  peut :
    - rechercher un article par son nom,
    - filtrer les articles par catégorie (Hijabs / Abayas / Accessoires),
    - ajouter un article au panier,
    - augmenter/diminuer la quantité dans le panier,
    - retirer un article du panier,
    - voir le total du panier se calculer automatiquement.

  Comment l'utiliser : tape un mot dans la barre de recherche
  pour filtrer le catalogue, ou clique sur une catégorie.
  Clique sur "Ajouter" pour mettre un article dans le panier.
  Dans le panier, utilise + et - pour changer la quantité, ou
  le bouton rouge pour retirer complètement un article.
  Toutes les données sont statiques (tableau JavaScript), il
  n'y a pas de base de données.
  ============================================================
*/

// -----------------------------
// 1. DONNÉES STATIQUES DE DÉPART
// -----------------------------
const productList = [
  { id: 1, name: "Hijab en soie", category: "hijab", price: 3500, image: "hijab-soie.jpg" },
  { id: 2, name: "Hijab jersey", category: "hijab", price: 2500, image: "hijab-jersey.jpg" },
  { id: 3, name: "Turban pratique", category: "hijab", price: 2000, image: "turban.jpg" },
  { id: 4, name: "Abaya noire classique", category: "abaya", price: 15000, image: "abaya-noire.jpg" },
  { id: 5, name: "Abaya brodée", category: "abaya", price: 22000, image: "abaya-brodee.jpg" },
  { id: 6, name: "Jilbab deux pièces", category: "abaya", price: 18000, image: "jilbab.jpg" },
  { id: 7, name: "Ceinture pour abaya", category: "accessoire", price: 2500, image: "ceinture.jpg" },
  { id: 8, name: "Sac à main", category: "accessoire", price: 12000, image: "sac-main.jpg" },
  { id: 9, name: "Chaussures plates", category: "accessoire", price: 9000, image: "chaussures-plates.jpg" }
];

// Le panier : chaque élément contient l'id de l'article et la quantité choisie
let cartItems = [];

// Si un panier a déjà été sauvegardé dans le navigateur, on le récupère
const savedCart = localStorage.getItem("savedCartItems");
if (savedCart !== null) {
  cartItems = JSON.parse(savedCart);
}

// Filtres actifs
let currentCategory = "all";
let currentSearchText = "";

// -----------------------------
// 2. SÉLECTION DES ÉLÉMENTS DU DOM
// -----------------------------
const searchInput = document.getElementById("searchInput");
const categoryButtons = document.querySelectorAll(".categoryBtn");
const productListElement = document.getElementById("productList");
const cartListElement = document.getElementById("cartList");
const cartTotalElement = document.getElementById("cartTotal");

// -----------------------------
// 3. FONCTIONS DE L'APPLICATION
// -----------------------------

// Retourne l'article correspondant à un id donné
function findProductById(productId) {
  for (let i = 0; i < productList.length; i++) {
    if (productList[i].id === productId) {
      return productList[i];
    }
  }
  return null;
}

// Retourne les articles à afficher selon la recherche et la catégorie
function getFilteredProducts() {
  return productList.filter(function (product) {
    const matchesCategory = (currentCategory === "all") || (product.category === currentCategory);
    const matchesSearch = product.name.toLowerCase().includes(currentSearchText.toLowerCase());
    return matchesCategory && matchesSearch;
  });
}

// Crée une carte HTML pour un article du catalogue
function createProductCard(product) {
  const card = document.createElement("div");
  card.className = "productCard";

  const image = document.createElement("img");
  image.src = "images/" + product.image;
  image.alt = product.name;
  image.className = "productImage";

  const name = document.createElement("h3");
  name.textContent = product.name;

  const price = document.createElement("p");
  price.className = "price";
  price.textContent = product.price + " FCFA";

  const addButton = document.createElement("button");
  addButton.textContent = "Ajouter";
  addButton.addEventListener("click", function () {
    addToCart(product.id);
  });

  card.appendChild(image);
  card.appendChild(name);
  card.appendChild(price);
  card.appendChild(addButton);

  return card;
}

// Affiche le catalogue filtré dans le DOM
function renderProducts() {
  productListElement.innerHTML = "";

  const productsToShow = getFilteredProducts();

  if (productsToShow.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "emptyMessage";
    emptyMessage.textContent = "Aucun article trouvé.";
    productListElement.appendChild(emptyMessage);
  } else {
    for (let i = 0; i < productsToShow.length; i++) {
      const card = createProductCard(productsToShow[i]);
      productListElement.appendChild(card);
    }
  }
}

// Crée une ligne HTML pour un article du panier
function createCartRow(cartItem) {
  const product = findProductById(cartItem.productId);

  const li = document.createElement("li");
  li.className = "cartItem";

  const infoSpan = document.createElement("span");
  infoSpan.textContent = product.name + " x" + cartItem.quantity;

  const qtyControls = document.createElement("div");
  qtyControls.className = "qtyControls";

  const decreaseButton = document.createElement("button");
  decreaseButton.textContent = "-";
  decreaseButton.addEventListener("click", function () {
    changeQuantity(cartItem.productId, -1);
  });

  const increaseButton = document.createElement("button");
  increaseButton.textContent = "+";
  increaseButton.addEventListener("click", function () {
    changeQuantity(cartItem.productId, 1);
  });

  qtyControls.appendChild(decreaseButton);
  qtyControls.appendChild(increaseButton);

  const removeButton = document.createElement("button");
  removeButton.textContent = "Retirer";
  removeButton.className = "removeBtn";
  removeButton.addEventListener("click", function () {
    removeFromCart(cartItem.productId);
  });

  li.appendChild(infoSpan);
  li.appendChild(qtyControls);
  li.appendChild(removeButton);

  return li;
}

// Calcule le total du panier
function calculateTotal() {
  let total = 0;
  for (let i = 0; i < cartItems.length; i++) {
    const product = findProductById(cartItems[i].productId);
    total = total + (product.price * cartItems[i].quantity);
  }
  return total;
}

// Sauvegarde le panier dans le navigateur
function saveCart() {
  localStorage.setItem("savedCartItems", JSON.stringify(cartItems));
}

// Met à jour le badge avec le nombre total d'articles dans le panier
function updateCartCount() {
  let totalItems = 0;
  for (let i = 0; i < cartItems.length; i++) {
    totalItems = totalItems + cartItems[i].quantity;
  }
  document.getElementById("cartCount").textContent = totalItems;
}

// Affiche le panier dans le DOM
function renderCart() {
  cartListElement.innerHTML = "";

  if (cartItems.length === 0) {
    const emptyMessage = document.createElement("li");
    emptyMessage.className = "emptyMessage";
    emptyMessage.textContent = "Ton panier est vide.";
    cartListElement.appendChild(emptyMessage);
  } else {
    for (let i = 0; i < cartItems.length; i++) {
      const row = createCartRow(cartItems[i]);
      cartListElement.appendChild(row);
    }
  }

  cartTotalElement.textContent = "Total : " + calculateTotal() + " FCFA";
  saveCart();
  updateCartCount();
}

// Ajoute un article au panier (ou augmente sa quantité s'il y est déjà)
function addToCart(productId) {
  for (let i = 0; i < cartItems.length; i++) {
    if (cartItems[i].productId === productId) {
      cartItems[i].quantity = cartItems[i].quantity + 1;
      renderCart();
      return;
    }
  }

  cartItems.push({ productId: productId, quantity: 1 });
  renderCart();
}

// Change la quantité d'un article dans le panier (delta = +1 ou -1)
function changeQuantity(productId, delta) {
  for (let i = 0; i < cartItems.length; i++) {
    if (cartItems[i].productId === productId) {
      cartItems[i].quantity = cartItems[i].quantity + delta;

      // Structure conditionnelle : si la quantité tombe à 0, on retire l'article
      if (cartItems[i].quantity <= 0) {
        cartItems.splice(i, 1);
      }
      break;
    }
  }
  renderCart();
}

// Retire complètement un article du panier
function removeFromCart(productId) {
  cartItems = cartItems.filter(function (item) {
    return item.productId !== productId;
  });
  renderCart();
}

// Change la catégorie active et met à jour le style des boutons
function setCategory(categoryName) {
  currentCategory = categoryName;

  categoryButtons.forEach(function (button) {
    if (button.dataset.category === categoryName) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });

  renderProducts();
}

// Trie les produits par prix (ordre = "asc" pour croissant, "desc" pour décroissant)
function sortProductsByPrice(order) {
  productList.sort(function (a, b) {
    if (order === "asc") {
      return a.price - b.price;
    } else {
      return b.price - a.price;
    }
  });
  renderProducts();
}

// -----------------------------
// 4. GESTION DES ÉVÉNEMENTS
// -----------------------------

// Événement : saisie dans la barre de recherche
searchInput.addEventListener("input", function () {
  currentSearchText = searchInput.value;
  renderProducts();
});

// Événement : clic sur un bouton de catégorie
categoryButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    setCategory(button.dataset.category);
  });
});

// -----------------------------
// 5. INITIALISATION
// -----------------------------
renderProducts();
renderCart();