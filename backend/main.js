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

var VERSION = process.env.VERSION;

console.log("args:", process.argv);

const redis = require("redis");
const redisPort = process.env.REDISPORT || 6379;
const redisHost = process.env.REDISHOST || "redis";
const redisDisabled = process.env.REDISDISABLE === "true" || false;
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;

console.log(`Redis Host ${redisHost}:${redisPort}`);
const client_redis = redis.createClient(redisPort, redisHost);

// GESTIONE MAILER SERVICE
const mqtt = require("mqtt");
const hostMailerService = process.env.MAILERSERVICEHOST || "localhost"; 
const portMailerService = process.env.MAILERSERVICEPORT || "1883";
const clientIdMailerService = `mqtt_${Math.random().toString(16).slice(3)}`;
const connectUrlMailerService = `mqtt://${hostMailerService}:${portMailerService}`;


const clientMailerService = mqtt.connect(connectUrlMailerService, {
  clientIdMailerService,
  clean: true,
  connectTimeout: 4000,
  username: process.env.MAILERSERVICEUSERNAME || "test",
  password: process.env.MAILERSERVICEPASSWORD || "test",
  reconnectPeriod: 1000,
});

app.use(cors());
// app.use(
//   basicAuth({
//     authorizer: (username, password, next) => {
//       // const userMatches = basicAuth.safeCompare(username, "customuser");
//       // const passwordMatches = basicAuth.safeCompare(password, "customuser");
//       var userMatches = false;
//       var passwordMatches = false;
//       var result_authorization = false;

//       getUser(username, password)
//         .then((user) => {
//           userMatches = user.username != undefined && user.active == true;
//           passwordMatches = user.password != undefined;
//           result_authorization = userMatches & passwordMatches;
//           return next(null, result_authorization);
//         })
//         .catch((err) => {
//           return next(null, result_authorization);
//         });
//     },
//     authorizeAsync: true,
//   })
// );

const getAuth = (req) => {
  var authheader = req.headers.authorization;
  if (!authheader) {
    return null;
  }

  var auth = new Buffer.from(authheader.split(" ")[1], "base64")
    .toString()
    .split(":");
  var username = auth[0];
  var password = auth[1];

  return { user: username, password: password };
};

const authorizationHandler = async (req, res, next) => {
  const user_auth = getAuth(req);

  if (user_auth == null) {
    var err = new Error("You are not authenticated!");
    res.setHeader("WWW-Authenticate", "Basic");
    err.status = 401;
    return next(err);
  }

  var username = user_auth.user;
  var password = user_auth.password;

  var userMatches = false;
  var passwordMatches = false;
  var result_authorization = false;
  getUser(username, password)
    .then((user) => {
      userMatches = user.username != undefined && user.active == true;
      passwordMatches = user.password != undefined;
      result_authorization = userMatches & passwordMatches;

      if (!result_authorization) {
        res.statusCode = 401;
        res.setHeader("WWW-Authenticate", "Basic");
        res.end("Not Authorizated");

        console.log("[AUTHORIZATIONHANDLER] User not authorized");
      } else {
        res.locals.auth = user;
        // console.log(`[AUTHORIZATIONHANDLER] res.locals.auth:`, res.locals.auth);
        return next(null, result_authorization);
      }
    })
    .catch((err) => {
      // return next(null, result_authorization);
      res.statusCode = 401;
      res.setHeader("Content-Type", "text/plain");
      res.end("Not Authorizated");
    });
};

function getUser(username, password) {
  return new Promise((resolve, reject) => {
    const searchTerm = `AUTH${username}${password}`;

    client_redis.get(searchTerm, async (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      if (data && !redisDisabled) {
        // console.log(`[GETUSER] Get from REDIS searchTerm:${searchTerm}`);
        var user_find = JSON.parse(data);
        //console.log("user:", user_find);
        resolve(user_find);
      } else {
        console.log(`[GETUSER] Get from MONGODB searchTerm:${searchTerm}`);
        // var user_insert = new user({
        //   group: "123",
        //   username: username,
        //   password: password,
        //   active: true,
        //   role: "Admin",
        // });
        // const result = await user_insert.save();

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

          resolve(user_find);
        } else {
          reject("Not found");
        }
      }
    });
  });
}

