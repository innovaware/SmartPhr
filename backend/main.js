"use strict";
exports.__esModule = true;
var nextcloud_node_client_1 = require("nextcloud-node-client");
var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");

const fileUpload = require('express-fileupload');

// var MongoClient = require('mongodb').MongoClient;
// mongo = undefined;
var mongoose = require("mongoose");
var app = express();
var PORT = process.env.PORT || 3000;


// enable files upload
app.use(fileUpload({
    createParentPath: true
}));

// const {
//     MONGO_USERNAME,
//     MONGO_PASSWORD,
//     MONGO_HOSTNAME,
//     MONGO_PORT,
//     MONGO_DB
//   } = process.env;
var MONGO_USERNAME = "innova";
var MONGO_PASSWORD = "innova2019";
var MONGO_HOSTNAME = "vps-d76f9e1c.vps.ovh.net";
var MONGO_PORT = "27017";
var MONGO_DB = "smartphr";
//'mongodb://innova:innova2019@192.168.1.10:27017/smartphr?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false';
var mongoConnectionString = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;
  
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

console.log("mongoConnectionString: ", mongoConnectionString);

var logHandler = function (req, res, next) {
  console.log(req.url);
  next();
};

mongoose.connect(
  mongoConnectionString,
  {
    useNewUrlParser: true,
  },
  function () {
    return console.log("Connected to DB");
  }
);

// uses explicite credentials
var server = new nextcloud_node_client_1.Server({
    basicAuth: { password: "admin", username: "admin" },
    url: "http://smart-iphr.innovaware.it:8081",
  });
var client = new nextcloud_node_client_1["default"](server);
client.getSystemInfo().then(function (x) {
//console.log("System Information:", x);
});

var writeHandler = function (req, res, next) {
    let result = res.locals.result;
    console.log("result", result);
    let root = `${result.path[0]}`;
        
    console.log("root", root);
    client.createFolder(root)
    .then( folder=> {

        folder.createFile(result.name, result.file.data).then(
            file => {
                file.addTag(result.typeDocument);
                file.addTag(`paziente ${root}`);

                res.status(200);
                res.json({ result: result });
            }
        )
    })
};


// Pazienti API
var pazientiRouter = require("./routes/pazienti");
app.use("/api/pazienti",logHandler,  pazientiRouter);
// Dipendenti API
var dipendentiRouter = require("./routes/dipendenti");
app.use("/api/dipendenti", logHandler, dipendentiRouter);
// Consulenti API
var consulentiRouter = require("./routes/consulenti");
app.use("/api/consulenti", logHandler, consulentiRouter);
// Fornitori API
var fornitoriRouter = require("./routes/fornitori");
app.use("/api/fornitori",logHandler,  fornitoriRouter);
// ASP API
var aspRouter = require("./routes/asp");
app.use("/api/asp", logHandler, aspRouter);
// Farmaci API
var farmaciRouter = require("./routes/farmaci");
app.use("/api/farmaci",logHandler,  farmaciRouter);
// Eventi API
var eventiRouter = require("./routes/eventi");
app.use("/api/eventi", logHandler, eventiRouter);

var uploadRouter = require("./routes/upload");
app.use("/api/upload", logHandler, uploadRouter, writeHandler);



// create folder
// client.createFolder("/products/brooms")
// .then( folder=> {
//     folder.createSubFolder("soft brooms");
// })

app.listen(PORT, function () {
  return console.log("Innova Backend App listening on port " + PORT + "!");
});
