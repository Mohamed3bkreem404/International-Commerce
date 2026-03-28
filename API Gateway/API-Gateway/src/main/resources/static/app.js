const storageKey = "northstar-token";

const state = {
  token: localStorage.getItem(storageKey) || "",
  profile: null,
  products: [],
  cart: null,
  orders: [],
  payments: [],
  filters: {
    productQuery: "",
    inStockOnly: false,
  },
};

const els = {
  sessionUser: document.getElementById("session-user"),
  sessionRole: document.getElementById("session-role"),
  logoutBtn: document.getElementById("logout-btn"),
  signupForm: document.getElementById("signup-form"),
  loginForm: document.getElementById("login-form"),
  productsGrid: document.getElementById("products-grid"),
  cartView: document.getElementById("cart-view"),
  ordersView: document.getElementById("orders-view"),
  paymentsView: document.getElementById("payments-view"),
  activityLog: document.getElementById("activity-log"),
  checkoutForm: document.getElementById("checkout-form"),
  refreshProducts: document.getElementById("refresh-products"),
  refreshCart: document.getElementById("refresh-cart"),
  clearCart: document.getElementById("clear-cart"),
  refreshOrders: document.getElementById("refresh-orders"),
  refreshPayments: document.getElementById("refresh-payments"),
  refreshAll: document.getElementById("refresh-all"),
  metricProducts: document.getElementById("metric-products"),
  metricCartTotal: document.getElementById("metric-cart-total"),
  metricOrders: document.getElementById("metric-orders"),
  metricPaidTotal: document.getElementById("metric-paid-total"),
  productCount: document.getElementById("product-count"),
  ordersCount: document.getElementById("orders-count"),
  paymentsCount: document.getElementById("payments-count"),
  checkoutTotal: document.getElementById("checkout-total"),
  productSearch: document.getElementById("product-search"),
  productStockToggle: document.getElementById("product-stock-toggle"),
};

function decodeJwt(token) {
  try {
    const payload = token.split(".")[1];
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(normalized));
  } catch (error) {
    return null;
  }
}

function setToken(token) {
  state.token = token || "";
  state.profile = token ? decodeJwt(token) : null;

  if (state.token) {
    localStorage.setItem(storageKey, state.token);
  } else {
    localStorage.removeItem(storageKey);
  }

  renderSession();
}

function renderSession() {
  if (state.profile) {
    els.sessionUser.textContent = state.profile.username || state.profile.sub || "User";
    els.sessionRole.textContent = state.profile.role || "Authenticated";
  } else {
    els.sessionUser.textContent = "Guest";
    els.sessionRole.textContent = "No token";
  }
}

function pushLog(message, type = "info") {
  const entry = document.createElement("div");
  entry.className = `log-entry ${type}`;
  entry.textContent = `${new Date().toLocaleTimeString()} • ${message}`;
  els.activityLog.prepend(entry);
}

async function api(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (state.token) {
    headers.Authorization = `Bearer ${state.token}`;
  }

  const response = await fetch(path, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json") ? await response.json() : null;

  if (!response.ok) {
    const message = payload?.errors?.map((error) => error.message).join(" | ")
      || payload?.message
      || `Request failed with ${response.status}`;
    throw new Error(message);
  }

  return payload;
}

function currency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value || 0));
}

function guardAuth() {
  if (!state.token) {
    pushLog("Login first to use the store.", "error");
    throw new Error("Missing token");
  }
}

function badgeClass(value) {
  if (["PAID", "SUCCESS", "COMPLETED"].includes(value)) {
    return "pill success";
  }
  if (["CANCELLED", "FAILED", "REFUNDED"].includes(value)) {
    return "pill danger";
  }
  return "pill warn";
}

function stockBadge(product) {
  return product.stockQuantity > 0
    ? `<span class="stock-badge in-stock">${product.stockQuantity} in stock</span>`
    : `<span class="stock-badge out-stock">Out of stock</span>`;
}

function updateOverview() {
  const cartTotal = state.cart?.totalPrice || 0;
  const paidTotal = state.payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);

  els.metricProducts.textContent = state.products.length;
  els.metricCartTotal.textContent = currency(cartTotal);
  els.metricOrders.textContent = state.orders.length;
  els.metricPaidTotal.textContent = currency(paidTotal);

  els.productCount.textContent = `${getFilteredProducts().length} items`;
  els.ordersCount.textContent = `${state.orders.length} orders`;
  els.paymentsCount.textContent = `${state.payments.length} payments`;
  els.checkoutTotal.textContent = currency(cartTotal);
}

