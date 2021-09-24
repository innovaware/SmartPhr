"use strict";
exports.__esModule = true;
var nextcloud_node_client_1 = require("nextcloud-node-client");
var express = require("express");
const basicAuth = require("express-basic-auth");
const user = require("./models/user");

var bodyParser = require("body-parser");
var cors = require("cors");

const fileUpload = require("express-fileupload");

// var MongoClient = require('mongodb').MongoClient;
// mongo = undefined;
var mongoose = require("mongoose");
var app = express();
var PORT = process.env.PORT || 3000;

console.log("args:", process.argv);

const redis = require("redis");
const redisPort = process.env.REDISPORT || 6379;
const redisHost = process.env.REDISHOST || "redis";
const redisDisabled = process.env.REDISDISABLE === "true" || false;
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;


console.log(`Redis Host ${redisHost}:${redisPort}`);
const client_redis = redis.createClient(redisPort, redisHost);

app.use(cors());
app.use(
  basicAuth({
    authorizer: (username, password, next) => {
      // const userMatches = basicAuth.safeCompare(username, "customuser");
      // const passwordMatches = basicAuth.safeCompare(password, "customuser");
      var userMatches = false;
      var passwordMatches = false;
      var result_authorization = false;

      getUser(username, password).then(
        user => {
          userMatches = user.username != undefined && user.active == true;
          passwordMatches = user.password != undefined;
          result_authorization = userMatches & passwordMatches;
          return next(null, result_authorization);
        })
        .catch(err => {
          return next(null, result_authorization);
        })

      // try {
      //   const searchTerm = `AUTH${username}${password}`;
      //   // console.log("Redis find: " + searchTerm);

      //   client_redis.get(searchTerm, async (err, data) => {
      //     if (err) throw err;

      //     // console.log("Redis data: " + searchTerm, data);

      //     if (data && !redisDisabled) {
      //       var user_find = JSON.parse(data);
      //       userMatches =
      //         user_find.username != undefined && user_find.active == true;
      //       passwordMatches = user_find.password != undefined;

      //       // console.log("user_find: ", user_find);
      //       // console.log("userMatches: ", userMatches);
      //       // console.log("passwordMatches: ", passwordMatches);
      //       result_authorization = userMatches & passwordMatches;
      //     } else {
      //       const users_find = await user.find({
      //         $and: [{ username: username }, { password: password }],
      //       });

      //       // console.log(`Mongo ${searchTerm} length: ${user_find.length}`);
      //       if (users_find.length > 0) {
      //         let user_find = users_find[0];

      //         client_redis.setex(
      //           searchTerm,
      //           redisTimeCache,
      //           JSON.stringify(user_find)
      //         );

      //         userMatches =
      //           user_find.username != undefined && user_find.active == true;
      //         passwordMatches = user_find.password != undefined;

      //         result_authorization = userMatches & passwordMatches;

      //         // console.log("user_find: ", user_find);
      //         // console.log("userMatches: ", userMatches);
      //         // console.log("passwordMatches: ", passwordMatches);
      //         console.log(
      //           `User ${username} authorized ${result_authorization}`
      //         );
      //       } else {
      //         userMatches = false;
      //         passwordMatches = false;
      //         console.log(`User ${username}:${password} not authorized`);
      //         // const u = new user({
      //         //   group: "",
      //         //   username: "dan",
      //         //   password: "dan",
      //         //   active: true,
      //         // });

      //         // console.log("Insert data " + searchTerm, u);
      //         // u.save()
      //         //   .then((x) => {
      //         //     console.log("Save user: ", x);
      //         //   })
      //         //   .catch((err) => {
      //         //     console.error(err);
      //         //   });
      //         result_authorization = userMatches & passwordMatches;
      //       }
      //     }

      //     return next(null, result_authorization);
      //   });
      // } catch (err) {
      //   console.error(err);
      //   return next(null, result_authorization);
      // }
    },
    authorizeAsync: true,
  })
);

function getUser(username, password) {
  return new Promise((resolve, reject) => {
    const searchTerm = `AUTH${username}${password}`;
    client_redis.get(searchTerm, async (err, data) => {
      if (err) { reject(err); return; }

      if (data && !redisDisabled) {
        var user_find = JSON.parse(data);
        console.log("user:", user_find);
        resolve(user_find);

      } else {
        const users_find = await user.find({
          $and: [{ username: username }, { password: password }],
        });

        // console.log(`Mongo ${searchTerm} length: ${user_find.length}`);
        if (users_find.length > 0) {
          let user_find = users_find[0];

          client_redis.setex(
            searchTerm,
            redisTimeCache,
            JSON.stringify(user_find)
          );
          
          console.log("user:", user_find);
          resolve(user_find);
        } else {
          reject("Not found");
        }
      }
    });
  });
}

// enable files upload
app.use(
  fileUpload({
    createParentPath: true,
  })
);

