//fancy way to import a file/module
const { MongoClient } = require('mongodb')

//connection to mongoDB
class MongoDBInstance {
    //every time we create an instance of this class we do what's inside the contructor!
    constructor() {
        const mongopass = process.env.MONGOPASS //grab password from .env file
        const mongouser = process.env.MONGOUSER //grab username from .env file
        this.uri = `mongodb+srv://${mongouser}:${mongopass}@cluster0-wmdd1.mongodb.net/<dbname>?retryWrites=true&w=majority`
    }
 
    //connect to our mongoDb
    async init(){
        //this will connect to our database
        const client = await MongoClient.connect(this.uri, { useUnifiedTopology: true });
        //if it doesn't exist, create "notesApps"...if it DOES exist, navigate to it
        const db = client.db('natparks')
        //a mognoDB 'collection' is basically like a data table in FM... create or navigate to (if already exists)
        const parkLocations = db.collection('parkLocations')

        this.parkLocations = parkLocations
        this.db = db

        console.log('connected to database')
    }
}
//export this file (code) for use elsewhere ... creating it as a new instance of the class
module.exports = new MongoDBInstance();