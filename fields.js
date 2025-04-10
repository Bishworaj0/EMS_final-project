document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.getElementById("fieldTableBody");
    const chartCanvas = document.getElementById("capacityChart").getContext("2d");
  
    let allFields = [];
  
    // Fetch all field capacity data
    fetch("http://localhost:8888/EMS_website/ems_backend/index.php?route=field_capacity")
      .then(res => res.json())
      .then(data => {
        allFields = data;
        renderTable(data);
        renderChart(data);
      })
      .catch(err => {
        console.error("❌ Error fetching fields:", err);
      });
  
    // Render field table
    function renderTable(fields) {
      tableBody.innerHTML = "";
      fields.forEach(field => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td class="p-3">${field.field_name}</td>
          <td class="p-3">${field.soil_type}</td>
          <td class="p-3">${field.area_ha}</td>
          <td class="p-3">${field.capacity_mm}</td>
          <td class="p-3">${field.notes || '-'}</td>
        `;
        tableBody.appendChild(row);
      });
    }
  
    // Render chart
    function renderChart(fields) {
      const labels = fields.map(f => f.field_name);
      const values = fields.map(f => parseFloat(f.capacity_mm || 0));
  
      new Chart(chartCanvas, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Field Capacity (mm)',
            data: values,
            backgroundColor: '#4ade80'
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false }
          }
        }
      });
    }
  
    // Handle form submission
    document.getElementById("addFieldForm").addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const newField = {
        user_id: 9, 
        field_name: document.getElementById("fieldName").value,
        soil_type: document.getElementById("soilType").value,
        area_ha: parseFloat(document.getElementById("area").value) || 0,
        capacity_mm: parseFloat(document.getElementById("capacity").value) || 0,
        notes: document.getElementById("fieldNotes").value
      };
  
      try {
        const res = await fetch("http://localhost:8888/EMS_website/ems_backend/index.php?route=field_capacity", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newField)
        });
  
        const result = await res.json();
        if (result.message) {
          alert("✅ Field added successfully!");
          location.reload(); // refresh to show in chart/table
        } else {
          alert("❌ Failed to add field.");
        }
      } catch (err) {
        console.error("❌ Error adding field:", err);
        alert("❌ Something went wrong.");
      }
    });
  });
  