let lastSearchedCity = ''; // Store the last searched city to avoid unnecessary API calls

async function fetchWeatherData(cityName) {
  if (cityName.toLowerCase() === lastSearchedCity.toLowerCase()) {
    console.log(`Weather data for ${cityName} is already displayed.`);
    return;
  }

  const geoCodeUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=e47cc881d4676698c911a1548745c0a0`;

  try {
    // Fetch the geographic coordinates (latitude and longitude)
    const locationResponse = await fetch(geoCodeUrl);
    const locationData = await locationResponse.json();

    if (!locationData || locationData.length === 0) {
      console.error('Location not found');
      return;
    }

    const { lat, lon } = locationData[0];
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=e47cc881d4676698c911a1548745c0a0&units=metric`;

    // Fetch the weather data using latitude and longitude
    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();

    if (!weatherData) {
      console.error('Weather data not found');
      return;
    }

    // Update the display with fetched weather data
    updateWeatherDisplay(weatherData);
    lastSearchedCity = cityName; // Update the last searched city
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
}

function updateWeatherDisplay(data) {
  const cityName = document.getElementById('location');
  const weatherIcon = document.getElementById('weather-icon');
  const temperature = document.getElementById('temperature');
  const humidity = document.getElementById('humidity');
  const airPressure = document.getElementById('air-pressure');
  const windSpeed = document.getElementById('wind-speed');
  const windDirection = document.getElementById('wind-direction');
  const pm0_3 = document.getElementById('pm-0-3');
  const pm1_0 = document.getElementById('pm-1-0');
  const pm2_5 = document.getElementById('pm-2-5');
  const description = document.getElementById('weather-description');
  const observationTime = document.getElementById('observation-time');

  const weatherDescription = data.weather[0].description.toLowerCase();
  const tempValue = data.main.temp || 'N/A';
  const humidityValue = data.main.humidity || 'N/A';
  const pressureValue = data.main.pressure || 'N/A';
  const windSpeedValue = data.wind.speed || 'N/A';
  const windDirectionValue = data.wind.deg || 'N/A';

  const pm0_3Value = '40 PM'; // Placeholder value
  const pm1_0Value = '40 PM'; // Placeholder value
  const pm2_5Value = '20 PM'; // Placeholder value

  const observationDateTime = new Date(data.dt * 1000);
  const formattedObservationTime = observationDateTime.toLocaleString();

  cityName.textContent = data.name || 'Unknown location';
  temperature.textContent = `${tempValue}°C`;
  humidity.textContent = `${humidityValue}%`;
  airPressure.textContent = `${pressureValue} hPa`;
  windSpeed.textContent = `${windSpeedValue} km/h`;
  windDirection.textContent = windDirectionValue;

  pm0_3.textContent = pm0_3Value;
  pm1_0.textContent = pm1_0Value;
  pm2_5.textContent = pm2_5Value;

  description.textContent = weatherDescription.charAt(0).toUpperCase() + weatherDescription.slice(1);

  if (observationTime) {
    observationTime.textContent = `Last Updated: ${formattedObservationTime}`;
  }

  const isDayTime = data.weather[0].icon.includes('d');

  if (isDayTime) {
    if (weatherDescription.includes('clear')) {
      weatherIcon.src = 'sun.gif';
    } else if (weatherDescription.includes('cloud')) {
      weatherIcon.src = 'cloudy day.gif';
    } else if (weatherDescription.includes('rain')) {
      weatherIcon.src = 'stormy day.gif';
    }
  } else {
    if (weatherDescription.includes('clear')) {
      weatherIcon.src = 'moon.gif';
    } else if (weatherDescription.includes('cloud')) {
      weatherIcon.src = 'cloudy night.gif';
    } else if (weatherDescription.includes('rain')) {
      weatherIcon.src = 'stormy night.gif';
    }
  }
}

// Call fetchWeatherData with a default city
// fetchWeatherData('Bolpur');

// Attach event listener to the search button
document.getElementById('findbtn-icon').addEventListener('click', () => {
  const cityInput = document.querySelector('input[type="search"]').value.trim();
  if (cityInput) {
    fetchWeatherData(cityInput);
  }
});
