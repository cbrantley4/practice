export default st => `
<h3>Weather in ${st.weather.city}: ${
  st.weather.description
} // ${kelvinToFahrenheit(st.weather.temp)}F, feels like ${kelvinToFahrenheit(
  st.weather.feelsLike
)}F</h3>
<section id="jumbotron">
  <h2>Savvy Coders Jan. 2020 Cohort</h2>
  <a href="">"Call to Action" "Button"</a>
</section>`;

const kelvinToFahrenheit = kelvinTemp =>
  Math.round((kelvinTemp - 273.15) * (9 / 5) + 32);
