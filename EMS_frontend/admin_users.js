document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("addUserForm");
    const table = document.getElementById("userTable");
  
    // ✅ Load all users
    function loadUsers() {
      fetch("/EMS_website/ems_backend/index.php?route=users", {
        method: "POST", // using POST so we can include admin check
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ admin_role_check: "admin" })
      })
        .then(res => res.json())
        .then(users => {
          table.innerHTML = "";
          users.forEach(u => {
            const row = document.createElement("tr");
            row.innerHTML = `
              <td class="p-2">${u.id}</td>
              <td class="p-2"><input value="${u.username}" data-id="${u.id}" class="usernameInput p-1 border rounded" /></td>
              <td class="p-2">
                <select data-id="${u.id}" class="roleSelect p-1 border rounded">
                  <option value="user" ${u.role === "user" ? "selected" : ""}>User</option>
                  <option value="admin" ${u.role === "admin" ? "selected" : ""}>Admin</option>
                </select>
              </td>
              <td class="p-2">
                <button onclick="updateUser(${u.id})" class="bg-yellow-500 text-white px-2 py-1 rounded">Update</button>
                <button onclick="deleteUser(${u.id})" class="bg-red-600 text-white px-2 py-1 rounded ml-2">Delete</button>
              </td>
            `;
            table.appendChild(row);
          });
        })
        .catch(err => alert("❌ Failed to load users: " + err));
    }
  
    // ✅ Add new user
    form.addEventListener("submit", (e) => {
      e.preventDefault();
  
      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();
      const role = document.getElementById("role").value;
  
      fetch("/EMS_website/ems_backend/index.php?route=users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
          role,
          admin_role_check: "admin"
        })
      })
        .then(res => res.json())
        .then(res => {
          if (res.error) {
            alert("❌ " + res.error);
          } else {
            form.reset();
            loadUsers();
          }
        })
        .catch(err => alert("Something went wrong: " + err));
    });
  
    // ✅ Update user
    window.updateUser = (id) => {
      const username = document.querySelector(`.usernameInput[data-id="${id}"]`).value;
      const role = document.querySelector(`.roleSelect[data-id="${id}"]`).value;
  
      fetch("/EMS_website/ems_backend/index.php?route=users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          username,
          role,
          admin_role_check: "admin"
        })
      })
        .then(res => res.json())
        .then(res => {
          if (res.error) alert("❌ " + res.error);
          else loadUsers();
        })
        .catch(err => alert("❌ Update failed: " + err));
    };
  
    // ✅ Delete user
    window.deleteUser = (id) => {
      if (!confirm("Are you sure you want to delete this user?")) return;
  
      fetch("/EMS_website/ems_backend/index.php?route=users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          admin_role_check: "admin"
        })
      })
        .then(res => res.json())
        .then(res => {
          if (res.error) alert("❌ " + res.error);
          else loadUsers();
        })
        .catch(err => alert("❌ Delete failed: " + err));
    };
  
    // 🔁 Load users initially
    loadUsers();
  });
  