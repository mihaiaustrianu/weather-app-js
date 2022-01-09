import "./styles.css";

const API_KEY = "933086bfe71245140d90698686b2b06b";

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
  let city = "bucharest";
  let units = "metric";

  async function populateCurrentDay(API_KEY) {
    let weatherData = await getWeatherData(city, units, API_KEY);

    console.log(weatherData);
    //left container
    let weather = document.querySelector(".weather");
    let location = document.querySelector(".location");
    let temperature = document.querySelector(".temperature");
    weather.innerHTML = weatherData.weather[0].main;
    location.innerHTML = weatherData.name;
    temperature.innerHTML = weatherData.main.temp + "°" + "C";

    //get current time
    let dateTime = new Date(weatherData.dt * 1000);
    let date = document.querySelector(".date");
    date.innerHTML = dateTime.toLocaleString();

    //populate right side
    let feelsLike = document.querySelector(".feels-like");
    let humidity = document.querySelector(".humidity");
    let windSpeed = document.querySelector(".wind-speed");

    feelsLike.innerHTML = weatherData.main.feels_like + "°" + "C";
    humidity.innerHTML = weatherData.main.humidity;
    windSpeed.innerHTML = weatherData.wind.speed;
  }

  async function populateWeeklyData(API_KEY) {
    let weatherData = await getWeatherData(city, units, API_KEY);

    //lat and lon
    let lat = weatherData.coord.lat;
    let lon = weatherData.coord.lon;

    let weatherDataWeek = await getWeatherDataWeek(lat, lon, units, API_KEY);
    console.log(weatherDataWeek);

    let weeklyWeather = document.querySelector(".weekly-weather");
    console.log(weatherDataWeek.daily[3].sunrise)
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
        +weatherDataWeek.daily[i].temp.min
      );
      let maxElement = helperFunctions.createElement(
        "div",
        "max-temp",
        weatherDataWeek.daily[i].temp.max
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

  return { populateCurrentDay, populateWeeklyData };
})();

const helperFunctions = (() => {
  function getDayName(dateStr, locale) {
    var date = new Date(dateStr*1000);
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

DOMManipulation.populateCurrentDay(API_KEY);
DOMManipulation.populateWeeklyData(API_KEY);
//getWeatherDataWeek('bucharest','metric')
