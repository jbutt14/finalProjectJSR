/*
Hey Kyle and Peter:
I've left myself a lot of overly long comments to help when I reference these files in the future.
Please ignore the length of my comments, it's really their content that's important, but I had to
write it in "real" terms so I would later know what I'm talking about. I obviously understand that
many of them would be verbose for an actual application, but this is mainly for my future benefit.
Thanks!
*/

// object to hold user lat/lon/note
//THIS IS VERY IMPORTANT... it creates a GLOBAL object, so that it can be used later (see success function)
const locationData = {};

//create map and show all markers from db ... IIFE
(async function mapInit() {
  // set map default view to contiguous 48 states
  let map = L.map('map').setView(['39.5', '-98.35'], 4);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  //grab the data for displaying map markers
  const url = '/show' //see index.js for reference... fetches the mongoDB location data
  const data = await fetch(url) //grab data from mongoDB on '/show' path
  const locationData = await data.json() //convert the data into js
  console.log('database data received')

  // show markers based on db data, loop through data set
  for(let i=0; i < locationData.length; i++){    
    //In the below line of code "parseFloat" turns our data strings into integers (our lat and lon are being stored as strings in db)
    L.marker([parseFloat(locationData[i].lat), parseFloat(locationData[i].lon)]).addTo(map)
      .bindPopup(locationData[i].name) //set park name to what is displayed in pop up marker
      .on('click', onClick)
  }
})()

//each time a marker is clicked return lat, long, and park name and send to OpenWeather API
async function onClick(e) {
  let latitude = JSON.stringify(this.getLatLng().lat) //grab lat from clicked marker
  let longitude = JSON.stringify(this.getLatLng().lng) //grab lon from clicked marker
  let park = this.getPopup()._content; //capture park name

  console.log(`${park} National Park Latitude: ${latitude} Longitude: ${longitude}`) //verify clicked lat and lon

  weatherCall()

  //perform API call on server
  async function weatherCall(){
    const url = `weather/${latitude}/${longitude}` //pass lat and long
    const res = await fetch(url); //perform API call
    const weatherData = await res.json()

    setWeatherData(weatherData, park) //function to display weather data
  }
}

//set HTML items to weather content
function setWeatherData(weatherData, parkName){
  //function for converting temps from kelvin to Fahr
  function convert(temp){
    let fahr = ((temp - 273.15) * 9/5) + 32
    return fahr
  }
  
  //convert temps from K to F; load image name from weatherAPI
  let tempInF = convert(weatherData.current.temp).toFixed(1);
  let feelsLike = convert(weatherData.current.feels_like).toFixed(1)
  let weatherIcon = weatherData.current.weather[0].icon;

  document.getElementById("park_name").innerHTML = `${parkName} National Park` ; //set heading with name of national park
  document.getElementById("weather_image").src = `http://openweathermap.org/img/wn/${weatherIcon}@2x.png`; //display an icon of the weather
  document.getElementById("weather_details").innerHTML = 
    `Current Temperature: ${tempInF} degrees F </br>
    Feels like: ${feelsLike} degrees F `; //display current temp and "feels like" temp

}


 