function login() {
  const usn = document.getElementById("usn").value.trim();
  const password = document.getElementById("password").value.trim();
  const msg = document.getElementById("msg");

  if (!usn || !password) {
    msg.textContent = "Please fill all fields";
    msg.style.color = "red";
    return;
  }

  // simple demo validation
  if (password.length < 4) {
    msg.textContent = "Password must be at least 4 characters";
    msg.style.color = "red";
    return;
  }

  // save login session
  localStorage.setItem("usn", usn);

  msg.style.color = "green";
  msg.textContent = "Login successful ✔";

  setTimeout(() => {
    window.location.href = "index.html";
  }, 800);
}
