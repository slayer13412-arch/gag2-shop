const products = [
  {
    id: "golden-dragonfly",
    name: "Golden Dragonfly",
    rarity: "mythic",
    role: "Mutator",
    price: 14,
    image: "assets/pets/golden-dragonfly.webp",
    description: "Premium mutation pet for high-value crop builds."
  },
  {
    id: "unicorn",
    name: "Unicorn",
    rarity: "mythic",
    role: "Mutator",
    price: 13,
    image: "assets/pets/unicorn.webp",
    description: "Rainbow-focused mutator for flex farms."
  },
  {
    id: "raccoon",
    name: "Raccoon",
    rarity: "super",
    role: "Thief",
    price: 22,
    image: "assets/pets/raccoon.webp",
    description: "Rare wild thief pet for collectors and late builds."
  },
  {
    id: "black-dragon",
    name: "Black Dragon",
    rarity: "super",
    role: "Defender",
    price: 20,
    image: "assets/pets/black-dragon.webp",
    description: "Top-tier defender pet for protecting your garden."
  },
  {
    id: "ice-serpent",
    name: "Ice Serpent",
    rarity: "super",
    role: "Defender",
    price: 19,
    image: "assets/pets/ice-serpent.webp",
    description: "Super defender with a cold-control garden style."
  },
  {
    id: "bee",
    name: "Bee",
    rarity: "legendary",
    role: "Defender",
    price: 8,
    image: "assets/pets/bee.webp",
    description: "Legendary defender pet for budget protection."
  },
  {
    id: "robin",
    name: "Robin",
    rarity: "legendary",
    role: "Harvester",
    price: 8,
    image: "assets/pets/robin.webp",
    description: "Harvester pick for steady farm grinding."
  },
  {
    id: "bear",
    name: "Bear",
    rarity: "mythic",
    role: "Defender",
    price: 11,
    image: "assets/pets/bear.webp",
    description: "Mythic defender with strong collector appeal."
  },
  {
    id: "monkey",
    name: "Monkey",
    rarity: "mythic",
    role: "Harvester",
    price: 12,
    image: "assets/pets/monkey.webp",
    description: "Wild harvester for hands-off fruit pickup."
  },
  {
    id: "turtle",
    name: "Turtle",
    rarity: "rare",
    role: "Storage",
    price: 5,
    image: "assets/pets/turtle.webp",
    description: "Rare storage pet for growing your setup."
  },
  {
    id: "frog",
    name: "Frog",
    rarity: "common",
    role: "Movement",
    price: 3,
    image: "assets/pets/frog.webp",
    description: "Common movement pet for jump-focused players."
  },
  {
    id: "bunny",
    name: "Bunny",
    rarity: "common",
    role: "Movement",
    price: 3,
    image: "assets/pets/bunny.webp",
    description: "Starter speed pet for new gardens."
  }
];

const bundles = {
  starter: ["bunny", "frog", "deer"],
  mutation: ["golden-dragonfly", "unicorn", "bee"],
  defense: ["black-dragon", "ice-serpent"]
};

const extraProducts = [
  {
    id: "deer",
    name: "Deer",
    rarity: "rare",
    role: "Farming",
    price: 4,
    image: "assets/pets/deer.webp",
    description: "Rare farming pet for early garden growth."
  }
];

const catalog = [...products, ...extraProducts];
const cart = [];
const orderStorageKey = "gag2Orders";
const priceStorageKey = "gag2Prices";
const pendingOrderStorageKey = "gag2PendingOrderId";
const customerSessionStorageKey = "gag2CustomerSession";
const chatStorageKey = "gag2ChatHistory";
const loginStorageKey = "gag2CustomerLogins";
const notifiedOrdersStorageKey = "gag2NotifiedOrders";
const adminPassword = "dunks-gag2";
const payments = {
  cashapp: {
    label: "Cash App",
    value: "$slayerssshop"
  },
  sol: {
    label: "SOL",
    value: "FTf88BqGSu9vM9DqxRmdsvLfEmKEamq4N3A4p2J5XL6D"
  },
  ltc: {
    label: "LTC",
    value: "Ld1s3cYBWR7azLdWdB45Mb6tknDqZDiXY1"
  },
  eth: {
    label: "ETH",
    value: "0x316ab82838dC4ACf3017baa43406391EbAbD9009"
  }
};

