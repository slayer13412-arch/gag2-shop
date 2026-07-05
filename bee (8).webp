const http = require("http");
const fs = require("fs");
const path = require("path");

const port = Number(process.env.PORT || process.argv[2] || 8080);
const root = __dirname;
const ordersFile = path.join(root, "orders.json");
const pricesFile = path.join(root, "prices.json");
const loginsFile = path.join(root, "logins.json");
const configFile = path.join(root, "config.js");
const adminPassword = "dunks-gag2";
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg"
};

function readOrders() {
  try {
    return JSON.parse(fs.readFileSync(ordersFile, "utf8"));
  } catch {
    return [];
  }
}

function writeOrders(orders) {
  fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
}

function readPrices() {
  try {
    return JSON.parse(fs.readFileSync(pricesFile, "utf8"));
  } catch {
    return {};
  }
}

function writePrices(prices) {
  fs.writeFileSync(pricesFile, JSON.stringify(prices, null, 2));
}

function readLogins() {
  try {
    return JSON.parse(fs.readFileSync(loginsFile, "utf8"));
  } catch {
    return [];
  }
}

function writeLogins(logins) {
  fs.writeFileSync(loginsFile, JSON.stringify(logins, null, 2));
}

function sendJson(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(data));
}

function collectBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        req.destroy();
        reject(new Error("Body too large"));
      }
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

function isAdmin(req) {
  return req.headers["x-admin-password"] === adminPassword;
}

function googleClientId() {
  if (process.env.GOOGLE_CLIENT_ID) return process.env.GOOGLE_CLIENT_ID;

  try {
    const config = fs.readFileSync(configFile, "utf8");
    const match = config.match(/googleClientId:\s*["']([^"']+)["']/);
    return match ? match[1] : "";
  } catch {
    return "";
  }
}

