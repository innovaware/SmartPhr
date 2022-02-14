"use strict";
exports.__esModule = true;

const express = require("express");
const basicAuth = require("express-basic-auth");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");

const nextcloud_node_client_1 = require("nextcloud-node-client");
const user = require("./models/user");
const redis = require("redis");
const mongoose = require("mongoose");
const mqtt = require("mqtt");

// var MongoClient = require('mongodb').MongoClient;
// mongo = undefined;
var app = express();
var PORT = process.env.PORT || 3000;

var VERSION = process.env.VERSION;

const redisPort = process.env.REDISPORT || 6379;
const redisHost = process.env.REDISHOST || "redis";
var redisDisabled = process.env.REDISDISABLE === "true" || false;
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;

// GESTIONE MAILER SERVICE
var clientMailerServiceDisabled = false;
const hostMailerService = process.env.MAILERSERVICEHOST || "localhost";
const portMailerService = process.env.MAILERSERVICEPORT || "1883";
const clientIdMailerService = `mqtt_${Math.random().toString(16).slice(3)}`;
const connectUrlMailerService = `mqtt://${hostMailerService}:${portMailerService}`;
const mailerUsername = process.env.MAILERSERVICEUSERNAME || "test";
const mailerPassword = process.env.MAILERSERVICEPASSWORD || "test";
const mailerConnectionTimeout = process.env.MAILERCONNECTIONTIMEOUT || 4000;
const mailerReConnectionPeriod = process.env.MAILERRECONNECTIONPERIOD || 1000;

const NEXTCLOUD_HOST = "http://smart-iphr.innovaware.it:8081";
const NEXTCLOUD_USER = "admin";
const NEXTCLOUD_PASW = "admin";

const MONGO_USERNAME = "innova";
const MONGO_PASSWORD = "innova2019";
const MONGO_HOSTNAME = "vps-d76f9e1c.vps.ovh.net";
const MONGO_PORT = "27017";
const MONGO_DB = "smartphr";
const mongoConnectionString = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;



console.log("*********************************************************************************");
console.log("******************************** SMARTPHR Server ********************************");
console.log("*********************************************************************************");
console.log(`* Version: ${VERSION}                                                            `);
console.log("*                                                                                ");
console.log(`* Api Service:                                                                   `);
console.log(`* Api Options:                                                                   `);
console.log(`*     Port   : ${PORT}                                                           `);
console.log("*                                                                                ");
console.log(`* Redis Host: ${redisHost}:${redisPort}                                          `);
console.log(`* Redis Options:                                                                 `); 
console.log(`*       Disabled  : ${redisDisabled? 'true' : 'false' }                          `); 
console.log(`*       Time Cache: ${redisTimeCache}                                            `);
console.log("*                                                                                ");
console.log(`* Mailer Service: ${hostMailerService}:${portMailerService}                      `);
console.log(`* Mailer Options:                                                                `);
console.log(`*        Client Id: ${clientIdMailerService}:                                    `);
console.log(`*        Queue url: ${connectUrlMailerService}                                   `);
console.log(`*        Username: ${mailerUsername}                                             `);
console.log(`*        Password: ${mailerPassword}                                             `);
console.log(`*        Connection Timeout: ${mailerConnectionTimeout}                          `);
console.log(`*        ReConnection Period: ${mailerReConnectionPeriod}                        `);
console.log("*                                                                                ");
console.log(`* NextCloud Service: ${NEXTCLOUD_HOST}                                           `);
console.log(`* NextCloud Options:                                                             `);
console.log(`*           Username: ${NEXTCLOUD_USER}                                          `);
console.log("*                                                                                ");
console.log(`* Mongo Service: ${MONGO_HOSTNAME}:${MONGO_PORT}                                 `);
console.log(`* Mongo Options:                                                                 `);
console.log(`*       Username: ${MONGO_USERNAME}                                              `);
console.log(`*       Password: ${MONGO_PASSWORD}                                              `);
console.log(`*       Database: ${MONGO_DB}                                                    `);
console.log(`*       Connection String: ${mongoConnectionString}                              `);
console.log("                                                                                 ");
console.log("*********************************************************************************");

var clientRedis = undefined;
var clientMailerService = undefined;

const InitMongoService = () => {
  console.log("Wait to connect Mongo Service...");
  mongoose.connect(
    mongoConnectionString,
    {
      useNewUrlParser: true,
    },
    function () {
      return console.log("Connection Mongo service completed");
    });
}

