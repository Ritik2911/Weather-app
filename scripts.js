const API_key = "2804968175dd5ef672eb4febd13c2ee5";
const yourWeatherBtn = document.querySelector("[youWeather]");
const searchWeatherBtn = document.querySelector("[searchWeatherMode]");
const weatherDetails = document.querySelector("[weatherDetails]");
const searchWeatherField = document.querySelector("[searchWeatherField]");
const cityNameSpan = document.querySelector("[cityNameSpan]");
const countryFlagSpan = document.querySelector("[countryFlagSpan]");
const weatherDescription = document.querySelector("[weatherDescription]");
const temperatureDisplay = document.querySelector("[temperatureDisplay]");
const windSpeed = document.querySelector("[windSpeed]");
const humidityPercentage = document.querySelector("[humidityPercentage]");
const cloudPercentage = document.querySelector("[cloudPercentage]");
const loading = document.querySelector("[loading]");
const searchInput = document.querySelector("[searchInput]");
const locationCoordsNotFound = document.querySelector(
  "[locationCoordsNotFound]"
);
const noLocationData = document.querySelector("[noLocationData]");
const weatherIcon = document.querySelector("[weatherIcon]");
const grantAccess = document.querySelector("[grantAccess");

let city = "mumbai";
let country = "";

let currentMode = 0;
let weatherData;

yourWeatherMode();

async function yourWeatherMode() {
  if (currentMode != 1) {
    currentMode = 1;
    removeDisplay();
    loading.classList.add("activated");
    yourWeatherBtn.classList.add("btn-bg-change");

    const coordinates = sessionStorage.getItem("user-coordinates");

    if (coordinates) {
      let data = JSON.parse(coordinates);
      await getWeatherData(data);
      showYourWeather();
    } else {
      locationCoordsNotFound.classList.add("activated");
    }

    loading.classList.remove("activated");
  }
}

async function yourCurrentWeather() {
  const coordinates = sessionStorage.getItem("user-coordinates");

  if (coordinates) {
    let data = JSON.parse(coordinates);
    await getWeatherData(data);
  } else {
    locationCoordsNotFound.classList.add("activated");
  }
}

async function getWeatherData(cordinates) {
  try {
    weatherData = await getCusotmWeather(cordinates);
    updateUI();
    await getFlag();
  } catch (err) {
    noLocationData.classList.add("activated");
    noLocationData.classList.add("tranlateY");
    throw err;
  }
}

function showYourWeather() {
  weatherDetails.classList.add("activated");
  weatherDetails.classList.add("tranlateY");
}

function searchWeatherMode() {
  if (currentMode != 0) {
    currentMode = 0;
    removeDisplay();
    searchWeatherField.classList.add("activated");
    searchWeatherBtn.classList.add("btn-bg-change");
  }
}

function updateUI() {
  
  country = weatherData.sys.country;
  country = weatherData.sys.country;
  weatherDescription.innerHTML =weatherData?.weather[0]?.description;

  temperatureDisplay.innerHTML = weatherData?.main?.temp + " C";

  windSpeed.innerHTML = weatherData?.wind?.speed + " m/s";

  cloudPercentage.innerHTML = weatherData?.clouds?.all + "%";

  humidityPercentage.innerHTML = weatherData?.main?.humidity + "%";

  cityNameSpan.innerHTML = weatherData?.name;

  weatherIcon.src = `http://openweathermap.org/img/w/${weatherData?.weather?.[0]?.icon}.png`;
}

async function searchWeather() {
  console.log(searchInput.value);
  city = searchInput.value;
  noLocationData.classList.remove("activated");

  weatherDetails.classList.remove("activated");
  loading.classList.add("activated");

  try {
    weatherData = await getWeatherCity();
    await getFlag();
    updateUI();
    weatherDetails.classList.add("activated");
  } catch (error) {
    noLocationData.classList.add("activated");
  }

  loading.classList.remove("activated");
}

async function getCusotmWeather(cordinates) {
  try {
    const { lat, lon } = cordinates;

    console.log(lat, lon);

    let response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=metric`
    );
    let data = await response.json();
    return data;
  } catch (err) {}
}

async function getWeatherCity() {
  try {
    let response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=metric`
    );
    let data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    throw error;
  }
}

function removeDisplay() {
  countryFlagSpan.src = "";
  searchWeatherField.classList.remove("activated");
  searchWeatherBtn.classList.remove("btn-bg-change");
  weatherDetails.classList.remove("activated");
  noLocationData.classList.remove("activated");
  yourWeatherBtn.classList.remove("btn-bg-change");
  weatherDetails.classList.remove("tranlateY");
  locationCoordsNotFound.classList.remove("activated");
}

async function getFlag() {
  let response = await fetch(`https://restcountries.com/v3.1/alpha/${country}`);
  let data = await response.json();
  let flagSVG = data[0].flags.svg;
  countryFlagSpan.src = flagSVG;
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    // show an alert for no support available
  }
}

function showPosition(position) {
  const userCordinates = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  };
  sessionStorage.setItem("user-coordinates", JSON.stringify(userCordinates));
  currentMode = 0;
  yourWeatherMode();
}

grantAccess.addEventListener("click", getLocation);

// searchWeatherField.addEventListener("submit",searchWeather);
