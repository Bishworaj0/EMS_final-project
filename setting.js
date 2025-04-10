document.addEventListener('DOMContentLoaded', () => {
  // On page load, check if there are saved settings and apply them
  const savedSettings = localStorage.getItem('farmDashboardSettings');
  if (savedSettings) {
    const settings = JSON.parse(savedSettings);
    document.getElementById('tempUnit').value = settings.tempUnit;
    document.getElementById('language').value = settings.language;
    document.getElementById('theme').value = settings.theme;
    document.getElementById('notificationsToggle').checked = settings.notifications;
    applySettings(settings);
  }
  

  // Handle the settings form submission
  document.getElementById('settingsForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const tempUnit = document.getElementById('tempUnit').value;
    const language = document.getElementById('language').value;
    const theme = document.getElementById('theme').value;
    const notifications = document.getElementById('notificationsToggle').checked;

    const settings = { tempUnit, language, theme, notifications };
    localStorage.setItem('farmDashboardSettings', JSON.stringify(settings));
    applySettings(settings);
    alert('Settings saved successfully!');
  });

  // Function to apply settings
  function applySettings(settings) {
    console.log('Applied settings:', settings);
    // Example: Toggle dark mode on the body
    if (settings.theme === 'dark') {
      document.body.classList.add('dark-mode');

    } else {
      document.body.classList.remove('dark-mode');
    }
    
  }
});