const InitApiService = () => {
  console.log("Wait to initialize Api Service");
  app.use(cors());
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(fileUpload({createParentPath: true }));
  console.log("Initialize Api Service completed");
}

const InitRedisService = () => {
  if (redisDisabled) {
    try {
      console.log("Wait to connect Redis...");
      clientRedis = redis.createClient(redisPort, redisHost);
      
      console.log("Connection Redis Service Completed");
    } catch (error) {
      console.error("Error to connect Redis", error);
      clientRedis = undefined;
      
      console.log("Deactivate Redis Service");
      redisDisabled = true;
    }
  }
}

const InitMailerService = () => {
  try {
    console.log("Wait to connect MQTT Service...");
    clientMailerService = mqtt.connect(connectUrlMailerService, {
      clientIdMailerService,
      clean: true,
      connectTimeout: mailerConnectionTimeout,
      username: mailerUsername, 
      password: mailerPassword, 
      reconnectPeriod: mailerReConnectionPeriod,
    });
    console.log("Connection MQTT Service Completed");
  } catch (error) {
    console.error("Error to connect MQTT Service", error);
    clientMailerService = undefined;
    
    console.log("Deactivate Redis Service");
    clientMailerServiceDisabled = true;
  }
}

const InitApiFunctions = () => {
  app.use("/api/info", logHandler, function (req, res, next) {
    let data = {
      status: "Running",
      version: VERSION,
      currentUTCDate: new Date().toUTCString(),
    };
    res.status(200).send(data);
  });
  
  // User api
  var userRouter = require("./routes/user");
  app.use("/api/users",(req, res, next)=> {
    res.locals.clientRedis = clientRedis;
    next();
  }, logHandler, authorizationHandler, userRouter);

  // Pazienti API
  // var pazientiRouter = require("./routes/pazienti");
  // app.use(
  //   "/api/pazienti",
  //   logHandler,
  //   authorizationHandler,
  //   roleHandler,
  //   pazientiRouter
  // );

  // // Dipendenti API
  // var dipendentiRouter = require("./routes/dipendenti");
  // app.use(
  //   "/api/dipendenti",
  //   logHandler,
  //   authorizationHandler,
  //   async (req, res, next) => {
  //     res.locals.clientMailerService = clientMailerService;

  //     const topicMailerservice = "topic/dipendente";
  //     res.locals.topicMailerservice = topicMailerservice;

  //     next();
  //   },
  //   dipendentiRouter
  // );

  // // Consulenti API
  // var consulentiRouter = require("./routes/consulenti");
  // app.use("/api/consulenti", logHandler, authorizationHandler, consulentiRouter);

  // // Fornitori API
  // var fornitoriRouter = require("./routes/fornitori");
  // app.use(
  //   "/api/fornitori",
  //   logHandler,
  //   authorizationHandler,
  //   roleHandler,
  //   fornitoriRouter
  // );
  // // ASP API
  // var aspRouter = require("./routes/asp");
  // app.use("/api/asp", logHandler, authorizationHandler, aspRouter);

  // // Farmaci API
  // var farmaciRouter = require("./routes/farmaci");
  // app.use("/api/farmaci", logHandler, authorizationHandler, farmaciRouter);

  // // Eventi API
  // var eventiRouter = require("./routes/eventi");
  // app.use("/api/eventi", logHandler, authorizationHandler, eventiRouter);

  // // Upload and Download
  // var uploadRouter = require("./routes/upload");
  // app.use(
  //   "/api/upload",
  //   logHandler,
  //   authorizationHandler,
  //   uploadRouter,
  //   writeHandler
  // );
  // app.use("/api/files", logHandler, authorizationHandler, uploadRouter);
  // app.get("/api/download", logHandler, authorizationHandler, readHandler);

  // // Fatture API
  // var fattureRouter = require("./routes/fatture");
  // app.use("/api/fatture", logHandler, authorizationHandler, fattureRouter);

  // // NotaCredito API
  // var notaCreditoRouter = require("./routes/notacredito");
  // app.use(
  //   "/api/notacredito",
  //   logHandler,
  //   authorizationHandler,
  //   notaCreditoRouter
  // );

  // // Bonifici API
  // var bonificiRouter = require("./routes/bonifici");
  // app.use("/api/bonifici", logHandler, authorizationHandler, bonificiRouter);

  // // Menu API
  // var menuRouter = require("./routes/menu");
  // app.use("/api/menu", logHandler, authorizationHandler, menuRouter);

  // // Contratto API
  // var contrattoRouter = require("./routes/contratto");
  // app.use("/api/contratto", logHandler, authorizationHandler, contrattoRouter);

  // // Ferie API
  // var ferieRouter = require("./routes/ferie");
  // app.use("/api/ferie", logHandler, authorizationHandler, ferieRouter);

  // // Permessi API
  // var permessiRouter = require("./routes/permessi");
  // app.use("/api/permessi", logHandler, authorizationHandler, permessiRouter);

  // // Cambi turno API
  // var cambiTurnoRouter = require("./routes/cambiturno");
  // app.use("/api/cambiturno", logHandler, authorizationHandler, cambiTurnoRouter);

  // // Presenze API
  // var presenzeRouter = require("./routes/presenze");
  // app.use("/api/presenze", logHandler, authorizationHandler, presenzeRouter);

  // // Turni mensili API
  // var turniMensiliRouter = require("./routes/turnimensili");
  // app.use(
  //   "/api/turnimensili",
  //   logHandler,
  //   authorizationHandler,
  //   turniMensiliRouter
  // );

  // // Turni mensili API
  // var documentiDipendentiRouter = require("./routes/documentidipendenti");
  // app.use(
  //   "/api/documentidipendenti",
  //   logHandler,
  //   authorizationHandler,

  //   documentiDipendentiRouter
  // );

  // // MedicinaLavoro API
  // var documentiMedicinaLavoroRouter = require("./routes/documentiMedicinaLavoro");
  // app.use(
  //   "/api/documentimedicinalavoro",
  //   logHandler,
  //   authorizationHandler,
  //   documentiMedicinaLavoroRouter
  // );

  // // CartellaClinica API
  // var CartellaClinicaRouter = require("./routes/cartellaClinica");
  // app.use(
  //   "/api/cartellaClinica",
  //   logHandler,
  //   authorizationHandler,
  //   CartellaClinicaRouter
  // );

  // // Bonifici API
  // var documentiFornitoreRouter = require("./routes/documentifornitore");
  // app.use(
  //   "/api/documentifornitore",
  //   logHandler,
  //   authorizationHandler,
  //   documentiFornitoreRouter
  // );

  // var curriculumRouter = require("./routes/curriculum");
  // app.use("/api/curriculum", logHandler, authorizationHandler, curriculumRouter);

  // /** GESTIONE FATTURE FORNITORI */

  // var fattureFornitoriRouter = require("./routes/fattureFornitori");
  // app.use(
  //   "/api/fatturefornitori",
  //   logHandler,
  //   authorizationHandler,
  //   fattureFornitoriRouter
  // );

  // /** GESTIONE BONIFICI FORNITORI */

  // var bonificiFornitoriRouter = require("./routes/bonificiFornitori");
  // app.use(
  //   "/api/bonificifornitori",
  //   logHandler,
  //   authorizationHandler,
  //   bonificiFornitoriRouter
  // );

  // /** GESTIONE ANTICIPO FATTURE ASP */

  // var anticipoFattureRouter = require("./routes/anticipoFatture");
  // app.use(
  //   "/api/anticipofatture",
  //   logHandler,
  //   authorizationHandler,
  //   anticipoFattureRouter
  // );

  // /** GESTIONE PROSPETTO FATTURE ASP */

  // var prospettoCMRouter = require("./routes/prospettoCM");
  // app.use(
  //   "/api/prospettocm",
  //   logHandler,
  //   authorizationHandler,
  //   prospettoCMRouter
  // );

  // /** GESTIONE PUNTO FATTURE ASP */

  // var puntoFattureRouter = require("./routes/puntoFatture");
  // app.use(
  //   "/api/puntofatture",
  //   logHandler,
  //   authorizationHandler,
  //   puntoFattureRouter
  // );

  // // GESTIONE VISITE E DIARIO CLINICO
  // var DiarioClinicoRouter = require("./routes/diarioClinico");
  // app.use(
  //   "/api/diarioClinico",
  //   logHandler,
  //   authorizationHandler,
  //   DiarioClinicoRouter
  // );

  // var VisiteSpecialisticheRouter = require("./routes/visiteSpecialistiche");
  // app.use(
  //   "/api/visiteSpecialistiche",
  //   logHandler,
  //   authorizationHandler,
  //   VisiteSpecialisticheRouter
  // );

  // // DOCUMENTI PAZIENTE API
  // var documentiPazienteRouter = require("./routes/documentipazienti");
  // app.use(
  //   "/api/documentipazienti",
  //   logHandler,
  //   authorizationHandler,
  //   documentiPazienteRouter
  // );

  // // GESTIONE UTENTI API
  // //var usersRouter = require("./routes/users");
  // //app.use("/api/users", logHandler, authorizationHandler, usersRouter);

  // // GESTIONE DIARIO EDUCATIVO E ASSSOCIALE
  // var DiarioEducativoRouter = require("./routes/diarioEducativo");
  // app.use(
  //   "/api/diarioEducativo",
  //   logHandler,
  //   authorizationHandler,
  //   DiarioEducativoRouter
  // );

  // var DiarioAssSocialeRouter = require("./routes/diarioAssSociale");
  // app.use(
  //   "/api/diarioAssSociale",
  //   logHandler,
  //   authorizationHandler,
  //   DiarioAssSocialeRouter
  // );

}



