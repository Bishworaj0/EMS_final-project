document.addEventListener('DOMContentLoaded', () => {
    // Use your provided OpenWeatherMap API key
    const API_KEY = 'bab97ae9be083f5ada07c4f699fd59d2';
    // Coordinates for Sydney, Australia
    const lat = -33.8688;
    const lon = 151.2093;
    // Default unit: 'metric' for Celsius; toggle to 'imperial' for Fahrenheit
    let unit = 'metric';
  
    // Elements
    const currentWeatherEl = document.getElementById('currentWeatherDetails');
    const currentIconEl = document.getElementById('currentWeatherIcon');
    const forecastContainer = document.getElementById('forecastContainer');
    const toggleUnitBtn = document.getElementById('toggleUnit');
  
    // Fetch weather data using the One Call API v3.0
    function fetchWeather() {
      const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=${API_KEY}&units=${unit}`;
      console.log('Fetching weather data from:', url);
      fetch(url)
        .then(res => {
          if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }
          return res.json();
        })
        .then(data => {
          // Update current weather using data.current
          updateCurrentWeather(data.current);
          // Update forecast using the first 5 entries of data.daily (excluding today's)
          updateForecast(data.daily.slice(1, 6));
        })
        .catch(err => {
          console.error("Error fetching weather data:", err);
          if (currentWeatherEl) {
            currentWeatherEl.innerHTML = `<p>Error fetching current weather: ${err.message}</p>`;
          }
          if (forecastContainer) {
            forecastContainer.innerHTML = `<p>Error fetching forecast data: ${err.message}</p>`;
          }
        });
    }
  
    // Update the current weather section
    function updateCurrentWeather(current) {
      if (!current) return;
      // Update current weather details
      const temp = Math.round(current.temp);
      const description = current.weather[0].description;
      if (currentWeatherEl) {
        currentWeatherEl.innerHTML = `
          <p class="text-lg font-semibold">Sydney</p>
          <p class="text-3xl font-bold">${temp}° ${unit === 'metric' ? 'C' : 'F'}</p>
          <p class="capitalize">${description}</p>
        `;
      }
      // Update weather icon using OpenWeatherMap's icon URL
      if (currentIconEl) {
        currentIconEl.innerHTML = `<img src="https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png" alt="${description}">`;
      }
    }
  
    // Update the 5-day forecast section
    function updateForecast(forecasts) {
      if (!forecastContainer) return;
      forecastContainer.innerHTML = '';
      forecasts.forEach(day => {
        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString(undefined, { weekday: 'long' });
        const temp = Math.round(day.temp.day);
        const description = day.weather[0].description;
        const icon = day.weather[0].icon;
        const card = document.createElement('div');
        card.className = 'bg-blue-50 p-4 rounded-lg shadow text-center';
        card.innerHTML = `
          <p class="font-semibold">${dayName}</p>
          <img class="mx-auto" src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}" />
          <p class="text-2xl font-bold">${temp}° ${unit === 'metric' ? 'C' : 'F'}</p>
          <p class="capitalize text-gray-600">${description}</p>
        `;
        forecastContainer.appendChild(card);
      });
    }
  
    // Toggle temperature unit (Celsius/Imperial)
    toggleUnitBtn.addEventListener('click', () => {
      if (unit === 'metric') {
        unit = 'imperial';
        toggleUnitBtn.textContent = "Toggle °C/°F (Now °F)";
      } else {
        unit = 'metric';
        toggleUnitBtn.textContent = "Toggle °C/°F (Now °C)";
      }
      fetchWeather();
    });
  
    // Initial fetch of weather data
    fetchWeather();
  });
  