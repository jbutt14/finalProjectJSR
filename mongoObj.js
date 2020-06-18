//fancy way to import a file/module
const { MongoClient } = require('mongodb')

//connection to mongoDB ... literally creating an instance of our database connection
class MongoDBInstance {
    //every time we create an instance of this class we do what's inside the contructor!
    //a constructor is what tells you what the class "is"
    constructor() {
        const mongopass = process.env.MONGOPASS //grab password from .env file
        const mongouser = process.env.MONGOUSER //grab username from .env file
        this.uri = `mongodb+srv://${mongouser}:${mongopass}@cluster0-wmdd1.mongodb.net/<dbname>?retryWrites=true&w=majority` //grabbed from mongoDB "Connecting"
    }
 
    //connect to our mongoDb
    //next function is what this class "does"
    async init(){
        //this will connect to our database
        const client = await MongoClient.connect(this.uri, { useUnifiedTopology: true });
        //if it doesn't exist, create "natParks" db...if it DOES exist, navigate to it
        const db = client.db('natparks')
        //a mognoDB 'collection' is basically like a data table... create or navigate to (if already exists)
        const parkLocations = db.collection('parkLocations')

        this.parkLocations = parkLocations
        this.db = db

        console.log('connected to database')
    }
}
//export this file (code) for use elsewhere ... creating it as a new instance of the class
module.exports = new MongoDBInstance();