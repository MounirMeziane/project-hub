// Grab the parts of the page we need
let clock; // keeps the city's clock ticking
const form = document.getElementById("search");
const input = document.getElementById("city");
const current = document.getElementById("current");
const forecast = document.getElementById("forecast");

// Open-Meteo sends a number for the weather. This turns it into words + a type.
function describe(code) {
  if (code === 0) return ["Clear sky", "sunny"];
  if (code <= 2) return ["Mostly sunny", "sunny"];
  if (code === 3) return ["Cloudy", "cloudy"];
  if (code <= 48) return ["Fog", "cloudy"];
  if (code <= 67 || (code >= 80 && code <= 82)) return ["Rain", "rainy"];
  if (code <= 77 || code === 85 || code === 86) return ["Snow", "snowy"];
  return ["Thunderstorm", "rainy"];
}
const ICONS = { sunny: "☀️", cloudy: "☁️", rainy: "🌧️", snowy: "❄️" };

async function getWeather(name) {
  current.innerHTML = "<p>Loading…</p>";
  try {
    // 1) City name -> latitude and longitude
    const geo = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=1`
    ).then(r => r.json());

    if (!geo.results) {
      current.innerHTML = `<p>Couldn't find "${name}". Check the spelling.</p>`;
      forecast.innerHTML = "";
      return;
    }
    const place = geo.results[0];

    // 2) Latitude and longitude -> weather
    const data = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}` +
      `&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,is_day` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=5`
    ).then(r => r.json());

    show(place, data);
  } catch (err) {
    current.innerHTML = "<p>Couldn't load the weather. Check your internet connection.</p>";
  }
}

function show(place, data) {
  const c = data.current;
  const [label, type] = describe(c.weather_code);

  // Day or night changes which icon shows
  const night = !c.is_day;
  let mood = type;
  if (type === "sunny" && night) mood = "clear"; // clear sky at night
  document.body.className = mood + (night ? " night" : "");

  current.innerHTML = `
    <p class="place">${place.name}, ${place.country} <span class="time" id="localTime"></span></p>    <div class="temp">${Math.round(c.temperature_2m)}°</div>
    <p>${night && type === "sunny" ? "Clear night" : label} · feels like ${Math.round(c.apparent_temperature)}° · wind ${Math.round(c.wind_speed_10m)} km/h</p>`;
  // Local time in the searched city, updated every 10 seconds
  clearInterval(clock);
  const tick = () => {
    document.getElementById("localTime").textContent = new Date().toLocaleTimeString("en-CA", {
      timeZone: data.timezone, hour: "numeric", minute: "2-digit"
    });
  };
  tick();
  clock = setInterval(tick, 10000);
  forecast.innerHTML = data.daily.time.map((day, i) => {
    const [, dayType] = describe(data.daily.weather_code[i]);
    const dayName = new Date(day + "T12:00").toLocaleDateString("en-CA", { weekday: "short" });
    return `
      <div class="day">
        <b>${dayName}</b>
        <div class="icon">${ICONS[dayType]}</div>
        <div>${Math.round(data.daily.temperature_2m_max[i])}° / ${Math.round(data.daily.temperature_2m_min[i])}°</div>
      </div>`;
  }).join("");
}

// When you press Search
form.addEventListener("submit", e => {
  e.preventDefault(); // stops the page from reloading
  if (input.value.trim()) getWeather(input.value.trim());
});

// Show Ottawa when the page opens
getWeather("Ottawa");
