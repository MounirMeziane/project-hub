# Weather App

Live weather for any city, with a sky that reacts to real conditions.

**Try it:** https://mounirmeziane.github.io/project-hub/weather-app/

## Features
- Search any city and see the current temperature, "feels like", wind and a 5-day forecast
- Shows the city's local time
- The icon and colors react to the real weather:
  - **Sunny:** the sun grows and the title fades to yellow
  - **Clear night:** a moon and twinkling stars
  - **Cloudy, rain, snow:** the cloud stays; rain or snow falls when you hover

## How it works
1. The city name goes to the Open-Meteo geocoding API, which returns its latitude and longitude.
2. Those coordinates go to the Open-Meteo forecast API, which returns the weather.
3. The app tags the page with the weather type (`sunny`, `cloudy`, `night`…), and the CSS reacts to that tag.

## Built with
HTML, CSS, JavaScript and the Open-Meteo API (free, no key needed).

## What's next
- Ottawa commute mode: what to wear and whether to expect a cold wait at the bus stop