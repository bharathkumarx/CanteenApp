const states = ["Preparing", "Almost Ready", "Ready"];
let i = 0;

setInterval(() => {
  document.getElementById("status").textContent = states[i];
  i = (i + 1) % states.length;
}, 3000);
