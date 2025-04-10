document.addEventListener("DOMContentLoaded", () => {
    // Fetch and display total crops
    fetch("/EMS_website/ems_backend/index.php?route=crops")
      .then(res => res.json())
      .then(data => {
        document.getElementById("cropCount").textContent = data.length;
      });
  
    // Yield forecast chart and accuracy %
    fetch("/EMS_website/ems_backend/index.php?route=yield_forecast")
      .then(res => res.json())
      .then(data => {
        let labels = [], estimated = [], actual = [];
        let totalAccuracy = 0;
  
        data.forEach(item => {
          if (item.estimated_yield > 0) {
            labels.push(item.crop_name);
            estimated.push(parseFloat(item.estimated_yield));
            actual.push(parseFloat(item.actual_yield));
            totalAccuracy += (item.actual_yield / item.estimated_yield) * 100;
          }
        });
  
        let avgAccuracy = (totalAccuracy / labels.length).toFixed(1);
        document.getElementById("yieldAccuracy").textContent = avgAccuracy + "%";
  
        new Chart(document.getElementById("forecastChart"), {
          type: "bar",
          data: {
            labels,
            datasets: [
              {
                label: "Estimated",
                data: estimated,
                backgroundColor: "#60a5fa"
              },
              {
                label: "Actual",
                data: actual,
                backgroundColor: "#34d399"
              }
            ]
          },
          options: {
            responsive: true,
            plugins: {
              legend: { position: "bottom" }
            }
          }
        });
      });
  
    // Equipment health
    fetch("/EMS_website/ems_backend/index.php?route=equipment_status")
      .then(res => res.json())
      .then(data => {
        const working = data.filter(e => e.status === "Working").length;
        const percent = ((working / data.length) * 100).toFixed(1);
        document.getElementById("equipmentStatus").textContent = percent + "%";
  
        const table = document.getElementById("equipmentTable");
        data.forEach(eq => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td class="p-2">${eq.name}</td>
            <td class="p-2">${eq.type}</td>
            <td class="p-2">${eq.status}</td>
            <td class="p-2">${eq.last_serviced || '-'}</td>
          `;
          table.appendChild(row);
        });
      });
const selectedMonth = document.getElementById("filterMonth").value; // 2025-04
// Filter results by date:
data.filter(item => item.harvested_on?.startsWith(selectedMonth));

  
    // Total users
    fetch("/EMS_website/ems_backend/index.php?route=users")
      .then(res => res.json())
      .then(data => {
        document.getElementById("userCount").textContent = data.length;
      });
  });
  