const StartApiService = () => {
  console.log("Starting Api Service...");
  app.listen(PORT, function () {
    return console.log("Innova Backend App listening on port http://localhost:" + PORT + "!");
  });
}

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
  //console.log("AuthorizationHandler: ", req);
  const userAuth = getAuth(req);

  //console.log("user auth: ", userAuth);
  if (userAuth == null) {
    //var err = new Error("You are not authenticated!");
    res.setHeader("WWW-Authenticate", "Basic");
    //err.status = 401;
    res.statusCode = 401;
    res.end("Not Authorizated");
    return next(null, "You are not authenticated!");
  }

  var username = userAuth.user;
  var password = userAuth.password;

  //console.log("Auth: ", userAuth)
  var userMatches = false;
  var passwordMatches = false;
  var resultAuthorization = false;
  getUser(username, password)
    .then((user) => {
      //console.log("GetUser completed: ", user);
      userMatches = user.username != undefined && user.active == true;
      passwordMatches = user.password != undefined;
      resultAuthorization = userMatches & passwordMatches;

      //console.log("User username: ", user.username);
      //console.log("User password: ", user.password);
      //console.log("User active: ", user.active);
      //console.log("User authorizated: ", resultAuthorization);
      if (!resultAuthorization) {
        res.statusCode = 401;
        res.setHeader("WWW-Authenticate", "Basic");
        res.end("Not Authorizated");
        //console.log("[AUTHORIZATIONHANDLER] User not authorized");

      } else {
        res.locals.auth = user;
        //console.log("Setted local parameter user");
        //console.log(`[AUTHORIZATIONHANDLER] res.locals.auth:`, res.locals.auth);
        return next(null, resultAuthorization);
      }
    })
    .catch((err) => {
      console.log("No matching: Err ", err);
      // return next(null, result_authorization);
      res.statusCode = 401;
      res.setHeader("Content-Type", "text/plain");
      res.end("Not Authorizated");
    });
};