function checkAuthRole(user) {
  if (user != undefined) return user.role == "Admin";

  return false;
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

var roleHandler = async (req, res, next) => {
  // console.log(`[ROLEHANDLER] Check Role for USER`);
  // console.log(`[ROLEHANDLER] auth:`, res.locals.auth);

  const user = res.locals.auth;
  // console.log(`[ROLEHANDLER] user:`, user);

  if (user != undefined && checkAuthRole(user)) {
    next();
  } else {
    console.error(`[ROLEHANDLER] NOT Access:`, user);

    res.statusCode = 401;
    res.setHeader("Content-Type", "text/plain");
    res.end("Not Authorizated");
  }
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
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename='${fileName}'.pdf`,
        "Content-Length": data.length,
      });

      res.end(data);
      // res.end(Buffer.from(data, "base64"));
    })
    .catch((err) => {
      res.status(500);
      res.json({ result: err });
    });
};

app.use("/api/info", logHandler, function (req, res, next) {
  let data = {
    status: "Running",
    version: VERSION,
    currentUTCDate: new Date().toUTCString(),
  };
  res.status(200).send(data);
});

// Pazienti API
var pazientiRouter = require("./routes/pazienti");
app.use(
  "/api/pazienti",
  logHandler,
  authorizationHandler,
  roleHandler,
  pazientiRouter
);

// Dipendenti API
var dipendentiRouter = require("./routes/dipendenti");
app.use(
  "/api/dipendenti",
  logHandler,
  authorizationHandler,
  async (req, res, next) => {
    res.locals.clientMailerService = clientMailerService;

    const topicMailerservice = "topic/dipendente";
    res.locals.topicMailerservice = topicMailerservice;

    next();
  },
  dipendentiRouter
);

// Consulenti API
var consulentiRouter = require("./routes/consulenti");
app.use("/api/consulenti", logHandler, authorizationHandler, consulentiRouter);
// Fornitori API
var fornitoriRouter = require("./routes/fornitori");
app.use(
  "/api/fornitori",
  logHandler,
  authorizationHandler,
  roleHandler,
  fornitoriRouter
);
// ASP API
var aspRouter = require("./routes/asp");
app.use("/api/asp", logHandler, authorizationHandler, aspRouter);

// Farmaci API
var farmaciRouter = require("./routes/farmaci");
app.use("/api/farmaci", logHandler, authorizationHandler, farmaciRouter);

// Eventi API
var eventiRouter = require("./routes/eventi");
app.use("/api/eventi", logHandler, authorizationHandler, eventiRouter);

var uploadRouter = require("./routes/upload");
app.use(
  "/api/upload",
  logHandler,
  authorizationHandler,
  uploadRouter,
  writeHandler
);
app.use("/api/files", logHandler, authorizationHandler, uploadRouter);

app.get("/api/download", logHandler, authorizationHandler, readHandler);

// Fatture API
var fattureRouter = require("./routes/fatture");
app.use("/api/fatture", logHandler, authorizationHandler, fattureRouter);

// NotaCredito API
var notaCreditoRouter = require("./routes/notacredito");
app.use(
  "/api/notacredito",
  logHandler,
  authorizationHandler,
  notaCreditoRouter
);

// Bonifici API
var bonificiRouter = require("./routes/bonifici");
app.use("/api/bonifici", logHandler, authorizationHandler, bonificiRouter);

// Menu API
var menuRouter = require("./routes/menu");
app.use("/api/menu", logHandler, authorizationHandler, menuRouter);

// Contratto API
var contrattoRouter = require("./routes/contratto");
app.use("/api/contratto", logHandler, authorizationHandler, contrattoRouter);

/*** GESTIONE PERSONALE ***/

// Ferie API
var ferieRouter = require("./routes/ferie");
app.use("/api/ferie", logHandler, authorizationHandler, ferieRouter);

// Permessi API
var permessiRouter = require("./routes/permessi");
app.use("/api/permessi", logHandler, authorizationHandler, permessiRouter);

// Cambi turno API
var cambiTurnoRouter = require("./routes/cambiturno");
app.use("/api/cambiturno", logHandler, authorizationHandler, cambiTurnoRouter);

// Presenze API
var presenzeRouter = require("./routes/presenze");
app.use("/api/presenze", logHandler, authorizationHandler, presenzeRouter);

// Turni mensili API
var turniMensiliRouter = require("./routes/turnimensili");
app.use(
  "/api/turnimensili",
  logHandler,
  authorizationHandler,
  turniMensiliRouter
);

// Turni mensili API
var documentiDipendentiRouter = require("./routes/documentidipendenti");
app.use(
  "/api/documentidipendenti",
  logHandler,
  authorizationHandler,

  documentiDipendentiRouter
);

// MedicinaLavoro API
var documentiMedicinaLavoroRouter = require("./routes/documentiMedicinaLavoro");
app.use(
  "/api/documentimedicinalavoro",
  logHandler,
  authorizationHandler,
  documentiMedicinaLavoroRouter
);

// CartellaClinica API
var CartellaClinicaRouter = require("./routes/cartellaClinica");
app.use(
  "/api/cartellaClinica",
  logHandler,
  authorizationHandler,
  CartellaClinicaRouter
);

// Bonifici API
var documentiFornitoreRouter = require("./routes/documentifornitore");
app.use(
  "/api/documentifornitore",
  logHandler,
  authorizationHandler,
  documentiFornitoreRouter
);

var curriculumRouter = require("./routes/curriculum");
app.use("/api/curriculum", logHandler, authorizationHandler, curriculumRouter);

/** GESTIONE FATTURE FORNITORI */

var fattureFornitoriRouter = require("./routes/fattureFornitori");
app.use(
  "/api/fatturefornitori",
  logHandler,
  authorizationHandler,
  fattureFornitoriRouter
);

/** GESTIONE BONIFICI FORNITORI */

var bonificiFornitoriRouter = require("./routes/bonificiFornitori");
app.use(
  "/api/bonificifornitori",
  logHandler,
  authorizationHandler,
  bonificiFornitoriRouter
);

/** GESTIONE ANTICIPO FATTURE ASP */

var anticipoFattureRouter = require("./routes/anticipoFatture");
app.use(
  "/api/anticipofatture",
  logHandler,
  authorizationHandler,
  anticipoFattureRouter
);

/** GESTIONE PROSPETTO FATTURE ASP */

var prospettoCMRouter = require("./routes/prospettoCM");
app.use(
  "/api/prospettocm",
  logHandler,
  authorizationHandler,
  prospettoCMRouter
);

/** GESTIONE PUNTO FATTURE ASP */

var puntoFattureRouter = require("./routes/puntoFatture");
app.use(
  "/api/puntofatture",
  logHandler,
  authorizationHandler,
  puntoFattureRouter
);

// GESTIONE VISITE E DIARIO CLINICO
var DiarioClinicoRouter = require("./routes/diarioClinico");
app.use(
  "/api/diarioClinico",
  logHandler,
  authorizationHandler,
  DiarioClinicoRouter
);

var VisiteSpecialisticheRouter = require("./routes/visiteSpecialistiche");
app.use(
  "/api/visiteSpecialistiche",
  logHandler,
  authorizationHandler,
  VisiteSpecialisticheRouter
);

// DOCUMENTI PAZIENTE API
var documentiPazienteRouter = require("./routes/documentipazienti");
app.use(
  "/api/documentipazienti",
  logHandler,
  authorizationHandler,
  documentiPazienteRouter
);

// GESTIONE DIARIO EDUCATIVO E ASSSOCIALE
var DiarioEducativoRouter = require("./routes/diarioEducativo");
app.use(
  "/api/diarioEducativo",
  logHandler,
  authorizationHandler,
  DiarioEducativoRouter
);

var DiarioAssSocialeRouter = require("./routes/diarioAssSociale");
app.use(
  "/api/diarioAssSociale",
  logHandler,
  authorizationHandler,
  DiarioAssSocialeRouter
);

/*** FINE  ***/

app.listen(PORT, function () {
  return console.log("Innova Backend App listening on port " + PORT + "!");
});
