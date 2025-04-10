document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("reminderModal");
  const form = document.getElementById("reminderForm");
  const cancelBtn = document.getElementById("cancelBtn");
  const newReminderBtn = document.getElementById("newReminderBtn");
  const list = document.getElementById("reminderList");

  // Open modal
  newReminderBtn.addEventListener("click", () => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().then(permission => {
        console.log("User clicked newReminderBtn – Permission:", permission);
      });
    }
  
    modal.classList.remove("hidden");
  });

  // Close modal
  cancelBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  // Submit form
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const date_time = document.getElementById("date_time").value;
    const notes = document.getElementById("notes").value;

    try {
      const res = await fetch("http://localhost:8888/EMS_website/ems_backend/index.php?route=reminders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, date_time, notes })
      });

      const text = await res.text();
      console.log("Response text:", text);

      try {
        const result = JSON.parse(text);
        alert(result.message || "Reminder added!");
      } catch (e) {
        alert("Reminder added, but could not parse response.");
      }

      form.reset();
      modal.classList.add("hidden");
      await loadReminders(); // Refresh reminder list

    } catch (err) {
      console.error("Add failed", err);
      alert("Failed to add reminder.");
    }
  });
  // Ask for notification permission when page loads
document.addEventListener("DOMContentLoaded", () => {
  if ("Notification" in window) {
    Notification.requestPermission().then(permission => {
      console.log("Notification permission:", permission);
    });
  }
});
function showNotification(title, body, time) {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(`⏰ ${title}`, {
      body: `${body || 'Reminder'} @ ${time.toLocaleTimeString()}`,
      icon: "https://cdn-icons-png.flaticon.com/512/1827/1827349.png" // optional icon
    });
  }
}



  // Load all reminders
  async function loadReminders() {
    try {
      const res = await fetch("http://localhost:8888/EMS_website/ems_backend/index.php?route=reminders");
      const reminders = await res.json();

      list.innerHTML = ""; 
      const now = new Date();
const fiveMinsFromNow = new Date(now.getTime() + 5 * 60000); // 5 mins from now

reminders.forEach(reminder => {
  const reminderTime = new Date(reminder.date_time);

  // If the reminder is between now and 5 minutes from now
  if (
    reminderTime >= now &&
    reminderTime <= fiveMinsFromNow
  ) {
    showNotification(reminder.title, reminder.notes, reminderTime);
  }

  
});


      reminders.forEach(reminder => {
        const li = document.createElement("li");
        li.className = "bg-white p-4 rounded shadow flex justify-between items-start";

        li.innerHTML = `
          <div>
            <h3 class="text-lg font-bold">${reminder.title}</h3>
            <p class="text-gray-600 text-sm">${new Date(reminder.date_time).toLocaleString()}</p>
            <p class="mt-1 text-gray-700">${reminder.notes}</p>
          </div>
          <button class="text-red-600 hover:text-red-800" onclick="deleteReminder(${reminder.id})">
            <i class="fas fa-trash"></i>
          </button>
        `;

        list.appendChild(li);
      });
    } catch (err) {
      console.error("Failed to load reminders:", err);
    }
  }

 
  loadReminders();
});

// Global delete function
async function deleteReminder(id) {
  try {
    const res = await fetch("http://localhost:8888/EMS_website/ems_backend/index.php?route=reminders", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id })
    });

    const result = await res.json();
    alert(result.message || "Reminder deleted.");
    location.reload();
  } catch (err) {
    console.error("Delete failed", err);
    alert("Failed to delete reminder.");
  }
}
// Run every 1 minute to check for upcoming reminders
setInterval(() => {
  loadReminders();
}, 60000);

