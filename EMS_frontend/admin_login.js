document.addEventListener('DOMContentLoaded', () => {
    const adminLoginForm = document.getElementById('adminLoginForm');
    adminLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('adminUsername').value.trim();
      const password = document.getElementById('adminPassword').value.trim();
  
      
      if (username === 'admin' && password === 'admin123') {
        alert("Logged in successfully as Admin!");
       
      } else {
        alert("Invalid admin credentials. Please try again.");
      }
    });
  });
  // ADMIN login redirect
if (res.user.role === "admin") {
  window.location.href = "admin_dashboard.html";
}
