document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.getElementById("yieldTableBody");
    const ctx = document.getElementById("yieldChart").getContext("2d");
  
    let allYields = [];
   
    fetch("http://localhost:8888/EMS_website/ems_backend/index.php?route=yield_forecast")
      .then(res => res.json())
      .then(data => {
        allYields = data;
        renderTable(data);
        renderChart(data);
      })
      .catch(err => console.error("❌ Error fetching yields:", err));
  
    function renderTable(list) {
      tableBody.innerHTML = "";
      list.forEach(item => {
        const accuracy = calculateAccuracy(item.estimated_yield, item.actual_yield);
        const row = document.createElement("tr");
        row.innerHTML = `
          <td class="p-3">${item.crop_name}</td>
          <td class="p-3">${item.season}</td>
          <td class="p-3">${item.estimated_yield}</td>
          <td class="p-3">${item.actual_yield}</td>
          <td class="p-3">${item.unit}</td>
          <td class="p-3 ${getAccuracyClass(accuracy)}">${accuracy}%</td>
          <td class="p-3">${item.field_name || '-'}</td>
        `;
        tableBody.appendChild(row);
      });
    }
  
    function renderChart(data) {
        const labels = data.map(x => {
          const date = new Date(x.created_at);
          return `${x.crop_name} (${date.toLocaleDateString()})`;
        });
      
        const est = data.map(x => parseFloat(x.estimated_yield));
        const act = data.map(x => parseFloat(x.actual_yield));
      
        new Chart(ctx, {
          type: 'line',
          data: {
            labels,
            datasets: [
              {
                label: 'Estimated Yield',
                data: est,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                fill: true,
                tension: 0.3
              },
              {
                label: 'Actual Yield',
                data: act,
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                fill: true,
                tension: 0.3
              }
            ]
          },
          options: {
            responsive: true,
            plugins: {
              legend: { position: 'top' },
              tooltip: { mode: 'index', intersect: false }
            },
            interaction: {
              mode: 'nearest',
              axis: 'x',
              intersect: false
            },
            scales: {
              x: {
                display: true,
                title: { display: true, text: 'Crop (Date)' }
              },
              y: {
                display: true,
                title: { display: true, text: 'Yield' }
              }
            }
          }
        });
      }
      
    function calculateAccuracy(estimated, actual) {
      if (!estimated || estimated == 0) return 0;
      return Math.round((actual / estimated) * 100);
    }
  
    function getAccuracyClass(percent) {
      if (percent >= 95) return "text-green-600 font-semibold";
      if (percent < 80) return "text-red-500 font-semibold";
      return "text-yellow-500 font-semibold";
    }
  
    document.getElementById("addYieldForm").addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const data = {
        user_id: 9, 
        crop_name: document.getElementById("cropName").value.trim(),
        season: document.getElementById("season").value.trim(),
        estimated_yield: parseFloat(document.getElementById("estimated").value)|| 0,
        actual_yield: parseFloat(document.getElementById("actual").value) || 0,
        unit: document.getElementById("unit").value.trim(),
        field_name: document.getElementById("fieldName").value.trim(),
        notes: document.getElementById("notes").value.trim()
      };
      console.log("SUBMIT DATA", data);

  
      try {
        const res = await fetch("http://localhost:8888/EMS_website/ems_backend/index.php?route=yield_forecast", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });
  
        const result = await res.json();
        if (result.message) {
          alert("✅ Forecast added!");
          location.reload();
        } else {
          alert("❌ " + (result.error || "Failed to add forecast."));
        }
      } catch (err) {
        console.error("❌ Error submitting forecast:", err);
        alert("❌ Submission error. Check console.");
      }
    });
  });
  