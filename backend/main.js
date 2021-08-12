const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
var MongoClient = require('mongodb').MongoClient;
mongo = undefined;

const app = express();
const PORT = process.env.PORT || 3000;

// const {
//     MONGO_USERNAME,
//     MONGO_PASSWORD,
//     MONGO_HOSTNAME,
//     MONGO_PORT,
//     MONGO_DB
//   } = process.env;

MONGO_USERNAME = "innova"
MONGO_PASSWORD = "innova2019"
MONGO_HOSTNAME = "vps-d76f9e1c.vps.ovh.net"
MONGO_PORT = "27017"
MONGO_DB = "smartphr"
//'mongodb://innova:innova2019@192.168.1.10:27017/smartphr?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false';
const mongoConnectionString = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;


app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

console.log("mongoConnectionString: ", mongoConnectionString);

MongoClient.connect(mongoConnectionString, function(err, db) {
  if (err) {
    console.error("Connection db error: ", err)
  }
  mongo = db;
});

// Pazienti API
app.get('/api/pazienti', (req, res) => {
    mongo.collection('pazienti').find().toArray(function(err, result) {
        // console.log(result);
        res.json(result);
    });
});

// Dipendenti API

app.get('/api/dipendenti', (req, res) => {
  mongo.collection('dipendenti').find().toArray(function(err, result) {
      // console.log(result);
      res.json(result);
  });
});

// Consulenti API
app.get('/api/consulenti', (req, res) => {
  mongo.collection('consulenti').find().toArray(function(err, result) {
      // console.log(result);
      res.json(result);
  });
});

// Farmaci API

app.get('/api/farmaci', (req, res) => {
  mongo.collection('farmaci').find().toArray(function(err, result) {
      // console.log(result);
      res.json(result);
  });
});



app.listen(PORT, () => console.log(`Innova Backend App listening on port ${PORT}!`))