function getFilteredProducts() {
  return state.products.filter((product) => {
    const query = state.filters.productQuery.trim().toLowerCase();
    const matchesQuery = !query || product.name.toLowerCase().includes(query);
    const matchesStock = !state.filters.inStockOnly || Number(product.stockQuantity) > 0;
    return matchesQuery && matchesStock;
  });
}

function renderProducts() {
  if (!state.token) {
    els.productsGrid.innerHTML = `<div class="empty-state">Login to load products.</div>`;
    updateOverview();
    return;
  }

  const products = getFilteredProducts();
  updateOverview();

  if (!products.length) {
    els.productsGrid.innerHTML = `<div class="empty-state">No products match the current filter.</div>`;
    return;
  }

  els.productsGrid.innerHTML = products.map((product) => `
    <article class="product-card">
      <div class="product-card-top">
        <div>
          <h3>${product.name}</h3>
          ${stockBadge(product)}
        </div>
        <div class="price-tag">${currency(product.price)}</div>
      </div>
      <p class="meta-text">${product.description}</p>
      <button type="button" data-add-cart="${product.id}" ${product.stockQuantity <= 0 ? "disabled" : ""}>Add to Cart</button>
    </article>
  `).join("");
}

function renderCart() {
  if (!state.token) {
    els.cartView.innerHTML = `<div class="empty-state">Login to see your cart.</div>`;
    updateOverview();
    return;
  }

  const cart = state.cart;
  updateOverview();

  if (!cart?.items?.length) {
    els.cartView.innerHTML = `<div class="empty-state">Your cart is empty. Add a few products from the catalog first.</div>`;
    return;
  }

  els.cartView.innerHTML = `
    <article class="cart-summary-card">
      <div>
        <div class="eyebrow">Live Cart Total</div>
        <strong>${currency(cart.totalPrice)}</strong>
      </div>
      <div class="meta-text">${cart.items.length} item(s) ready for checkout</div>
    </article>
    ${cart.items.map((item) => `
      <article class="cart-card">
        <div class="cart-row">
          <div>
            <strong>${item.productName}</strong>
            <div class="meta-text">${currency(item.price)} each</div>
            <div class="meta-text">Subtotal: ${currency(item.subtotal)}</div>
          </div>
          <form class="inline-form" data-update-cart="${item.productId}">
            <input type="number" name="quantity" min="1" value="${item.quantity}">
            <button type="submit">Update</button>
            <button type="button" class="ghost-button danger" data-remove-cart="${item.productId}">Remove</button>
          </form>
        </div>
      </article>
    `).join("")}
  `;
}

function renderOrders() {
  if (!state.token) {
    els.ordersView.innerHTML = `<div class="empty-state">Orders will appear here after login.</div>`;
    updateOverview();
    return;
  }

  updateOverview();

  if (!state.orders.length) {
    els.ordersView.innerHTML = `<div class="empty-state">No orders yet. Your next checkout will appear here.</div>`;
    return;
  }

  els.ordersView.innerHTML = state.orders.map((order) => `
    <article class="order-card">
      <div class="order-row">
        <div>
          <h3>Order ${order.orderId.slice(0, 8)}</h3>
          <div class="meta-text">${order.shippingAddress || "No shipping address"}</div>
          <div class="meta-text">${currency(order.totalAmount)} • ${order.items.length} item(s)</div>
        </div>
        <div class="button-row">
          <span class="${badgeClass(order.status)}">${order.status}</span>
          <span class="${badgeClass(order.paymentStatus)}">${order.paymentStatus}</span>
        </div>
      </div>
      <div class="meta-text">${order.notes || "No notes"}</div>
      <div class="meta-text">Created: ${new Date(order.createdAt).toLocaleString()}</div>
      <div class="order-items">
        ${order.items.map((item) => `
          <div class="meta-text">${item.productName} x ${item.quantity} = ${currency(item.subtotal)}</div>
        `).join("")}
      </div>
      <div class="button-row" style="margin-top: 14px;">
        ${order.status !== "CANCELLED" && order.paymentStatus !== "PAID" ? `
          <button type="button" class="ghost-button danger" data-cancel-order="${order.orderId}">Cancel Order</button>
        ` : ""}
        ${order.paymentStatus !== "PAID" && order.status !== "CANCELLED" ? `
          <form class="inline-form" data-pay-order="${order.orderId}">
            <select name="paymentMethod">
              <option value="CARD">Card</option>
              <option value="WALLET">Wallet</option>
              <option value="CASH_ON_DELIVERY">Cash on Delivery</option>
            </select>
            <input type="text" name="notes" placeholder="payment note">
            <button type="submit">Pay Now</button>
          </form>
        ` : ""}
      </div>
    </article>
  `).join("");
}

