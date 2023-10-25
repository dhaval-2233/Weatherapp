const wrapper = document.querySelector(".wrapper"),
  inputPart = wrapper.querySelector(".input-part"),
  infoTxt = inputPart.querySelector(".info-txt"),
  inputField = inputPart.querySelector("input"),
  locationBtn = inputPart.querySelector("button"),
  wIcons = document.querySelector(".weather-part img"),
  arrowBack = wrapper.querySelector("header i");

let api;

inputField.addEventListener("keyup", (e) => {
  // if user pressed enter btn and input value is not empty
  if (e.key == "Enter" && inputField.value != "") {
    requestApi(inputField.value);
  }
});

locationBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    // if browser support geological api
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  } else {
    alert("Your Browser doesn't support geological api");
  }
});

function onSuccess(position) {
  const apiKey = "b18bdaf5b1abb97ac271d680a7461b59";
  const { latitude, longitude } = position.coords; // getting lat and lon od the user device from coords obj
  api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
  fetchData();
}

function onError(error) {
  infoTxt.innerText = error.message;
  infoTxt.classList.add("error");
}

function requestApi(city) {
  const apiKey = "b18bdaf5b1abb97ac271d680a7461b59";
  api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  fetchData();
}

function fetchData() {
  infoTxt.innerText = "Getting weather details....";
  infoTxt.classList.add("pending");
  // getting api response and returning it with parshing into js obj and in another
  // then function calling weatherDetails function with passingapi result as an argument
  fetch(api)
    .then((response) => response.json())
    .then((result) => weatherDetails(result));
}

function weatherDetails(info) {
  infoTxt.classList.replace("pending", "error");
  if (info.cod == "404") {
    infoTxt.innerText = `${inputField.value} is not a valid city name`;
  } else {
    // lets get requird value from info obj
    const city = info.name;
    const country = info.sys.country;
    const { description, id } = info.weather[0];
    const { feels_like, humidity, temp } = info.main;

    if (id == 800) {
      wIcons.src = "clear.png";
    } else if (id >= 200 && id <= 232) {
      wIcons.src = "storm.png";
    } else if (id >= 600 && id <= 622) {
      wIcons.src = "snow.png";
    } else if (id >= 701 && id <= 781) {
      wIcons.src = "haze.png";
    } else if (id >= 801 && id <= 804) {
      wIcons.src = "cloud.png";
    } else if (id >= 300 && id <= 321) {
      wIcons.src = "rain.png";
    }

    // passing these values to a particular html elements
    wrapper.querySelector(".temp .numb").innerText = Math.floor(temp);
    wrapper.querySelector(".weather").innerText = description;
    wrapper.querySelector(".location span").innerText = `${city}, ${country}`;
    wrapper.querySelector(".temp .numb-2").innerText = feels_like;
    wrapper.querySelector(".humidity span").innerText = `${humidity}%`;

    infoTxt.classList.remove("pending", "error");
    wrapper.classList.add("active");
    console.log(info);
  }
}

arrowBack.addEventListener("click", () => {
  wrapper.classList.remove("active");
});