async function verifyGoogleCredential(credential) {
  const clientId = googleClientId();
  if (!clientId) {
    throw new Error("Google Client ID is not configured");
  }

  const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`);
  if (!response.ok) {
    throw new Error("Invalid Google credential");
  }

  const profile = await response.json();
  if (profile.aud !== clientId) {
    throw new Error("Google credential audience mismatch");
  }

  return {
    email: profile.email || "",
    name: profile.name || "",
    picture: profile.picture || "",
    emailVerified: profile.email_verified === "true" || profile.email_verified === true
  };
}

function findCustomerOrders(session = {}) {
  const email = String(session.email || "").trim().toLowerCase();
  const username = String(session.robloxUsername || session.username || "").trim().toLowerCase();
  return readOrders().filter((order) => {
    const sameEmail = email && String(order.email || "").trim().toLowerCase() === email;
    const sameUser = username && String(order.username || "").trim().toLowerCase() === username;
    return sameEmail || sameUser;
  });
}

function paymentSummary() {
  return [
    "Cash App: $slayerssshop",
    "SOL: FTf88BqGSu9vM9DqxRmdsvLfEmKEamq4N3A4p2J5XL6D",
    "LTC: Ld1s3cYBWR7azLdWdB45Mb6tknDqZDiXY1",
    "ETH: 0x316ab82838dC4ACf3017baa43406391EbAbD9009"
  ].join("\n");
}

function chatAnswer(message, session) {
  const text = String(message || "").trim();
  const lower = text.toLowerCase();
  const orders = findCustomerOrders(session);
  const latestOrder = orders[0];

  if (!text) return "Send me a question and I will help with orders, payment, delivery, or logging in.";

  if (/\b(hi|hello|hey|yo|sup)\b/.test(lower)) {
    return "Hey. I can help with payment addresses, order status, delivery, prices, and how to use the shop.";
  }

  if (lower.includes("status") || lower.includes("order") || lower.includes("accepted") || lower.includes("confirmed") || lower.includes("sent")) {
    if (!session?.email && !session?.robloxUsername && !session?.username) {
      return "Log in first with your email or Roblox username, then ask me for your order status.";
    }
    if (!orders.length) {
      return "I do not see an order under that login yet. Make sure you used the same email or Roblox username from checkout.";
    }
    if (latestOrder.status === "Order sent") {
      return `Your order ${latestOrder.id} has been confirmed and sent.`;
    }
    const items = (latestOrder.items || []).map((item) => `${item.qty}x ${item.name}`).join(", ");
    return `I found order ${latestOrder.id}. Status: ${latestOrder.status || "Payment confirmed"}. Items: ${items || "saved items"}. I will update here when admin accepts it.`;
  }

  if (lower.includes("cash") || lower.includes("cashapp")) {
    return "Use Cash App tag $slayerssshop. Put your Roblox username or checkout email in the payment note.";
  }

  if (lower.includes("crypto") || lower.includes("wallet") || lower.includes("sol") || lower.includes("ltc") || lower.includes("eth")) {
    return `Here are the payment options:\n${paymentSummary()}`;
  }

  if (lower.includes("login") || lower.includes("sign in") || lower.includes("account")) {
    return "Click Login next to Cart, then enter your email or Roblox username. Do not enter Roblox passwords or cookies.";
  }

  if (lower.includes("password") || lower.includes("cookie")) {
    return "Do not send Roblox passwords or cookies. This shop only uses email or Roblox username to check order status.";
  }

  if (lower.includes("deliver") || lower.includes("delivery") || lower.includes("receive")) {
    return "Delivery is manual after payment. When admin accepts your order, your chat will say your order has been confirmed.";
  }

  if (lower.includes("price") || lower.includes("cost") || lower.includes("how much")) {
    return "Prices are on each pet card, and the cart total updates automatically. Admin can update prices from the password-protected admin panel.";
  }

  if (lower.includes("refund") || lower.includes("cancel")) {
    return "For refunds or cancellations, send your order details to the shop owner. If your payment has not been accepted yet, include your email or Roblox username.";
  }

  if (orders.length) {
    return `I can help. I also see ${orders.length} order${orders.length === 1 ? "" : "s"} under your login. Ask “status” if you want the latest update.`;
  }

  return "I can help with payments, order status, delivery, prices, and login. Ask me something like “what is my order status?” or “what crypto do you accept?”";
}

async function handleOrders(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || "127.0.0.1"}`);

  if (url.pathname === "/api/customer/status" && req.method === "GET") {
    const email = (url.searchParams.get("email") || "").trim().toLowerCase();
    const username = (url.searchParams.get("username") || "").trim().toLowerCase();
    if (!email && !username) return sendJson(res, 400, { error: "Email or Roblox username required" });

    const orders = readOrders().filter((order) => {
      const sameEmail = email && String(order.email || "").trim().toLowerCase() === email;
      const sameUser = username && String(order.username || "").trim().toLowerCase() === username;
      return sameEmail || sameUser;
    });

    return sendJson(res, 200, {
      email,
      username,
      orders: orders.map((order) => ({
        id: order.id,
        createdAt: order.createdAt,
        status: order.status || "Payment confirmed",
        total: order.total,
        items: order.items || [],
        sent: order.status === "Order sent"
      }))
    });
  }

  if (url.pathname === "/api/orders/status" && req.method === "GET") {
    const id = url.searchParams.get("id");
    const order = readOrders().find((item) => item.id === id);
    if (!order) return sendJson(res, 404, { error: "Order not found" });
    return sendJson(res, 200, {
      id: order.id,
      status: order.status,
      sent: order.status === "Order sent"
    });
  }

  const acceptMatch = url.pathname.match(/^\/api\/orders\/([^/]+)\/accept$/);
  if (acceptMatch && req.method === "PATCH") {
    if (!isAdmin(req)) return sendJson(res, 401, { error: "Wrong password" });

    const id = decodeURIComponent(acceptMatch[1]);
    const orders = readOrders();
    const order = orders.find((item) => item.id === id);
    if (!order) return sendJson(res, 404, { error: "Order not found" });

    order.status = "Order sent";
    order.acceptedAt = new Date().toISOString();
    writeOrders(orders);
    return sendJson(res, 200, { ok: true, order });
  }

  if (req.method === "GET") {
    if (!isAdmin(req)) return sendJson(res, 401, { error: "Wrong password" });
    return sendJson(res, 200, readOrders());
  }

  if (req.method === "POST") {
    try {
      const order = JSON.parse(await collectBody(req));
      const orders = readOrders();
      orders.unshift(order);
      writeOrders(orders);
      return sendJson(res, 201, { ok: true });
    } catch {
      return sendJson(res, 400, { error: "Invalid order" });
    }
  }

  if (req.method === "DELETE") {
    if (!isAdmin(req)) return sendJson(res, 401, { error: "Wrong password" });
    writeOrders([]);
    return sendJson(res, 200, { ok: true });
  }

  sendJson(res, 405, { error: "Method not allowed" });
}