const grid = document.querySelector("#productGrid");
const cartPanel = document.querySelector("#cartPanel");
const loginPanel = document.querySelector("#loginPanel");
const overlay = document.querySelector("#overlay");
const cartItems = document.querySelector("#cartItems");
const cartEmpty = document.querySelector("#cartEmpty");
const cartCount = document.querySelector("#cartCount");
const cartTotal = document.querySelector("#cartTotal");
const payMethod = document.querySelector("#payMethod");
const selectedPaymentLabel = document.querySelector("#selectedPaymentLabel");
const selectedPaymentValue = document.querySelector("#selectedPaymentValue");
const confirmMessage = document.querySelector("#confirmMessage");
const ordersPanel = document.querySelector("#ordersPanel");
const ordersList = document.querySelector("#ordersList");
const adminMessage = document.querySelector("#adminMessage");
const priceList = document.querySelector("#priceList");
const priceMessage = document.querySelector("#priceMessage");
const sentBanner = document.querySelector("#sentBanner");
const orderEmail = document.querySelector("#orderEmail");
const customerEmail = document.querySelector("#customerEmail");
const customerRobloxUsername = document.querySelector("#customerRobloxUsername");
const customerLoginMessage = document.querySelector("#customerLoginMessage");
const customerStatus = document.querySelector("#customerStatus");
const loginList = document.querySelector("#loginList");
const chatPanel = document.querySelector("#chatPanel");
const chatLog = document.querySelector("#chatLog");
const chatInput = document.querySelector("#chatInput");
const googleLoginButton = document.querySelector("#googleLogin");
const googleButtonSlot = document.querySelector("#googleButton");
const loginStatusButton = document.querySelector("#loginStatusButton");
const customerLogout = document.querySelector("#customerLogout");

function money(value) {
  return `$${value.toFixed(0)}`;
}

function renderProducts(filter = "all") {
  const visible = filter === "all" ? products : products.filter((product) => product.rarity === filter);
  grid.innerHTML = visible.map((product) => `
    <article class="product-card" data-rarity="${product.rarity}">
      <div class="product-art">
        <img src="${product.image}" alt="${product.name} pet" loading="lazy" />
      </div>
      <div class="product-body">
        <div class="meta-row">
          <span class="rarity ${product.rarity}">${product.rarity}</span>
          <span class="price">${money(product.price)}</span>
        </div>
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="meta-row">
          <span class="tag">${product.role}</span>
          <button class="button small" type="button" data-add="${product.id}">Add</button>
        </div>
      </div>
    </article>
  `).join("");
}

function bundleTotal(bundleId) {
  return bundles[bundleId].reduce((sum, id) => {
    const product = catalog.find((item) => item.id === id);
    return sum + (product ? product.price : 0);
  }, 0);
}

function renderBundlePrices() {
  document.querySelectorAll("[data-bundle]").forEach((button) => {
    button.textContent = `Add ${money(bundleTotal(button.dataset.bundle))} pack`;
  });
}

function readPrices() {
  try {
    return JSON.parse(localStorage.getItem(priceStorageKey)) || {};
  } catch {
    return {};
  }
}

function writePrices(prices) {
  localStorage.setItem(priceStorageKey, JSON.stringify(prices));
}

function applyPrices(prices) {
  catalog.forEach((product) => {
    const price = Number(prices[product.id]);
    if (Number.isFinite(price) && price >= 0) product.price = price;
  });

  cart.forEach((line) => {
    const current = catalog.find((item) => item.id === line.id);
    if (current) line.price = current.price;
  });

  const activeFilter = document.querySelector("[data-filter].active")?.dataset.filter || "all";
  renderProducts(activeFilter);
  renderBundlePrices();
  renderCart();
}

async function fetchServerPrices() {
  try {
    const response = await fetch("/api/prices");
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

async function loadPrices() {
  const serverPrices = await fetchServerPrices();
  applyPrices(serverPrices || readPrices());
}

async function savePrices(prices) {
  try {
    const response = await fetch("/api/prices", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Admin-Password": document.querySelector("#adminPassword").value
      },
      body: JSON.stringify(prices)
    });
    if (response.ok) return "server";
  } catch {
    // Static hosting fallback below.
  }

  writePrices(prices);
  return "browser";
}

