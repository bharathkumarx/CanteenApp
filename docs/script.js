const loggedUSN = localStorage.getItem("usn");
if (!loggedUSN) {
  window.location.href = "login.html";
}

const shops = {
  1: "Shop 1 - Main Canteen",
  2: "Shop 2 - Bakery",
  3: "Shop 3 - Meals Corner"
};

const menuItems = [
  { id: 1, shopId: 1, name: "Masala Dosa", price: 40, category: "snacks", prep: "10 min" },
  { id: 2, shopId: 1, name: "Idli Vada", price: 35, category: "snacks", prep: "8 min" },
  { id: 3, shopId: 1, name: "Tea", price: 10, category: "drinks", prep: "3 min" },

  { id: 4, shopId: 2, name: "Cold Coffee", price: 45, category: "drinks", prep: "5 min" },
  { id: 5, shopId: 2, name: "Veg Sandwich", price: 35, category: "snacks", prep: "7 min" },
  { id: 6, shopId: 2, name: "Pastry", price: 30, category: "snacks", prep: "5 min" },

  { id: 7, shopId: 3, name: "Meals", price: 70, category: "meals", prep: "15 min" },
  { id: 8, shopId: 3, name: "Lemon Rice", price: 40, category: "meals", prep: "10 min" },
  { id: 9, shopId: 3, name: "Curd Rice", price: 35, category: "meals", prep: "10 min" }
];


let currentShop = null;
let currentCategory = "all";
let cart = {};


const shopButtons = document.querySelectorAll(".shop-button");
const menuSection = document.getElementById("menu-section");
const menuTitle = document.getElementById("menu-title");
const menuList = document.getElementById("menu-list");
const changeShopButton = document.getElementById("change-shop");

const filterButtons = document.querySelectorAll(".filter-button");

const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartShop = document.getElementById("cart-shop");

const usnInput = document.getElementById("usn");
const placeOrderButton = document.getElementById("place-order");
const messageBox = document.getElementById("message");


shopButtons.forEach(button => {
  button.addEventListener("click", () => {
    const selectedShop = parseInt(button.dataset.shop, 10);

    if (currentShop && currentShop !== selectedShop && Object.keys(cart).length > 0) {
      const ok = confirm("Cart has items from another shop. Clear cart and switch?");
      if (!ok) return;

      cart = {};
      renderCart();
    }

    currentShop = selectedShop;
    menuSection.style.display = "block";
    menuTitle.textContent = shops[currentShop];
    cartShop.textContent = "Ordering from: " + shops[currentShop];

    renderMenu();
  });
});



changeShopButton.addEventListener("click", () => {
  if (Object.keys(cart).length > 0) {
    const ok = confirm("Changing shop will clear the cart. Continue?");
    if (!ok) return;
  }

  currentShop = null;
  cart = {};
  menuSection.style.display = "none";
  cartShop.textContent = "";
  renderCart();
});



filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    button.classList.add("active");

    currentCategory = button.dataset.category;
    renderMenu();
  });
});



function renderMenu() {
  if (!currentShop) {
    menuList.innerHTML = "";
    return;
  }

  let items = menuItems.filter(item => item.shopId === currentShop);

  if (currentCategory !== "all") {
    items = items.filter(item => item.category === currentCategory);
  }

  if (items.length === 0) {
    menuList.innerHTML = "<p>No items available.</p>";
    return;
  }

  menuList.innerHTML = "";

  items.forEach(item => {
    const card = document.createElement("div");
    card.className = "menu-card";

    card.innerHTML = `
      <div class="menu-name">${item.name}</div>
      <div class="menu-price">₹${item.price}</div>
      <div class="menu-footer">
        <div class="menu-meta">Prep time: ${item.prep}</div>
        <button class="primary-button">Add</button>
      </div>
    `;

    card.querySelector("button").addEventListener("click", () => {
      addToCart(item.id);
    });

    menuList.appendChild(card);
  });
}



function addToCart(itemId) {
  if (!cart[itemId]) {
    cart[itemId] = 0;
  }
  cart[itemId]++;
  renderCart();
}

function updateCartQuantity(itemId, change) {
  if (!cart[itemId]) return;

  cart[itemId] += change;

  if (cart[itemId] <= 0) {
    delete cart[itemId];
  }

  renderCart();
}

function renderCart() {
  cartItems.innerHTML = "";
  let total = 0;

  for (let id in cart) {
    const item = menuItems.find(i => i.id == id);
    const qty = cart[id];
    total += item.price * qty;

    const div = document.createElement("div");
    div.className = "cart-item";

    div.innerHTML = `
      <span>${item.name} (₹${item.price})</span>
      <div class="cart-qty">
        <button onclick="updateCartQuantity(${id}, -1)">−</button>
        <span>${qty}</span>
        <button onclick="updateCartQuantity(${id}, 1)">+</button>
      </div>
    `;

    cartItems.appendChild(div);
  }

  cartTotal.textContent = "Total: ₹" + total;
  cartTotal.dataset.total = total;
}



// placeOrderButton.addEventListener("click", async () => {
//   const usn = usnInput.value.trim();

//   if (!currentShop || Object.keys(cart).length === 0) {
//     alert("Cart is empty");
//     return;
//   }

//   if (!usn) {
//     alert("Please enter USN");
//     return;
//   }

//   try {
//     const response = await fetch("http://localhost:3000/api/order", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         shopId: currentShop,
//         cart,
//         total: cartTotal.dataset.total,
//         usn
//       })
//     });

//     const data = await response.json();
//     messageBox.textContent = data.message;

//     cart = {};
//     renderCart();
//     usnInput.value = "";
//   } catch (err) {
//     alert("Server not running");
//   }
// });

placeOrderButton.addEventListener("click", () => {
  localStorage.setItem("cart", JSON.stringify(cart));
  localStorage.setItem("total", cartTotal.dataset.total);
  window.location.href = "checkout.html";
});