async function handleChat(req, res) {
  if (req.method !== "POST") return sendJson(res, 405, { error: "Method not allowed" });

  try {
    const body = JSON.parse(await collectBody(req));
    const reply = chatAnswer(body.message, body.session || {});
    return sendJson(res, 200, { reply });
  } catch {
    return sendJson(res, 400, { error: "Invalid chat message" });
  }
}

async function handleGoogleAuth(req, res) {
  if (req.method !== "POST") return sendJson(res, 405, { error: "Method not allowed" });

  try {
    const body = JSON.parse(await collectBody(req));
    const profile = await verifyGoogleCredential(body.credential);
    if (!profile.email || !profile.emailVerified) {
      return sendJson(res, 401, { error: "Google email is not verified" });
    }
    return sendJson(res, 200, profile);
  } catch (error) {
    return sendJson(res, 401, { error: error.message || "Google login failed" });
  }
}

async function handleLogins(req, res) {
  if (req.method === "GET") {
    if (!isAdmin(req)) return sendJson(res, 401, { error: "Wrong password" });
    return sendJson(res, 200, readLogins());
  }

  if (req.method === "POST") {
    try {
      const incoming = JSON.parse(await collectBody(req));
      const email = String(incoming.email || "").trim();
      const robloxUsername = String(incoming.robloxUsername || "").trim();
      if (!email && !robloxUsername) return sendJson(res, 400, { error: "Email or Roblox username required" });

      const login = {
        id: `LOGIN-${Date.now().toString().slice(-8)}`,
        createdAt: new Date().toISOString(),
        email,
        robloxUsername,
        matchedOrders: Number(incoming.matchedOrders || 0)
      };
      const logins = readLogins();
      logins.unshift(login);
      writeLogins(logins);
      return sendJson(res, 201, { ok: true, login });
    } catch {
      return sendJson(res, 400, { error: "Invalid login" });
    }
  }

  if (req.method === "DELETE") {
    if (!isAdmin(req)) return sendJson(res, 401, { error: "Wrong password" });
    writeLogins([]);
    return sendJson(res, 200, { ok: true });
  }

  sendJson(res, 405, { error: "Method not allowed" });
}

async function handlePrices(req, res) {
  if (req.method === "GET") {
    return sendJson(res, 200, readPrices());
  }

  if (req.method === "PUT") {
    if (!isAdmin(req)) return sendJson(res, 401, { error: "Wrong password" });

    try {
      const incoming = JSON.parse(await collectBody(req));
      const prices = {};
      for (const [id, value] of Object.entries(incoming)) {
        const price = Number(value);
        if (Number.isFinite(price) && price >= 0) prices[id] = price;
      }
      writePrices(prices);
      return sendJson(res, 200, { ok: true });
    } catch {
      return sendJson(res, 400, { error: "Invalid prices" });
    }
  }

  sendJson(res, 405, { error: "Method not allowed" });
}

function serveStatic(req, res) {
  const urlPath = decodeURIComponent(req.url.split("?")[0]);
  const clean = urlPath === "/" ? "/index.html" : urlPath;
  const file = path.normalize(path.join(root, clean));

  if (!file.startsWith(root)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }

    res.writeHead(200, { "Content-Type": types[path.extname(file)] || "application/octet-stream" });
    res.end(data);
  });
}

http.createServer((req, res) => {
  if (req.url.startsWith("/api/auth/google")) {
    handleGoogleAuth(req, res);
    return;
  }

  if (req.url.startsWith("/api/chat")) {
    handleChat(req, res);
    return;
  }

  if (req.url.startsWith("/api/logins")) {
    handleLogins(req, res);
    return;
  }

  if (req.url.startsWith("/api/customer")) {
    handleOrders(req, res);
    return;
  }

  if (req.url.startsWith("/api/orders")) {
    handleOrders(req, res);
    return;
  }

  if (req.url.startsWith("/api/prices")) {
    handlePrices(req, res);
    return;
  }

  serveStatic(req, res);
}).listen(port, "127.0.0.1", () => {
  console.log(`GAG2 shop running at http://127.0.0.1:${port}/`);
});
