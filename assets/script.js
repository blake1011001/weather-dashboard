var searchArea = document.querySelector('.search-area');
var currentWeather = document.querySelector('.current-weather');
var forecast = document.querySelector('#forecast');
var cityInput = document.querySelector('#city');
var searchBtn = document.querySelector('#search-button');

function titleCase(str) {
  var splitStr = str.toLowerCase().split(' ');
  for (var i = 0; i < splitStr.length; i++) {
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  return splitStr.join(' ');
}

function loadSearchHistory() {
  var searchHistoryArray = JSON.parse(localStorage.getItem('search history'));

  if(storage === null){
    storage = [];
}
if (!storage.includes(searchedCity)) {
    storage.push(searchedCity);
} else {
    fetchCityData();
}
localStorage.setItem('cityArray', JSON.stringify(storage));
for (var i = 0; i < storage.length; i++) {
    var savedLi = document.createElement('button');
    savedLi.textContent = storage[i];
    savedLi.setAttribute('id', storage[i]);
    savedContainer.append(savedLi);
    savedLi.addEventListener('click', function (event) {
        var clickedCity = event.target.id;
        fetchCityData(clickedCity);
    })
}
}

function fetchCityData(city) {
var apiKey = 'e220fa2fad64df94d4096c84ce021b3c';
var geoCodeUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&limit=1&appid=' + apiKey;
currentWeather.innerHTML = '';
forecast.innerHTML = '';
fetch(geoCodeUrl)
.then(function (response) {
    return response.json();
})
.then(function(weatherData) {
    console.log('this is my weather data', weatherData)
    var cityName = document.createElement('h2');
    var cityTemp = document.createElement('h3');
    var cityWind = document.createElement('h3');
    var cityHumidity = document.createElement('h3');
    var cityIconCode = weatherData.weather[0].icon;
    var latitude = weatherData.coord.lat;
    var longitude = weatherData.coord.lon;
    var weatherIcon = 'http://openweathermap.org' + cityIconCode + '@2x.png';
    
    var iconHouse = document.createElement('h2');
    iconHouse.innerHTML = '<img src="' + weatherIcon + '"' + '</img>';
    
    console.log(iconHouse)
    
    cityName.textContent = weatherData.name + ' (' + today + ')';
    currentWeather.append(cityName);
    currentWeather.append(iconHouse);
    
    cityTemp.textContent = 'Temperature: ' + Math.round((weatherData.main.temp-273.15) *9 /5 + 32) + '\xB0' + 'F';
    currentWeather.append(cityTemp);
    
    cityWind.textContent = 'Wind: ' + weatherData.wind.speed + ' MPH';
    currentWeather.append(cityWind);
    
    cityHumidity.textContent = 'Humidity: ' + weatherData.main.humidity + '%';
    currentWeather.append(cityHumidity);
    
    var getUV = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + latitude + '&lon=' + longitude + '&exclude={part}&appid=' + 'e220fa2fad64df94d4096c84ce021b3c'
    fetch(getUV)
    .then(function (response) {
        return response.json();
    })
    .then(function(uvResponse) {
        console.log('this is the uv', uvResponse);
        
        for (var i = 0; i < 5; i++) {
            var weatherForecast = document.createElement('div');
            var forecastDate = document.createElement('h4');
            var forecastTemp = document.createElement('h3');
            var forecastWind = document.createElement('h4');
            var forecastHumidity = document.createElement('h4');
            var forecastIcon = uvResponse.daily[0].weather[0].icon;
            var iconURL = 'http://openweathermap.org' + forecastIcon + '@2x.png';
            console.log(forecastIcon);
            
            forecast.append(weatherForecast);
            
            forecastDate.textContent = dayjs().add(i, 'day').format('M/D/YYYY');
            weatherForecast.append(forecastDate);
            weatherForecast.append(iconHouse);
            weatherForecast.classList.add('forecast-div');
            weatherForecast.classList.add('col');
            
            forecastTemp.textContent = 'Temp: ' + Math.round((uvResponse.daily[i].temp.day-273.15) *9 /5 + 32) + '\xB0' + 'F';
            weatherForecast.append(forecastTemp);
            
            forecastWind.textContent = 'Wind: ' + uvResponse.daily[i].wind_speed + ' MPH';
            weatherForecast.append(forecastWind);
            
            forecastHumidity.textContent = 'Humidity: ' + uvResponse.daily[i].humidity + '%';
            weatherForecast.append(forecastHumidity);
        }
    })
    
})

}

searchBtn.addEventListener('click', citySelection);
searchBtn.addEventListener('click', createHistory);