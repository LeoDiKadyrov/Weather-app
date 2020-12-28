const api = {
    key: "85b5310fd387069f52766ed34e2ca86d",
    baseurl: "https://api.openweathermap.org/data/2.5/"
}

const weatherSlides = document.querySelectorAll(".slide")
const cityNames = document.querySelectorAll(".slide__city")
const slideDate = document.querySelectorAll(".slide__date")
const weatherInfo = document.querySelectorAll(".slide__current")


const defaultCities = ["London", "Paris", "New York", "Moscow", "Beijing"]
const searchBox = document.querySelector(".weather__search")
searchBox.addEventListener("keypress", setQuery)

function setQuery(event) {
    if (event.keyCode == 13) {
        getResults(searchBox.value) 
    }
} 

function getResults(query) {
    fetch(`${api.baseurl}weather?q=${query}&units=metric&APPID=${api.key}`)
        .then(weather => {
            if (!weather.ok) {
                alert("Нет такого города")
                throw new Error("HTTP status " + weather.status)
            }
            return weather.json()
        }).then(displayResults)
}

function displayResults(weather) {
    if (weather.name.length > 15) {
        cityNames[slideIndex].classList.add("slide__big--cityName")
    }
    cityNames[slideIndex].innerText = `${weather.name}, ${weather.sys.country}`
    tempChanger(weather, slideIndex) // slideIndex from slider.js, tells us on what slide we are now
}

function setDefaultCities() {
    for (let i = 0; i < cityNames.length; i++) {
        cityNames[i].innerText = defaultCities[i]
        slideDate[i].innerText = dateBuilder()
    }
}

function dateBuilder() {
    let currentDate = new Date();
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December']
    let daysInWeek = ['Sunday', 'Monday', 'Tuesday', 
    'Wednesday', 'Thursday', 'Friday', 'Saturday']
    let day = daysInWeek[currentDate.getDay()]
    let date = currentDate.getDate()
    let month = months[currentDate.getMonth()]
    let year = currentDate.getFullYear()

    return `${day} ${date} ${month} ${year}`
}

function getDefaultWeather() {
    for (let i = 0; i < defaultCities.length; i++) {
        fetch(`${api.baseurl}weather?q=${defaultCities[i]}&units=metric&APPID=${api.key}`)
        .then(weather => {
            return weather.json()
        }).then(setDefaultWeather)
    }
}

function setDefaultWeather(weather) {
    if (weather.name == "London") {
        tempChanger(weather, 0)
    } else if (weather.name == "Paris") {
        tempChanger(weather, 1)
    } else if (weather.name == "New York") {
        tempChanger(weather, 2)
    } else if (weather.name == "Moscow") {
        tempChanger(weather, 3)
    } else {
        tempChanger(weather, 4)
    }
}

function tempChanger(weather, index) {
    weatherInfo[index].childNodes[1].innerText = `${Math.round(weather.main.temp)}°c`
    weatherInfo[index].childNodes[3].innerText = weather.weather[0].main
    weatherInfo[index].childNodes[5].innerText = `${Math.round(weather.main.temp_min)}°c / 
                                            ${Math.round(weather.main.temp_max)}°c`
}

setDefaultCities()
getDefaultWeather()