function getUser(username, password) {
  const readFromMongo = (username, password) => {
    return user.find({
      $and: [{ username: username }, { password: password }]
    });
  }

  return new Promise(async (resolve, reject) => {
    if (clientRedis && !redisDisabled) {
      const searchTerm = `AUTH${username}${password}`;
      clientRedis.get(searchTerm, async (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        
        if (data) {
          const userFind = JSON.parse(data);
          resolve(userFind);

        } else {
          //console.log(`[GETUSER] Get from MONGODB searchTerm:${searchTerm}`);
          const usersFind = await readFromMongo(username, password);
          if (usersFind.length > 0) {
            const userFind = usersFind[0];
            
            clientRedis.setex(
              searchTerm,
              redisTimeCache,
              JSON.stringify(userFind)
              );
              
              resolve(userFind);
            } else {
              reject("Not found");
            }
          }
        });
    } else {
      const usersFind = await readFromMongo(username, password);
      if (usersFind.length > 0) {
        resolve(usersFind[0]);
      } else {
        reject("User not found");
      }
    }
  });
}

function checkAuthRole(user) {
  if (user != undefined) return user.role == "Admin";

  return false;
}

// enable files upload


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

// var NEXTCLOUD_HOST = "http://smart-iphr.innovaware.it:8081";
// var NEXTCLOUD_USER = "admin";
// var NEXTCLOUD_PASW = "admin";
// 
// var MONGO_USERNAME = "innova";
// var MONGO_PASSWORD = "innova2019";
// var MONGO_HOSTNAME = "vps-d76f9e1c.vps.ovh.net";
// var MONGO_PORT = "27017";
// var MONGO_DB = "smartphr";
//'mongodb://innova:innova2019@192.168.1.10:27017/smartphr?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false';



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



/*** FINE  ***/

InitApiService();
InitRedisService();
InitMailerService();
InitMongoService();

InitApiFunctions();
StartApiService();
return
