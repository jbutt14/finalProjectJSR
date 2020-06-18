//Express server setup
const express = require('express');
const app = express();
// const port = 4000;
//NOTE TO KYLE and PETER: I'M LEAVING THE HARD-CODE IN BUT COMMENTED OUT FOR MY FUTURE REFERENCE ONLY; PLEASE IGNORE

//static (CSS, HTML, script.js) files are in 'public' directory
app.use(express.static('public'))

//set up .env to hide API keys
require('dotenv').config()
const weatherAPI = process.env.WEATHERAPIKEY

const fetch = require("node-fetch");

//import an instance of database conenction
const database = require('./mongoObj') //require installation of mongoDB module
database.init() //'.init' is in the mongoObj.js file

//root path for loading site
app.get('/', (req, res) => {
    res.sendFile(path.join`${__dirname}/index.html`) 
});

//GET/read data ... we need to call this as the user loads the page (map initialization) since it's displaying location dots
app.get('/show', async (req, res) => {
    const data = await database.parkLocations.find().toArray() //grabs all the data in the 'parkLocations' collection on mongoDB
    res.json(data) //send data in json format to the client
})

//API call to openWeatherMap, taking in lat and lon as parameters ... send back to client, run on server to protect API key
app.get('/weather/:latitude/:longitude', async (req, res) =>{
    const lat = req.params.latitude
    const lon = req.params.longitude
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${weatherAPI}`
    const resp = await fetch(url);
    const data = await resp.json()
    res.json(data) //return weather data to client
})

//Listen on port 4000
// app.listen(port, () => console.log(`National Parks Info App listening at http://localhost:${port}`))
//against, left the above line in there for future reference, even though I understand the next line accounts for defaulting to port 4000

app.listen(process.env.PORT || 4000)