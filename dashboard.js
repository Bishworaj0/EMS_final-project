document.addEventListener('DOMContentLoaded', function () {
  const ctxBar = document.getElementById('barChart').getContext('2d');
  new Chart(ctxBar, {
    type: 'bar',
    data: {
      labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      datasets: [{
        label: 'Farm Performance',
        data: [12, 19, 15, 17, 22, 18, 20],
        backgroundColor: 'rgba(74, 222, 128, 0.8)',
        borderColor: 'rgba(22, 163, 74, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: { y: { beginAtZero: true } }
      
    }
  });
});
// Mobile Menu Toggle

document.getElementById('menuToggle').addEventListener('click', function() {
      const menu = document.getElementById('mobileMenu');
      menu.classList.toggle('hidden');
      const icon = this.querySelector('i');
      if (icon.classList.contains('fa-bars')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
      } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    });

    // Real-Time Calendar Update
    function updateRealTimeCalendar() {
      const calendar = document.getElementById('realTimeCalendar');
      const now = new Date();
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      calendar.textContent = now.toLocaleDateString('en-US', options);
    }
    setInterval(updateRealTimeCalendar, 1000);

    // Initialize Bar Chart
    const ctxBar = document.getElementById('barChart').getContext('2d');
    const barChart = new Chart(ctxBar, {
      type: 'bar',
      data: {
        labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        datasets: [{
          label: 'Farm Performance',
          data: [12, 19, 15, 17, 22, 18, 20],
          backgroundColor: 'rgba(74, 222, 128, 0.8)',
          borderColor: 'rgba(22, 163, 74, 1)',
          borderWidth: 1
        }]
      },
      options: { responsive: true, scales: { y: { beginAtZero: true } } }
    });

    // Initialize Donut Chart
    const ctxDonut = document.getElementById('donutChart').getContext('2d');
    const donutChart = new Chart(ctxDonut, {
      type: 'doughnut',
      data: {
        labels: ['Productivity', 'Efficiency', 'Sustainability'],
        datasets: [{
          data: [87, 92, 79],
          backgroundColor: [
            'rgba(74, 222, 128, 0.8)',
            'rgba(37, 99, 235, 0.8)',
            'rgba(251, 191, 36, 0.8)'
          ],
          borderColor: '#fff',
          borderWidth: 2
        }]
      },
      options: { responsive: true, plugins: { legend: { position: 'top' } } }
    });

    // Time Period Selection for Bar Chart
    const timeButtons = document.querySelectorAll('.time-btn');
    timeButtons.forEach(btn => {
      btn.addEventListener('click', function() {
        timeButtons.forEach(b => {
          b.classList.remove('bg-blue-500', 'text-white');
          b.classList.add('bg-gray-200', 'text-gray-700');
        });
        this.classList.remove('bg-gray-200', 'text-gray-700');
        this.classList.add('bg-blue-500', 'text-white');
        let newData = [];
        switch (this.textContent.trim()) {
          case 'Week': newData = [12, 19, 15, 17, 22, 18, 20]; break;
          case 'Month': newData = [68, 72, 85, 91]; break;
          case 'Year': newData = [65, 59, 80, 81, 56, 55, 72, 78, 82, 85, 76, 88]; break;
        }
        barChart.data.datasets[0].data = newData;
        barChart.update();
      });
    });

  // calendar

  document.addEventListener('DOMContentLoaded', function(){
    function updaterealTimeCalendar() {
      const calendarEl = document.getElementById('realTimeCalendar');
      console.log("Calendar element:", calendarEl);
      if (!calendarEl) {
        console.error("Calendar element not found!");
        return;
      }
      const now = new Date();
      const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      };
      const dateStr = now.toLocaleDateString('en-US', options);
      console.log("Updating calendar to:", dateStr);
      calendarEl.textContent = dateStr;
    }
    updaterealTimeCalendar();
    setInterval(updaterealTimeCalendar, 1000);
  });
  // donut chart
  new Chart(ctxDonut, {
    type: 'doughnut',
    data: {
      // ...
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
      // ...
    }
  });

  async function fetchCrops() {
      try {
        const res = await fetch("http://localhost:8888/EMS_website/ems_backend/index.php?route=crops");
        const crops = await res.json();
    
        const tbody = document.getElementById("cropTableBody");
        tbody.innerHTML = "";
    
        crops.forEach(crop => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td class="p-3">${crop.crop_name}</td>
            <td class="p-3">${crop.season}</td>
            <td class="p-3">${crop.quantity}</td>
            <td class="p-3">${crop.planted_on}</td>
            <td class="p-3">${crop.harvested_on}</td>
          `;
          tbody.appendChild(row);
        });
    
      } catch (err) {
        console.error("Error fetching crops:", err);
      }
    }
    
    // Run on page load
    document.addEventListener("DOMContentLoaded", () => {
      fetchCrops();
    
    
  });
  
