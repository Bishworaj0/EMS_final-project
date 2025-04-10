document.addEventListener("DOMContentLoaded", () => {
    const cropListElement = document.getElementById("cropList");
    const searchInput = document.getElementById("cropSearch");
    const allCrops = [];
  
    // Fetch crops from backend
    fetch("http://localhost:8888/EMS_website/ems_backend/index.php?route=crops")
      .then(res => res.json())
      .then(crops => {
        allCrops.push(...crops); // store all crops for searching
        renderCropTable(allCrops);
        renderCropChart(allCrops);
  
        // Search/filter handler
        searchInput.addEventListener("input", () => {
          const query = searchInput.value.toLowerCase();
          const filtered = allCrops.filter(crop =>
            crop.crop_name.toLowerCase().includes(query) ||
            crop.season.toLowerCase().includes(query)
          );
          renderCropTable(filtered);
        });
      })
      .catch(err => {
        console.error("❌ Failed to fetch crops:", err);
      });
  
    // Render crop table rows
    function renderCropTable(crops) {
      cropListElement.innerHTML = "";
      crops.forEach(crop => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td class="p-3">${crop.crop_name}</td>
          <td class="p-3">${crop.season}</td>
          <td class="p-3">${crop.quantity}</td>
          <td class="p-3">${crop.planted_on}</td>
          <td class="p-3">${crop.harvested_on}</td>
        `;
        cropListElement.appendChild(row);
      });
    }
  
    // Render crop bar chart
    function renderCropChart(crops) {
      const cropTotals = {};
      crops.forEach(crop => {
        const name = crop.crop_name;
        cropTotals[name] = (cropTotals[name] || 0) + parseFloat(crop.quantity);
      });
  
      const labels = Object.keys(cropTotals);
      const data = Object.values(cropTotals);
  
      const ctx = document.getElementById("cropChart").getContext("2d");
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Quantity',
            data: data,
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
  
    // Handle form submission to add new crop
    document.getElementById("addCropForm").addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const cropName = document.getElementById("cropName").value.trim();
      const season = document.getElementById("season").value.trim();
      const quantityInput = document.getElementById("quantity").value.trim();
      const planted_on = document.getElementById("plantedOn").value;
      const harvested_on = document.getElementById("harvestedOn").value;
      const notes = document.getElementById("notes").value.trim();
  
      const quantity = parseFloat(quantityInput);
  
      if (!cropName || !quantity || isNaN(quantity)) {
        alert("❌ Please enter a valid crop name and quantity.");
        return;
      }
  
      if (!planted_on || !harvested_on) {
        alert("❌ Please provide both planted and harvested dates.");
        return;
      }
  
      const newCrop = {
        user_id: 1, // Replace with dynamic user ID when you implement auth
        crop_name: cropName,
        season: season,
        quantity: quantity,
        planted_on: planted_on,
        harvested_on: harvested_on,
        notes: notes
      };
  
      try {
        const res = await fetch("http://localhost:8888/EMS_website/ems_backend/index.php?route=crops", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newCrop)
        });
  
        const result = await res.json();
        console.log("POST response:", result);
  
        if (result.message) {
          alert("✅ Crop added successfully!");
          location.reload(); // reload to update chart + table
        } else {
          alert("❌ Failed to add crop: " + (result.error || "Unknown error"));
        }
      } catch (err) {
        console.error("❌ Error adding crop:", err);
        alert("❌ Something went wrong. Check console.");
      }
    });
  });
  