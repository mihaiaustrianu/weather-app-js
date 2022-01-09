import "./styles.css";

async function getWeatherData(city, units, API_KEY) {
  try {
    const response = await fetch(
      `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${units}`
    );
    const weatherData = await response.json();
    return weatherData;
  } catch (err) {
    console.log(err);
  }
}

async function getWeatherDataWeek(lat, lon, units, API_KEY) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely,current,alerts&appid=${API_KEY}&units=${units}`
    );
    const weeklyData = await response.json();
    return weeklyData;
  } catch (err) {
    console.log(err);
  }
}

const DOMManipulation = (() => {
  //Initial state - Bucharest
  const API_KEY = "933086bfe71245140d90698686b2b06b";
  let city = "bucharest";
  let units = "metric";

  async function populateCurrentDay() {
    let weatherData = await getWeatherData(city, units, API_KEY);

    console.log(weatherData);
    //left container
    let weather = document.querySelector(".weather");
    let location = document.querySelector(".location");
    let temperature = document.querySelector(".temperature");
    weather.innerHTML = weatherData.weather[0].main;
    location.innerHTML = weatherData.name;
    temperature.innerHTML = Math.round(weatherData.main.temp) + "°" + "C";

    //get current time
    let dateTime = new Date(weatherData.dt * 1000);
    let date = document.querySelector(".date");
    date.innerHTML = dateTime.toLocaleString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });

    //populate right side
    let feelsLike = document.querySelector(".feels-like");
    let humidity = document.querySelector(".humidity");
    let windSpeed = document.querySelector(".wind-speed");

    feelsLike.innerHTML = Math.round(weatherData.main.feels_like) + "°" + "C";
    humidity.innerHTML = weatherData.main.humidity + " %";
    windSpeed.innerHTML = Math.round(weatherData.wind.speed) + " km/h";
  }

  async function populateWeeklyData() {
    let weatherData = await getWeatherData(city, units, API_KEY);

    //lat and lon
    let lat = weatherData.coord.lat;
    let lon = weatherData.coord.lon;

    let weatherDataWeek = await getWeatherDataWeek(lat, lon, units, API_KEY);

    let weeklyWeather = document.querySelector(".weekly-weather");
    weeklyWeather.innerHTML = "";
    for (let i = 0; i < 7; i++) {
      let dayElement = helperFunctions.createElement("div", "day-div", "");
      let dayOfWeek = helperFunctions.createElement(
        "p",
        "day-of-week",
        helperFunctions.getDayName(weatherDataWeek.daily[i].sunrise, "en-US")
      );

      //MIN AND MAX temperatrure
      let tempElement = helperFunctions.createElement("div", "temp-div", "");
      let minElement = helperFunctions.createElement(
        "div",
        "min-temp",
        Math.round(parseInt(weatherDataWeek.daily[i].temp.min)) + "°" + "C"
      );
      let maxElement = helperFunctions.createElement(
        "div",
        "max-temp",
        Math.round(parseInt(weatherDataWeek.daily[i].temp.max)) + "°" + "C"
      );

      tempElement.appendChild(maxElement);
      tempElement.appendChild(minElement);
      //appending to each day element
      dayElement.appendChild(dayOfWeek);
      dayElement.appendChild(tempElement);
      //appending to week container
      weeklyWeather.appendChild(dayElement);
    }
  }
  function populateSearchHandler(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      document.getElementById("myBtn").click();
    }
  }
  function setCity(val) {
    city = val;
  }
  function clickHandler() {
    const field =document.querySelector(".search-field")
    field.innerHTML = ''
    const val = field.value;
    setCity(val);
    populateCurrentDay();
    populateWeeklyData();
  }
  return {
    populateCurrentDay,
    populateWeeklyData,
    populateSearchHandler,
    clickHandler,
  };
})();

const helperFunctions = (() => {
  function getDayName(dateStr, locale) {
    var date = new Date(dateStr * 1000);
    return date.toLocaleDateString(locale, { weekday: "short" });
  }
  function createElement(type, className, html) {
    let element = document.createElement(type);
    element.classList.add(className);
    element.innerHTML = html;
    return element;
  }
  return { getDayName, createElement };
})();

DOMManipulation.populateCurrentDay();
DOMManipulation.populateWeeklyData();
//getWeatherDataWeek('bucharest','metric')

var input = document.getElementById("search");
input.addEventListener("keyup", DOMManipulation.populateSearchHandler);
document
  .getElementById("myBtn")
  .addEventListener("click", DOMManipulation.clickHandler);
