document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.getElementById("equipmentTableBody");
    const chartCtx = document.getElementById("statusChart").getContext("2d");
  
    let allEquipment = [];
  
    // Fetch equipment data
    fetch("http://localhost:8888/EMS_website/ems_backend/index.php?route=equipment_status")
      .then(res => res.json())
      .then(data => {
        allEquipment = data;
        renderTable(data);
        renderChart(data);
      })
      .catch(err => console.error("❌ Error fetching equipment:", err));
  
    // Render table
    function renderTable(list) {
      tableBody.innerHTML = "";
      list.forEach(eq => {
        const statusColor =
          eq.status === "Working" ? "text-green-600" :
          eq.status === "Needs Maintenance" ? "text-yellow-500" :
          "text-red-500";
  
        const row = document.createElement("tr");
        row.innerHTML = `
          <td class="p-3">${eq.name}</td>
          <td class="p-3">${eq.type}</td>
          <td class="p-3 font-semibold ${statusColor}">${eq.status}</td>
          <td class="p-3">${eq.last_serviced || '-'}</td>
          <td class="p-3">${eq.notes || '-'}</td>
        `;
        tableBody.appendChild(row);
      });
    }
  
    // Render chart
    function renderChart(data) {
      const counts = {
        Working: 0,
        "Needs Maintenance": 0,
        Broken: 0
      };
  
      data.forEach(eq => {
        if (counts[eq.status] !== undefined) {
          counts[eq.status]++;
        }
      });
  
      new Chart(chartCtx, {
        type: 'doughnut',
        data: {
          labels: Object.keys(counts),
          datasets: [{
            data: Object.values(counts),
            backgroundColor: ['#34d399', '#fbbf24', '#f87171']
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'bottom' }
          }
        }
      });
    }
  
    // Form submission
    document.getElementById("addEquipmentForm").addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const newEq = {
        user_id: 9, 
        name: document.getElementById("equipmentName").value.trim(),
        type: document.getElementById("equipmentType").value.trim(),
        status: document.getElementById("equipmentStatus").value,
        last_serviced: document.getElementById("lastServiced").value,
        notes: document.getElementById("equipmentNotes").value.trim()
      };
  
      try {
        const res = await fetch("http://localhost:8888/EMS_website/ems_backend/index.php?route=equipment_status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newEq)
        });
  
        const result = await res.json();
        if (result.message) {
          alert("✅ Equipment added!");
          location.reload();
        } else {
          alert("❌ Failed: " + (result.error || "Unknown error"));
        }
      } catch (err) {
        console.error("❌ Error adding equipment:", err);
        alert("❌ Submission error. Check console.");
      }
    });
  });
  