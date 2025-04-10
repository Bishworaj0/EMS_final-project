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