function renderPayments() {
  if (!state.token) {
    els.paymentsView.innerHTML = `<div class="empty-state">Payments will appear here after login.</div>`;
    updateOverview();
    return;
  }

  updateOverview();

  if (!state.payments.length) {
    els.paymentsView.innerHTML = `<div class="empty-state">No payments yet. Pay any created order to see records here.</div>`;
    return;
  }

  els.paymentsView.innerHTML = state.payments.map((payment) => `
    <article class="payment-card">
      <div class="payment-row">
        <div>
          <h3>${payment.transactionReference}</h3>
          <div class="meta-text">Order ${payment.orderId.slice(0, 8)}</div>
          <div class="meta-text">${payment.paymentMethod}</div>
        </div>
        <div class="button-row">
          <span class="${badgeClass(payment.paymentStatus)}">${payment.paymentStatus}</span>
          <strong>${currency(payment.amount)}</strong>
        </div>
      </div>
      <div class="meta-text">${payment.notes || "No notes"}</div>
      <div class="meta-text">Paid: ${new Date(payment.paidAt).toLocaleString()}</div>
    </article>
  `).join("");
}

async function signup(event) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const body = {
    userName: formData.get("userName"),
    password: formData.get("password"),
  };

  try {
    await api("/api/v1/auth/signUp", { method: "POST", body });
    pushLog(`Account created for ${body.userName}.`, "success");
    event.currentTarget.reset();
  } catch (error) {
    pushLog(error.message, "error");
  }
}

async function login(event) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const body = {
    username: formData.get("username"),
    password: formData.get("password"),
  };

  try {
    const payload = await api("/api/v1/auth/login", { method: "POST", body });
    setToken(payload.data);
    pushLog(`Logged in as ${body.username}.`, "success");
    event.currentTarget.reset();
    await refreshAll();
  } catch (error) {
    pushLog(error.message, "error");
  }
}

async function loadProducts() {
  if (!state.token) {
    state.products = [];
    renderProducts();
    return;
  }

  try {
    const payload = await api("/api/v1/products");
    state.products = payload.data || [];
    renderProducts();
  } catch (error) {
    state.products = [];
    renderProducts();
    pushLog(error.message, "error");
  }
}

async function addToCart(productId) {
  try {
    guardAuth();
    await api("/api/v1/cart/items", {
      method: "POST",
      body: { productId, quantity: 1 },
    });
    pushLog("Item added to cart.", "success");
    await Promise.all([loadCart(), loadOrders()]);
  } catch (error) {
    if (error.message !== "Missing token") {
      pushLog(error.message, "error");
    }
  }
}

async function loadCart() {
  if (!state.token) {
    state.cart = null;
    renderCart();
    return;
  }

  try {
    const payload = await api("/api/v1/cart");
    state.cart = payload.data;
    renderCart();
  } catch (error) {
    state.cart = null;
    renderCart();
    pushLog(error.message, "error");
  }
}

async function updateCart(productId, quantity) {
  try {
    await api(`/api/v1/cart/items/${productId}`, {
      method: "PUT",
      body: { quantity: Number(quantity) },
    });
    pushLog("Cart item updated.", "success");
    await loadCart();
  } catch (error) {
    pushLog(error.message, "error");
  }
}

async function removeCart(productId) {
  try {
    await api(`/api/v1/cart/items/${productId}`, { method: "DELETE" });
    pushLog("Cart item removed.", "success");
    await loadCart();
  } catch (error) {
    pushLog(error.message, "error");
  }
}

async function clearCart() {
  try {
    guardAuth();
    await api("/api/v1/cart", { method: "DELETE" });
    pushLog("Cart cleared.", "success");
    await loadCart();
  } catch (error) {
    if (error.message !== "Missing token") {
      pushLog(error.message, "error");
    }
  }
}

