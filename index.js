//Express server setup
const express = require('express');
const app = express();
const port = 4000;
//statis files are in 'public'
app.use(express.static('public'))

//set up dotenv, which is going to help us hide our API key
require('dotenv').config()

//import an instance of database conenction
const database = require('./mongoObj')
database.init() //'.init' is in the mongoObj.js file

//root
app.get('/', (req, res) => {
    res.sendFile(path.join`${__dirname}/index.html`) 
});

//GET/read data ... we need to call this as the user loads the page (map initialization) since it's displaying location dots
app.get('/show', async (req, res) => {
    const data = await database.parkLocations.find().toArray()
    res.json(data) //send data in json format to the client
})

//Listen on port 4000
app.listen(port, () => console.log(`National Parks Info App listening at http://localhost:${port}`))