function addToCart(id) {
  if (!requireCustomerLogin("Login with email or Roblox username before adding items to cart.")) return;
  const product = catalog.find((item) => item.id === id);
  if (!product) return;
  const line = cart.find((item) => item.id === id);
  if (line) {
    line.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  renderCart();
  openCart();
}

function removeFromCart(id) {
  const index = cart.findIndex((item) => item.id === id);
  if (index >= 0) cart.splice(index, 1);
  renderCart();
}

function renderCart() {
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const total = cart.reduce((sum, item) => sum + item.qty * item.price, 0);
  cartCount.textContent = totalQty;
  cartTotal.textContent = money(total);
  cartEmpty.style.display = cart.length ? "none" : "block";
  cartItems.innerHTML = cart.map((item) => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" />
      <div class="cart-item-main">
        <strong>${item.name}</strong>
        <span>${item.qty} x ${money(item.price)}</span>
      </div>
      <button class="icon-button" type="button" data-remove="${item.id}" aria-label="Remove ${item.name}">x</button>
    </div>
  `).join("");
}

function openCart() {
  if (!requireCustomerLogin("Login before opening your cart.")) return;
  cartPanel.classList.add("open");
  overlay.classList.add("open");
  cartPanel.setAttribute("aria-hidden", "false");
}

function closeCart() {
  cartPanel.classList.remove("open");
  if (!loginPanel.classList.contains("open")) overlay.classList.remove("open");
  cartPanel.setAttribute("aria-hidden", "true");
}

function openLogin() {
  loginPanel.classList.add("open");
  overlay.classList.add("open");
  loginPanel.setAttribute("aria-hidden", "false");
}

function closeLogin() {
  loginPanel.classList.remove("open");
  if (!cartPanel.classList.contains("open")) overlay.classList.remove("open");
  loginPanel.setAttribute("aria-hidden", "true");
}

function selectedPayment() {
  return payments[payMethod.value] || payments.cashapp;
}

function updatePaymentBox() {
  const payment = selectedPayment();
  selectedPaymentLabel.textContent = payment.label;
  selectedPaymentValue.textContent = payment.value;
}

function cartTotalValue() {
  return cart.reduce((sum, item) => sum + item.qty * item.price, 0);
}

function cartItemsText() {
  return cart.map((item) => `${item.qty}x ${item.name}`).join(", ");
}

function orderId() {
  return `GAG2-${Date.now().toString().slice(-6)}`;
}

function orderMessage() {
  const username = document.querySelector("#username").value.trim() || "[Roblox username]";
  const email = orderEmail.value.trim() || "[email]";
  const payment = selectedPayment();
  const total = cartTotalValue();
  const items = cartItemsText() || "No items selected";
  return `Order ${orderId()}\nUsername: ${username}\nEmail: ${email}\nItems: ${items}\nTotal: ${money(total)}\nPayment: ${payment.label}\nSend to: ${payment.value}\nProof sent: yes`;
}

function readOrders() {
  try {
    return JSON.parse(localStorage.getItem(orderStorageKey)) || [];
  } catch {
    return [];
  }
}

function writeOrders(orders) {
  localStorage.setItem(orderStorageKey, JSON.stringify(orders));
}

function updateLocalOrderStatus(id, status) {
  const orders = readOrders();
  const order = orders.find((item) => item.id === id);
  if (!order) return false;
  order.status = status;
  order.acceptedAt = new Date().toISOString();
  writeOrders(orders);
  return true;
}

function showSentBanner() {
  sentBanner.hidden = false;
  sentBanner.textContent = "Your order has beeen sent";
}

function readCustomerSession() {
  try {
    return JSON.parse(localStorage.getItem(customerSessionStorageKey)) || null;
  } catch {
    return null;
  }
}

function writeCustomerSession(session) {
  localStorage.setItem(customerSessionStorageKey, JSON.stringify(session));
  updateLoginState();
}

function customerIsLoggedIn() {
  const session = readCustomerSession();
  return Boolean(session?.email || session?.robloxUsername);
}

function sessionLabel(session = readCustomerSession()) {
  if (!session) return "Login";
  return session.email || session.robloxUsername || "Login";
}

function updateLoginState() {
  const session = readCustomerSession();
  const loggedIn = Boolean(session?.email || session?.robloxUsername);
  loginStatusButton.textContent = loggedIn ? sessionLabel(session) : "Login";
  customerLogout.hidden = !loggedIn;
  if (loggedIn) {
    customerEmail.value = session.email || "";
    customerRobloxUsername.value = session.robloxUsername || "";
    if (session.email) orderEmail.value = session.email;
    if (session.robloxUsername) document.querySelector("#username").value = session.robloxUsername;
  }
}

function logoutCustomer() {
  localStorage.removeItem(customerSessionStorageKey);
  localStorage.removeItem(pendingOrderStorageKey);
  customerEmail.value = "";
  customerRobloxUsername.value = "";
  customerStatus.innerHTML = "";
  customerLoginMessage.textContent = "Logged out.";
  updateLoginState();
}

function requireCustomerLogin(message = "Login before shopping.") {
  if (customerIsLoggedIn()) return true;
  customerLoginMessage.textContent = message;
  openLogin();
  return false;
}

function readChat() {
  try {
    return JSON.parse(localStorage.getItem(chatStorageKey)) || [];
  } catch {
    return [];
  }
}

function writeChat(messages) {
  localStorage.setItem(chatStorageKey, JSON.stringify(messages.slice(-60)));
}

function readLogins() {
  try {
    return JSON.parse(localStorage.getItem(loginStorageKey)) || [];
  } catch {
    return [];
  }
}

function writeLogins(logins) {
  localStorage.setItem(loginStorageKey, JSON.stringify(logins));
}

function readNotifiedOrders() {
  try {
    return JSON.parse(localStorage.getItem(notifiedOrdersStorageKey)) || [];
  } catch {
    return [];
  }
}

function markOrderNotified(id) {
  const ids = new Set(readNotifiedOrders());
  ids.add(id);
  localStorage.setItem(notifiedOrdersStorageKey, JSON.stringify([...ids]));
}

async function fetchServerOrders() {
  try {
    const password = document.querySelector("#adminPassword").value;
    const response = await fetch("/api/orders", {
      headers: { "X-Admin-Password": password }
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

async function fetchOrderStatus(id) {
  try {
    const response = await fetch(`/api/orders/status?id=${encodeURIComponent(id)}`);
    if (!response.ok) return null;
    return await response.json();
  } catch {
    const order = readOrders().find((item) => item.id === id);
    return order ? { id: order.id, status: order.status, sent: order.status === "Order sent" } : null;
  }
}

async function fetchCustomerStatus(session) {
  if (!session?.email && !session?.robloxUsername) return null;
  const params = new URLSearchParams();
  if (session.email) params.set("email", session.email);
  if (session.robloxUsername) params.set("username", session.robloxUsername);

  try {
    const response = await fetch(`/api/customer/status?${params.toString()}`);
    if (!response.ok) return null;
    return await response.json();
  } catch {
    const orders = readOrders().filter((order) => {
      const sameEmail = session.email && String(order.email || "").trim().toLowerCase() === session.email.toLowerCase();
      const sameUser = session.robloxUsername && String(order.username || "").trim().toLowerCase() === session.robloxUsername.toLowerCase();
      return sameEmail || sameUser;
    });
    return { email: session.email, username: session.robloxUsername, orders };
  }
}

async function saveLoginAttempt(session, matchedOrders) {
  const login = {
    id: `LOGIN-${Date.now().toString().slice(-8)}`,
    createdAt: new Date().toISOString(),
    email: session.email || "",
    robloxUsername: session.robloxUsername || "",
    matchedOrders
  };

  try {
    const response = await fetch("/api/logins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(login)
    });
    if (response.ok) return "server";
  } catch {
    // Static hosting fallback below.
  }

  const logins = readLogins();
  logins.unshift(login);
  writeLogins(logins);
  return "browser";
}

async function fetchServerLogins() {
  try {
    const response = await fetch("/api/logins", {
      headers: { "X-Admin-Password": document.querySelector("#adminPassword").value }
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

async function renderLogins() {
  const serverLogins = await fetchServerLogins();
  const logins = serverLogins || readLogins();
  if (!logins.length) {
    loginList.innerHTML = '<div class="order-empty">No customer logins yet.</div>';
    return;
  }

  loginList.innerHTML = logins.map((login) => `
    <article class="login-record">
      <div class="order-top">
        <div>
          <strong>${login.email || login.robloxUsername || "Unknown login"}</strong>
          <span>${new Date(login.createdAt).toLocaleString()}</span>
        </div>
        <span class="order-status">${Number(login.matchedOrders || 0)} match</span>
      </div>
      <p><strong>Email:</strong> ${login.email || "Not entered"}</p>
      <p><strong>Roblox username:</strong> ${login.robloxUsername || "Not entered"}</p>
    </article>
  `).join("");
}

async function checkPendingOrderStatus() {
  const id = localStorage.getItem(pendingOrderStorageKey);
  if (!id) return;

  const status = await fetchOrderStatus(id);
  if (status?.sent) {
    showSentBanner();
    localStorage.removeItem(pendingOrderStorageKey);
  }
}

function renderCustomerStatus(data) {
  if (!data || !data.orders?.length) {
    customerStatus.innerHTML = '<div class="order-empty">No matching orders found yet.</div>';
    return;
  }

  customerStatus.innerHTML = data.orders.map((order) => {
    const status = order.status || "Payment confirmed";
    const items = (order.items || []).map((item) => `${item.qty}x ${item.name}`).join(", ");
    return `
      <article class="customer-order-card">
        <div class="order-top">
          <div>
            <strong>${order.id}</strong>
            <span>${new Date(order.createdAt).toLocaleString()}</span>
          </div>
          <span class="order-status">${status}</span>
        </div>
        <p><strong>Items:</strong> ${items || "Items saved"}</p>
        <p><strong>Total:</strong> ${money(Number(order.total || 0))}</p>
        ${status === "Order sent" ? '<p class="sent-note">Your order has beeen sent</p>' : '<p>Waiting for admin to accept and send your order.</p>'}
      </article>
    `;
  }).join("");

  const notified = new Set(readNotifiedOrders());
  data.orders.forEach((order) => {
    if ((order.status === "Order sent" || order.sent) && !notified.has(order.id)) {
      showSentBanner();
      addChatMessage("bot", `Your order ${order.id} has been confirmed.`);
      markOrderNotified(order.id);
    }
  });
}

async function refreshCustomerStatus() {
  const session = readCustomerSession();
  if (!session) return;

  customerEmail.value = session.email || "";
  customerRobloxUsername.value = session.robloxUsername || "";
  const data = await fetchCustomerStatus(session);
  renderCustomerStatus(data);
}

async function loginCustomer() {
  const email = customerEmail.value.trim();
  const robloxUsername = customerRobloxUsername.value.trim();

  if (!email && !robloxUsername) {
    customerLoginMessage.textContent = "Enter your email or Roblox username.";
    return;
  }

  const session = { email, robloxUsername };
  writeCustomerSession(session);
  if (email) orderEmail.value = email;
  if (robloxUsername) document.querySelector("#username").value = robloxUsername;
  customerLoginMessage.textContent = "Logged in. Checking your order status...";
  const data = await fetchCustomerStatus(session);
  await saveLoginAttempt(session, data?.orders?.length || 0);
  renderCustomerStatus(data);
  customerLoginMessage.textContent = data?.orders?.length ? "Status updated. You can shop now." : "Logged in. You can shop now.";
  if (!ordersPanel.hidden) await renderLogins();
}

async function loginWithGoogleCredential(credential) {
  customerLoginMessage.textContent = "Checking Google login...";

  try {
    const response = await fetch("/api/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credential })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Google login failed");

    customerEmail.value = data.email;
    orderEmail.value = data.email;
    await loginCustomer();
    customerLoginMessage.textContent = `Logged in with Google as ${data.email}.`;
  } catch (error) {
    customerLoginMessage.textContent = error.message || "Google login failed.";
  }
}

function initializeGoogleLogin() {
  const clientId = window.GAG2_CONFIG?.googleClientId;
  if (!clientId) {
    googleButtonSlot.hidden = true;
    googleLoginButton.hidden = false;
    googleLoginButton.textContent = "Set up Google login";
    return;
  }

  if (!window.google?.accounts?.id) {
    setTimeout(initializeGoogleLogin, 300);
    return;
  }

  window.google.accounts.id.initialize({
    client_id: clientId,
    callback: (response) => loginWithGoogleCredential(response.credential),
    auto_select: false
  });

  window.google.accounts.id.renderButton(googleButtonSlot, {
    theme: "outline",
    size: "large",
    width: 360,
    text: "continue_with"
  });

  googleLoginButton.hidden = false;
  googleLoginButton.textContent = "Choose Google account";
}

async function saveOrder(order) {
  try {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order)
    });
    if (response.ok) return "server";
  } catch {
    // Static hosting fallback below.
  }

  const orders = readOrders();
  orders.unshift(order);
  writeOrders(orders);
  return "browser";
}

async function acceptOrder(id) {
  try {
    const response = await fetch(`/api/orders/${encodeURIComponent(id)}/accept`, {
      method: "PATCH",
      headers: { "X-Admin-Password": document.querySelector("#adminPassword").value }
    });
    if (response.ok) return "server";
  } catch {
    // Static hosting fallback below.
  }

  updateLocalOrderStatus(id, "Order sent");
  return "browser";
}

function createOrder() {
  if (!requireCustomerLogin("Login before confirming an order.")) return null;
  const session = readCustomerSession();
  if (session?.email && !orderEmail.value.trim()) orderEmail.value = session.email;
  if (session?.robloxUsername && !document.querySelector("#username").value.trim()) {
    document.querySelector("#username").value = session.robloxUsername;
  }

  const username = document.querySelector("#username").value.trim();
  const email = orderEmail.value.trim();
  if (!cart.length) {
    confirmMessage.textContent = "Add at least one item before confirming payment.";
    return null;
  }
  if (!username) {
    confirmMessage.textContent = "Enter the Roblox username before confirming payment.";
    return null;
  }
  if (!email) {
    confirmMessage.textContent = "Enter an email so the customer can log in and see order status.";
    return null;
  }

  const payment = selectedPayment();
  const order = {
    id: orderId(),
    createdAt: new Date().toISOString(),
    username,
    email,
    paymentMethod: payment.label,
    paymentAddress: payment.value,
    total: cartTotalValue(),
    items: cart.map((item) => ({
      id: item.id,
      name: item.name,
      qty: item.qty,
      price: item.price
    })),
    status: "Payment confirmed"
  };

  return order;
}

function addChatMessage(sender, text) {
  const messages = readChat();
  messages.push({ id: `MSG-${Date.now()}-${Math.random().toString(16).slice(2)}`, sender, text, createdAt: new Date().toISOString() });
  writeChat(messages);
  renderChat();
}

function removeChatMessage(id) {
  writeChat(readChat().filter((message) => message.id !== id));
  renderChat();
}

function renderChat() {
  const messages = readChat();
  if (!messages.length) {
    chatLog.innerHTML = '<div class="chat-message bot">Hi, I am the shop bot. Ask me about payment, delivery, prices, or your order status.</div>';
    return;
  }

  chatLog.innerHTML = messages.map((message) => `
    <div class="chat-message ${message.sender === "you" ? "you" : "bot"}">${message.text}</div>
  `).join("");
  chatLog.scrollTop = chatLog.scrollHeight;
}

function openChat() {
  chatPanel.hidden = false;
  document.querySelector("#chatToggle").textContent = "Close";
  renderChat();
  chatInput.focus();
}

function closeChat() {
  chatPanel.hidden = true;
  document.querySelector("#chatToggle").textContent = "Chat";
}

function toggleChat() {
  if (chatPanel.hidden) {
    openChat();
  } else {
    closeChat();
  }
}

async function botReply(text) {
  const session = readCustomerSession() || {};
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text, session })
    });
    if (response.ok) {
      const data = await response.json();
      if (data.reply) return data.reply;
    }
  } catch {
    // Local fallback below.
  }

  const lower = text.toLowerCase();

  if (lower.includes("status") || lower.includes("order") || lower.includes("accepted") || lower.includes("sent")) {
    if (!session?.email && !session?.robloxUsername) {
      return "Click Login and enter your email or Roblox username first, then I can check your order status here.";
    }

    const data = await fetchCustomerStatus(session);
    if (!data?.orders?.length) return "I could not find an order for that login yet. Double-check the email or Roblox username.";
    const order = data.orders[0];
    if (order.status === "Order sent" || order.sent) return `Your order ${order.id} has beeen sent.`;
    return `Your order ${order.id} is currently: ${order.status || "Payment confirmed"}.`;
  }

  if (lower.includes("cash") || lower.includes("cashapp")) {
    return "Cash App is $slayerssshop. Put your Roblox username or checkout email in the note.";
  }

  if (lower.includes("crypto") || lower.includes("sol") || lower.includes("ltc") || lower.includes("eth")) {
    return "Crypto options are SOL, LTC, and ETH. Pick one in the cart and the site will show the exact wallet address.";
  }

  if (lower.includes("price") || lower.includes("cost")) {
    return "Prices are shown on each pet card. The cart total updates when items are added.";
  }

  if (lower.includes("deliver") || lower.includes("delivery")) {
    return "Delivery is manual after payment confirmation. When the admin accepts your order, your login page will show: Your order has beeen sent.";
  }

  if (lower.includes("login")) {
    return "Click Login next to the cart, then enter your email or Roblox username. Do not enter Roblox passwords or cookies.";
  }

  return "I can help with order status, payment methods, delivery, prices, and login. For status, click Login and enter your email or Roblox username.";
}

async function renderOrders() {
  const serverOrders = await fetchServerOrders();
  const orders = serverOrders || readOrders();
  if (!orders.length) {
    ordersList.innerHTML = '<div class="order-empty">No orders yet.</div>';
    return;
  }

  ordersList.innerHTML = orders.map((order) => {
    const date = new Date(order.createdAt).toLocaleString();
    const items = order.items.map((item) => `${item.qty}x ${item.name}`).join(", ");
    const status = order.status || "Payment confirmed";
    return `
      <article class="order-card">
        <div class="order-top">
          <div>
            <strong>${order.id}</strong>
            <span>${date}</span>
          </div>
          <span class="order-status">${status}</span>
        </div>
        <p><strong>Username:</strong> ${order.username}</p>
        <p><strong>Email:</strong> ${order.email || "Not added"}</p>
        <p><strong>Items:</strong> ${items}</p>
        <p><strong>Total:</strong> ${money(order.total)}</p>
        <p><strong>Payment:</strong> ${order.paymentMethod}</p>
        <p class="wallet-line"><strong>Sent to:</strong> ${order.paymentAddress}</p>
        <div class="order-actions">
          ${
            status === "Order sent"
              ? '<span class="sent-note">Customer message active: Your order has beeen sent</span>'
              : `<button class="button small" type="button" data-accept-order="${order.id}">Accept order</button>`
          }
        </div>
      </article>
    `;
  }).join("");
}

async function unlockOrders() {
  const value = document.querySelector("#adminPassword").value;
  if (value !== adminPassword) {
    adminMessage.textContent = "Wrong password.";
    return;
  }

  adminMessage.textContent = "Orders unlocked.";
  ordersPanel.hidden = false;
  await renderOrders();
  await renderLogins();
  renderPriceEditor();
}

function renderPriceEditor() {
  priceList.innerHTML = catalog.map((product) => `
    <label class="price-row" for="price-${product.id}">
      <span>
        <strong>${product.name}</strong>
        <small>${product.rarity} · ${product.role}</small>
      </span>
      <input id="price-${product.id}" data-price-id="${product.id}" type="number" min="0" step="1" value="${product.price}" />
    </label>
  `).join("");
}

document.addEventListener("click", async (event) => {
  const addButton = event.target.closest("[data-add]");
  const removeButton = event.target.closest("[data-remove]");
  const filterButton = event.target.closest("[data-filter]");
  const bundleButton = event.target.closest("[data-bundle]");
  const copyButton = event.target.closest("[data-copy]");
  const acceptButton = event.target.closest("[data-accept-order]");

  if (addButton) addToCart(addButton.dataset.add);
  if (removeButton) removeFromCart(removeButton.dataset.remove);
  if (event.target.closest("[data-open-cart]")) openCart();
  if (event.target.closest("[data-close-cart]")) closeCart();
  if (event.target.closest("[data-open-login]")) openLogin();
  if (event.target.closest("[data-close-login]")) closeLogin();

  if (filterButton) {
    document.querySelectorAll("[data-filter]").forEach((button) => button.classList.remove("active"));
    filterButton.classList.add("active");
    renderProducts(filterButton.dataset.filter);
  }

  if (bundleButton) {
    if (!requireCustomerLogin("Login with email or Roblox username before adding bundles to cart.")) return;
    bundles[bundleButton.dataset.bundle].forEach(addToCart);
  }

  if (acceptButton) {
    const savedTo = await acceptOrder(acceptButton.dataset.acceptOrder);
    adminMessage.textContent = `Order accepted and saved to ${savedTo}.`;
    await renderOrders();
  }

  if (copyButton) {
    const originalText = copyButton.textContent;
    await navigator.clipboard.writeText(copyButton.dataset.copy);
    copyButton.textContent = "Copied";
    setTimeout(() => {
      copyButton.textContent = originalText;
    }, 1200);
  }
});

payMethod.addEventListener("change", updatePaymentBox);

document.querySelector("#copySelectedPayment").addEventListener("click", async () => {
  const payment = selectedPayment();
  await navigator.clipboard.writeText(payment.value);
  document.querySelector("#copySelectedPayment").textContent = "Copied";
  setTimeout(() => {
    document.querySelector("#copySelectedPayment").textContent = "Copy payment info";
  }, 1200);
});

document.querySelector("#copyOrder").addEventListener("click", async () => {
  await navigator.clipboard.writeText(orderMessage());
  document.querySelector("#copyOrder").textContent = "Order copied";
  setTimeout(() => {
    document.querySelector("#copyOrder").textContent = "Copy order message";
  }, 1400);
});

document.querySelector("#confirmPayment").addEventListener("click", async () => {
  const order = createOrder();
  if (!order) return;

  const payment = selectedPayment();
  const savedTo = await saveOrder(order);
  localStorage.setItem(pendingOrderStorageKey, order.id);
  writeCustomerSession({ email: order.email, robloxUsername: order.username });
  customerEmail.value = order.email;
  customerRobloxUsername.value = order.username;
  await navigator.clipboard.writeText(
    `Order ${order.id}\nUsername: ${order.username}\nEmail: ${order.email}\nItems: ${cartItemsText()}\nTotal: ${money(order.total)}\nPayment: ${payment.label}\nSent to: ${payment.value}\nPayment confirmed.`
  );
  confirmMessage.textContent = `Order ${order.id} created and saved to ${savedTo}. Order details copied.`;
  cart.length = 0;
  renderCart();
  if (!ordersPanel.hidden) await renderOrders();
  checkPendingOrderStatus();
  refreshCustomerStatus();
});

document.querySelector("#unlockOrders").addEventListener("click", unlockOrders);

document.querySelector("#adminPassword").addEventListener("keydown", (event) => {
  if (event.key === "Enter") unlockOrders();
});

document.querySelector("#exportOrders").addEventListener("click", async () => {
  const orders = await fetchServerOrders() || readOrders();
  await navigator.clipboard.writeText(JSON.stringify(orders, null, 2));
  adminMessage.textContent = "Orders copied as JSON.";
});

document.querySelector("#clearOrders").addEventListener("click", async () => {
  if (!confirm("Clear all saved orders on this browser?")) return;
  try {
    await fetch("/api/orders", {
      method: "DELETE",
      headers: { "X-Admin-Password": document.querySelector("#adminPassword").value }
    });
  } catch {
    // Static hosting fallback below.
  }
  writeOrders([]);
  await renderOrders();
});

document.querySelector("#savePrices").addEventListener("click", async () => {
  const prices = {};
  document.querySelectorAll("[data-price-id]").forEach((input) => {
    const value = Number(input.value);
    if (Number.isFinite(value) && value >= 0) prices[input.dataset.priceId] = value;
  });

  const savedTo = await savePrices(prices);
  applyPrices(prices);
  renderPriceEditor();
  priceMessage.textContent = `Prices saved to ${savedTo}.`;
});

document.querySelector("#customerLogin").addEventListener("click", loginCustomer);

customerRobloxUsername.addEventListener("keydown", (event) => {
  if (event.key === "Enter") loginCustomer();
});

customerEmail.addEventListener("keydown", (event) => {
  if (event.key === "Enter") loginCustomer();
});

document.querySelector("#googleLogin").addEventListener("click", () => {
  const clientId = window.GAG2_CONFIG?.googleClientId;
  if (!clientId) {
    customerLoginMessage.textContent = "Add your Google OAuth Web Client ID in config.js first, then this button will open Google account login.";
    return;
  }

  if (window.google?.accounts?.id) {
    window.google.accounts.id.prompt();
    customerLoginMessage.textContent = "Choose your Google account in the Google popup.";
  } else {
    customerLoginMessage.textContent = "Google login is still loading. Try again in a second.";
  }
});

customerLogout.addEventListener("click", logoutCustomer);

document.querySelector("#refreshLogins").addEventListener("click", renderLogins);

document.querySelector("#clearLogins").addEventListener("click", async () => {
  if (!confirm("Clear all saved customer logins?")) return;
  try {
    await fetch("/api/logins", {
      method: "DELETE",
      headers: { "X-Admin-Password": document.querySelector("#adminPassword").value }
    });
  } catch {
    // Static hosting fallback below.
  }
  writeLogins([]);
  await renderLogins();
});

document.querySelector("#chatToggle").addEventListener("click", toggleChat);

document.querySelector("#chatClose").addEventListener("click", closeChat);

document.querySelector("#chatForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const text = chatInput.value.trim();
  if (!text) return;

  chatInput.value = "";
  addChatMessage("you", text);
  const typingId = `TYPING-${Date.now()}`;
  const messages = readChat();
  messages.push({ id: typingId, sender: "bot", text: "Typing...", createdAt: new Date().toISOString() });
  writeChat(messages);
  renderChat();
  const reply = await botReply(text);
  removeChatMessage(typingId);
  addChatMessage("bot", reply);
});

renderProducts();
renderBundlePrices();
renderCart();
updatePaymentBox();
updateLoginState();
loadPrices();
renderChat();
initializeGoogleLogin();
refreshCustomerStatus();
checkPendingOrderStatus();
setInterval(checkPendingOrderStatus, 10000);
setInterval(refreshCustomerStatus, 12000);
