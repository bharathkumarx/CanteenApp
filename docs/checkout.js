const cart = JSON.parse(localStorage.getItem("cart")) || {};
const total = localStorage.getItem("total") || 0;

const summaryList = document.getElementById("summary-list");
const totalEl = document.getElementById("total");

for (let id in cart) {
  const row = document.createElement("div");
  row.className = "summary-row";

  row.innerHTML = `
    <span>Item ${id} × ${cart[id]}</span>
    <span>₹${cart[id] * 40}</span>
  `;

  summaryList.appendChild(row);
}

totalEl.textContent = "₹" + total;

function pay() {
  window.location.href = "status.html";
}