// const {
//     MONGO_USERNAME,
//     MONGO_PASSWORD,
//     MONGO_HOSTNAME,
//     MONGO_PORT,
//     MONGO_DB,
//     NEXTCLOUD_HOST,
//     NEXTCLOUD_USER,
//     NEXTCLOUD_PASW
//   } = process.env;
var NEXTCLOUD_HOST = "http://smart-iphr.innovaware.it:8081";
var NEXTCLOUD_USER = "admin";
var NEXTCLOUD_PASW = "admin";


var MONGO_USERNAME = "innova";
var MONGO_PASSWORD = "innova2019";
var MONGO_HOSTNAME = "vps-d76f9e1c.vps.ovh.net";
var MONGO_PORT = "27017";
var MONGO_DB = "smartphr";
//'mongodb://innova:innova2019@192.168.1.10:27017/smartphr?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false';
var mongoConnectionString = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());



// console.log("Prometheus Client init")
// const Prometheus = require('prom-client');
// const register = new Prometheus.Registry()
// // Add a default label which is added to all metrics
// register.setDefaultLabels({
//   app: 'backend-app-metrics'
// })

// // Enable the collection of default metrics
// Prometheus.collectDefaultMetrics({ register })

// // Metrics endpoint
// app.get('/metrics', async (req, res) => {

//   console.log("req:", req.header);
//   res.set('Content-Type', Prometheus.register.contentType)
//   res.send(await Prometheus.register.metrics())
//   //res.end(Prometheus.register.metrics())
// })


var logHandler = function (req, res, next) {
  //console.log(req.url);
  next();
};

console.log("mongoConnectionString: ", mongoConnectionString);
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
  basicAuth: { password: NEXTCLOUD_PASW, username: NEXTCLOUD_USER },
  url: NEXTCLOUD_HOST,
});
var client = new nextcloud_node_client_1["default"](server);
client.getSystemInfo().then(function (x) {
  //console.log("System Information:", x);
});

// Scrittura file su nextCloud
var writeHandler = function (req, res, next) {
  let result = res.locals.result;
  console.log("result", result);
  // let root = `${result.path[0]}`;
  let root = `${result.path}`;

  console.log("root", root);
  client
    .createFolder(root)
    .then((folder) => {
      folder.createFile(result.name, result.file.data).then((file) => {
        file.addTag(result.typeDocument);
        file.addTag(`paziente ${root}`);
        //file.addComment("");

        res.status(200);
        res.json({ result: result });
      });
    })
    .catch((err) => {
      res.status(500);
      res.json({ result: err });
    });
};

// Lettura file da nextCloud
var readHandler = function (req, res, next) {
  let fileName = decodeURIComponent(req.query.fileName);

  console.log("req.query: ", req.query);
  console.log("Filename: ", fileName);
  client
    .getContent(fileName)
    .then((data) => {

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': "attachment; filename=" + `${fileName}.pdf`,
        'Content-Length': data.length,
      })

      res.end(data);
      // res.end(Buffer.from(data, "base64"));
    })
    .catch((err) => {
      res.status(500);
      res.json({ result: err });
    });
};

// Pazienti API
var pazientiRouter = require("./routes/pazienti");
app.use("/api/pazienti", logHandler, pazientiRouter);
// Dipendenti API
var dipendentiRouter = require("./routes/dipendenti");
app.use("/api/dipendenti", logHandler, dipendentiRouter);
// Consulenti API
var consulentiRouter = require("./routes/consulenti");
app.use("/api/consulenti", logHandler, consulentiRouter);
// Fornitori API
var fornitoriRouter = require("./routes/fornitori");
app.use("/api/fornitori", logHandler, fornitoriRouter);
// ASP API
var aspRouter = require("./routes/asp");
app.use("/api/asp", logHandler, aspRouter);
// Farmaci API
var farmaciRouter = require("./routes/farmaci");
app.use("/api/farmaci", logHandler, farmaciRouter);
// Eventi API
var eventiRouter = require("./routes/eventi");
app.use("/api/eventi", logHandler, eventiRouter);

var uploadRouter = require("./routes/upload");
app.use("/api/upload", logHandler, uploadRouter, writeHandler);
app.use("/api/files", logHandler, uploadRouter);

app.get("/api/download", logHandler, readHandler);

// Fatture API
var fattureRouter = require("./routes/fatture");
app.use("/api/fatture", logHandler, fattureRouter);

// NotaCredito API
var notacreditoRouter = require("./routes/notacredito");
app.use("/api/notacredito", logHandler, notacreditoRouter);

// Bonifici API
var bonificiRouter = require("./routes/bonifici");
app.use("/api/bonifici", logHandler, bonificiRouter);

// Menu API
var menuRouter = require("./routes/menu");
app.use("/api/menu", logHandler, menuRouter);

app.listen(PORT, function () {
  return console.log("Innova Backend App listening on port " + PORT + "!");
});
