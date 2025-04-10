document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("userLoginForm");
  const usernameInput = document.getElementById("userUsername");
  const passwordInput = document.getElementById("userPassword");
  const messageBox = document.getElementById("loginMessage");
  const loginButton = form.querySelector("button[type='submit']");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    // UI feedback - reset state
    messageBox.textContent = "";
    loginButton.disabled = true;
    loginButton.textContent = "Logging in...";

    try {
      const res = await fetch("http://localhost:8888/EMS_website/ems_backend/index.php?route=login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const result = await res.json();

      if (res.ok && result.message === "Login successful") {
        messageBox.textContent = "✅ Logged in successfully!";
        messageBox.className = "text-green-600 mt-4";

        localStorage.setItem("username", result.user.username);
        localStorage.setItem("role", result.user.role);

        // Delay to let user see message
        setTimeout(() => {
          window.location.href = "dashboard.html";
        }, 1000);
      } else {
        messageBox.textContent = result.error || "❌ Login failed. Please try again.";
        messageBox.className = "text-red-600 mt-4";
        passwordInput.value = ""; // clear for retry
      }

    } catch (err) {
      console.error("Login error:", err);
      messageBox.textContent = "❌ Network error. Please try again.";
      messageBox.className = "text-red-600 mt-4";
    }

    // Reset button
    loginButton.disabled = false;
    loginButton.textContent = "Login";
  });
});
// Password toggle
const toggleIcon = document.getElementById("togglePassword");
const passwordInput = document.getElementById("userPassword");

toggleIcon.addEventListener("click", () => {
  const isPassword = passwordInput.type === "password";
  passwordInput.type = isPassword ? "text" : "password";
  toggleIcon.textContent = isPassword ? "🙈" : "👁️"; // Change icon
});
if (res.user && res.user.role === "user") {
  localStorage.setItem("user_id", res.user.id); 
  window.location.href = "dashboard.html";
}

