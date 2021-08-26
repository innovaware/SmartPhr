const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
// var MongoClient = require('mongodb').MongoClient;
// mongo = undefined;
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3000;

// const {
//     MONGO_USERNAME,
//     MONGO_PASSWORD,
//     MONGO_HOSTNAME,
//     MONGO_PORT,
//     MONGO_DB
//   } = process.env;

MONGO_USERNAME = "innova";
MONGO_PASSWORD = "innova2019";
MONGO_HOSTNAME = "vps-d76f9e1c.vps.ovh.net";
MONGO_PORT = "27017";
MONGO_DB = "smartphr";


//'mongodb://innova:innova2019@192.168.1.10:27017/smartphr?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false';
const mongoConnectionString = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

console.log("mongoConnectionString: ", mongoConnectionString);

// MongoClient.connect(mongoConnectionString, function(err, db) {
//   if (err) {
//     console.error("Connection db error: ", err)
//   }
//   mongo = db;
// });

mongoose.connect(mongoConnectionString,
  {
    useNewUrlParser: true
  }, () => console.log("Connected to DB"));

// Pazienti API
const pazientiRouter = require("./routes/pazienti");
app.use("/api/pazienti", pazientiRouter);

// Dipendenti API
const dipendentiRouter = require("./routes/dipendenti");
app.use("/api/dipendenti", dipendentiRouter);

// Consulenti API
const consulentiRouter = require("./routes/consulenti");
app.use("/api/consulenti", consulentiRouter);

// Fornitori API 
const fornitoriRouter = require("./routes/fornitori");
app.use("/api/fornitori", fornitoriRouter);

// ASP API 
const aspRouter = require("./routes/asp");
app.use("/api/asp", aspRouter);

// Farmaci API
const farmaciRouter = require("./routes/farmaci");
app.use("/api/farmaci", farmaciRouter);


app.listen(PORT, () =>
  console.log(`Innova Backend App listening on port ${PORT}!`)
);
