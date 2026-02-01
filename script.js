document.addEventListener("DOMContentLoaded", () => {

  /* ===================== DATA ===================== */
  const products = [
    { id: 1, title: "Pepperoni Pizza", price: 12, category: "pizza", img: "img/tabs/pizza1.jpg" },
    { id: 2, title: "Cheese Pizza", price: 10, category: "pizza", img: "img/tabs/pizza2.jpg" },
    { id: 3, title: "BBQ Pizza", price: 13, category: "pizza", img: "img/tabs/pizza3.jpg" },
    { id: 4, title: "Veggie Pizza", price: 11, category: "pizza", img: "img/tabs/pizza4.jpg" },
    { id: 5, title: "Chicken Pizza", price: 14, category: "pizza", img: "img/tabs/pizza5.jpg" },

    { id: 6, title: "Classic Burger", price: 9, category: "burgers", img: "img/tabs/burger1.jpg" },
    { id: 7, title: "Cheese Burger", price: 10, category: "burgers", img: "img/tabs/burger2.jpg" },
    { id: 8, title: "Double Burger", price: 12, category: "burgers", img: "img/tabs/burger3.jpg" },
    { id: 9, title: "Chicken Burger", price: 11, category: "burgers", img: "img/tabs/burger4.jpg" },
    { id: 10, title: "Spicy Burger", price: 10, category: "burgers", img: "img/tabs/burger5.jpg" },

    { id: 11, title: "Cola", price: 3, category: "drinks", img: "img/tabs/cola.jpg" },
    { id: 12, title: "Orange Juice", price: 4, category: "drinks", img: "img/tabs/orange.jpg" },
    { id: 13, title: "Water", price: 2, category: "drinks", img: "img/tabs/water.jpg" },
    { id: 14, title: "Energy Drink", price: 5, category: "drinks", img: "img/tabs/energy.jpg" },
    { id: 15, title: "Milkshake", price: 6, category: "drinks", img: "img/tabs/milkshake.jpg" },

    { id: 16, title: "Pizza + Cola", price: 15, category: "combos", img: "img/tabs/pizzacola.jpg" },
    { id: 17, title: "Burger Combo", price: 14, category: "combos", img: "img/tabs/burgercombo.jpg" },
    { id: 18, title: "Family Combo", price: 25, category: "combos", img: "img/tabs/family.jpg" },
    { id: 19, title: "Kids Combo", price: 10, category: "combos", img: "img/tabs/kids.jpg" },
    { id: 20, title: "Mega Combo", price: 30, category: "combos", img: "img/tabs/mega.jpg" }
  ];

  /* ===================== PROMO CODES ===================== */
  const promoCodes = {
    SAVE10: 10,
    FAST20: 20,
    QUICK30: 30
  };

  /* ===================== STATE ===================== */
  let cart = [];
  let discount = 0;

  /* ===================== ELEMENTS ===================== */
  const productsContainer = document.getElementById("products");
  const categoryBtns = document.querySelectorAll(".category-btn");

  const cartBtn = document.getElementById("cartBtn");
  const cartModal = document.getElementById("cartModal");
  const closeCartBtn = document.querySelector(".close-cart");

  const cartItemsEl = document.querySelector(".cart-items");
  const cartTotalEl = document.getElementById("cartTotal");
  const cartPriceBadge = document.querySelector(".cart-count");

  const promoInput = document.getElementById("promoInput");
  const applyPromoBtn = document.getElementById("applyPromo");
  const promoMsg = document.querySelector(".promo-msg");

  const checkoutSection = document.getElementById("checkout");
const checkoutBtn = document.querySelector(".checkout-btn");
const placeOrderBtn = document.getElementById("placeOrder");

const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const addressInput = document.getElementById("address");
const checkoutMsg = document.querySelector(".checkout-msg");

  /* ===================== RENDER PRODUCTS ===================== */
  function renderProducts(category = "all") {
    productsContainer.innerHTML = "";

    const list =
      category === "all"
        ? products
        : products.filter(p => p.category === category);

    list.forEach(p => {
      productsContainer.insertAdjacentHTML(
        "beforeend",
        `
        <div class="product-card">
          <img src="${p.img}" alt="${p.title}">
          <h4>${p.title}</h4>
          <p>$${p.price}</p>
          <button class="add-btn" data-id="${p.id}">Add to cart</button>
        </div>
        `
      );
    });
  }

  /* ===================== CATEGORY ===================== */
  categoryBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      categoryBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderProducts(btn.dataset.category);
    });
  });

  /* ===================== ADD TO CART ===================== */
  productsContainer.addEventListener("click", e => {
    if (!e.target.classList.contains("add-btn")) return;

    const id = Number(e.target.dataset.id);
    const product = products.find(p => p.id === id);
    const found = cart.find(i => i.id === id);

    if (found) found.qty++;
    else cart.push({ ...product, qty: 1 });

    updateCart();
  });

  /* ===================== UPDATE CART ===================== */
  function updateCart() {
    cartItemsEl.innerHTML = "";

    let total = 0;

    cart.forEach(item => {
      total += item.price * item.qty;

      cartItemsEl.insertAdjacentHTML(
        "beforeend",
        `
        <div class="cart-item">
          <span>${item.title}</span>
          <div class="cart-controls">
            <button class="minus" data-id="${item.id}">−</button>
            <span>${item.qty}</span>
            <button class="plus" data-id="${item.id}">+</button>
          </div>
          <strong>$${item.price * item.qty}</strong>
        </div>
        `
      );
    });

    const finalTotal = total - (total * discount) / 100;

    cartTotalEl.textContent = finalTotal.toFixed(2);
    cartPriceBadge.textContent = `$${finalTotal.toFixed(0)}`;
  }

  /* ===================== PLUS / MINUS ===================== */
  cartItemsEl.addEventListener("click", e => {
    const id = Number(e.target.dataset.id);
    const item = cart.find(i => i.id === id);
    if (!item) return;

    if (e.target.classList.contains("plus")) item.qty++;
    if (e.target.classList.contains("minus")) {
      item.qty--;
      if (item.qty === 0) {
        cart = cart.filter(i => i.id !== id);
      }
    }

    updateCart();
  });

  /* ===================== PROMO ===================== */
  applyPromoBtn.addEventListener("click", () => {
    const code = promoInput.value.trim().toUpperCase();

    if (promoCodes[code]) {
      discount = promoCodes[code];
      promoMsg.textContent = `Promo applied: -${discount}%`;
      promoMsg.style.color = "lime";
    } else {
      discount = 0;
      promoMsg.textContent = "Invalid promo code";
      promoMsg.style.color = "red";
    }

    updateCart();
  });

  /* ===================== CART MODAL ===================== */
  cartBtn.addEventListener("click", () => {
    cartModal.classList.add("show");
  });

  closeCartBtn.addEventListener("click", () => {
    cartModal.classList.remove("show");
  });

  cartModal.addEventListener("click", e => {
    if (e.target === cartModal) {
      cartModal.classList.remove("show");
    }
  });

  checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Your cart is empty");
    return;
  }

  checkoutSection.classList.remove("hidden");
});

placeOrderBtn.addEventListener("click", () => {
  const name = nameInput.value.trim();
  const phone = phoneInput.value.trim();
  const address = addressInput.value.trim();

  if (!name || !phone || !address) {
    checkoutMsg.textContent = "Please fill all fields";
    checkoutMsg.style.color = "red";
    return;
  }

  // Fake success
  checkoutMsg.textContent = "Order placed successfully! 🚀";
  checkoutMsg.style.color = "lime";

  // Cartni tozalaymiz
  cart = [];
  discount = 0;

  promoInput.value = "";
  promoMsg.textContent = "";

  updateCart();

  setTimeout(() => {
    checkoutSection.classList.add("hidden");
    cartModal.classList.remove("show");
  }, 1500);
});

  /* ===================== INIT ===================== */
  renderProducts();
  updateCart();

});