async function checkout(event) {
  event.preventDefault();
  try {
    guardAuth();
    const formData = new FormData(event.currentTarget);
    const body = {
      shippingAddress: formData.get("shippingAddress"),
      notes: formData.get("notes"),
    };
    await api("/api/v1/orders/checkout", {
      method: "POST",
      body,
    });
    pushLog("Order created from cart.", "success");
    event.currentTarget.reset();
    await refreshCommerce();
  } catch (error) {
    if (error.message !== "Missing token") {
      pushLog(error.message, "error");
    }
  }
}

async function loadOrders() {
  if (!state.token) {
    state.orders = [];
    renderOrders();
    return;
  }

  try {
    const payload = await api("/api/v1/orders");
    state.orders = payload.data || [];
    renderOrders();
  } catch (error) {
    state.orders = [];
    renderOrders();
    pushLog(error.message, "error");
  }
}

async function cancelOrder(orderId) {
  try {
    await api(`/api/v1/orders/${orderId}/cancel`, { method: "PUT" });
    pushLog("Order cancelled.", "success");
    await Promise.all([loadOrders(), loadPayments()]);
  } catch (error) {
    pushLog(error.message, "error");
  }
}

async function payOrder(orderId, paymentMethod, notes) {
  try {
    await api("/api/v1/payments", {
      method: "POST",
      body: { orderId, paymentMethod, notes },
    });
    pushLog("Payment completed.", "success");
    await Promise.all([loadOrders(), loadPayments()]);
  } catch (error) {
    pushLog(error.message, "error");
  }
}

async function loadPayments() {
  if (!state.token) {
    state.payments = [];
    renderPayments();
    return;
  }

  try {
    const payload = await api("/api/v1/payments");
    state.payments = payload.data || [];
    renderPayments();
  } catch (error) {
    state.payments = [];
    renderPayments();
    pushLog(error.message, "error");
  }
}

async function refreshCommerce() {
  await Promise.all([loadProducts(), loadCart(), loadOrders(), loadPayments()]);
}

async function refreshAll() {
  renderSession();
  await refreshCommerce();
}

document.addEventListener("click", async (event) => {
  const addButton = event.target.closest("[data-add-cart]");
  if (addButton) {
    await addToCart(addButton.dataset.addCart);
    return;
  }

  const removeButton = event.target.closest("[data-remove-cart]");
  if (removeButton) {
    await removeCart(removeButton.dataset.removeCart);
    return;
  }

  const cancelButton = event.target.closest("[data-cancel-order]");
  if (cancelButton) {
    await cancelOrder(cancelButton.dataset.cancelOrder);
  }
});

document.addEventListener("submit", async (event) => {
  const updateForm = event.target.closest("[data-update-cart]");
  if (updateForm) {
    event.preventDefault();
    const productId = updateForm.dataset.updateCart;
    const quantity = new FormData(updateForm).get("quantity");
    await updateCart(productId, quantity);
    return;
  }

  const payForm = event.target.closest("[data-pay-order]");
  if (payForm) {
    event.preventDefault();
    const orderId = payForm.dataset.payOrder;
    const formData = new FormData(payForm);
    await payOrder(orderId, formData.get("paymentMethod"), formData.get("notes"));
  }
});

els.signupForm.addEventListener("submit", signup);
els.loginForm.addEventListener("submit", login);
els.checkoutForm.addEventListener("submit", checkout);
els.refreshProducts.addEventListener("click", loadProducts);
els.refreshCart.addEventListener("click", loadCart);
els.refreshOrders.addEventListener("click", loadOrders);
els.refreshPayments.addEventListener("click", loadPayments);
els.refreshAll.addEventListener("click", refreshAll);
els.clearCart.addEventListener("click", clearCart);
els.logoutBtn.addEventListener("click", async () => {
  setToken("");
  state.products = [];
  state.cart = null;
  state.orders = [];
  state.payments = [];
  renderProducts();
  renderCart();
  renderOrders();
  renderPayments();
  pushLog("Logged out.", "success");
});

els.productSearch.addEventListener("input", (event) => {
  state.filters.productQuery = event.target.value || "";
  renderProducts();
});

els.productStockToggle.addEventListener("change", (event) => {
  state.filters.inStockOnly = event.target.checked;
  renderProducts();
});

setToken(state.token);
refreshAll();
