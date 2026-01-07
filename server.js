const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));


const ORDERS_FILE = "orders.json";


if (!fs.existsSync(ORDERS_FILE)) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify([]));
}


app.post("/api/order", (req, res) => {
  const { shopId, cart, total, usn } = req.body;

  if (!shopId || !usn || Object.keys(cart).length === 0) {
    return res.status(400).json({ message: "Invalid order data" });
  }

  const orders = JSON.parse(fs.readFileSync(ORDERS_FILE));

  const newOrder = {
    id: Date.now(),
    shopId,
    cart,
    total,
    usn,
    time: new Date().toLocaleString()
  };

  orders.push(newOrder);
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));

  res.json({ message: "Order placed successfully!" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
