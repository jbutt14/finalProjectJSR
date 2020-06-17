// object to hold user lat/lon/note
//THIS IS VERY IMPORTANT... it creates a GLOBAL object, so that it can be used later (see success function)
const locationData = {};

mapInit()

//create map and show all markers from db
async function mapInit() {
  // set map default view to contiguous 48 states
  let map = L.map('map').setView(['39.5', '-98.35'], 4);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  //grab the data for displaying map markers (next)
  const url = '/show'
  const data = await fetch(url) //follow the '/show' path... querying our own server
  const locationData = await data.json() //convert the data into js
  console.log('database data received')

  // show markers based on db data
  for(let i=0; i < locationData.length; i++){    
    L.marker([parseFloat(locationData[i].lat), parseFloat(locationData[i].lon)]).addTo(map)
      .bindPopup(locationData[i].name)
      .on('click', onClick)
    //In the above line of code "parseFloat" turns our data strings into integers (our lat and lon are being stored as strings in db)
  }

}

//each time a marker is clicked return lat and long and send to OpenWeather API
async function onClick(e) {
  let latitude = JSON.stringify(this.getLatLng().lat)
  let longitude = JSON.stringify(this.getLatLng().lng)
  let park = this.getPopup()._content; //capture park name

  console.log(`${park} National Park Latitude: ${latitude} Longitude: ${longitude}`)

  // const weatherAPI = process.env.WEATHERAPIKEY
  let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly&appid=34290148f37c39fd0ac4f3eda7ba674d`
  
  //----------------
  //HIDE API KEY ONCE VERIFIED IT'S WORKING!!!!!!!!!
  //----------------

  let res = await fetch(url)
  let weatherData = await res.json()
  console.log(weatherData);

  setWeatherData(weatherData, park)
}

function setWeatherData(weatherData, parkName){
  let tempInF = (((weatherData.current.temp - 273.15) * 9/5) + 32).toFixed(1) //convert Kelvin to F
  let feelsLike = (((weatherData.current.feels_like - 273.15) * 9/5) + 32).toFixed(1)
  let weatherIcon = weatherData.current.weather[0].icon;

  document.getElementById("park_name").innerHTML = `${parkName} National Park` ;
  document.getElementById("weather_image").src = `http://openweathermap.org/img/wn/${weatherIcon}@2x.png`;
  document.getElementById("weather_details").innerHTML = 
    `Current Temperature: ${tempInF} degrees F </br>
    Feels like: ${feelsLike} degrees F `;

}

// calls location on server side
// async function showWeather() {
//     console.log('show weather clicked')

//     const weatherAPI = process.env.WEATHERAPI
//     let clickedLat = 
//     let clickedLon = 

//     let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${clickedLat}&lon=${clickedLon}&
//     exclude={part}&appid=${weatherAPI}`

//     await fetch(url) 

//     // console.log('add data done');
// }

