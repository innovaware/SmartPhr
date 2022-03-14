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
const { route } = require("./routes/dipendenti");
const { ObjectId } = require("bson");
const Menu = require("./models/menu");

// var MongoClient = require('mongodb').MongoClient;
// mongo = undefined;
var app = express();
var PORT = process.env.PORT || 3000;

var VERSION = process.env.VERSION;

const redisPort = process.env.REDISPORT || 6379;
const redisHost = process.env.REDISHOST || "redis";
var redisDisabled = process.env.REDISDISABLE === "true" || true;
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




var clientRedis = undefined;
var clientMailerService = undefined;
var clientNextCloud = undefined;

var routesList = [];

const PrintInfoService = () => {
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
  console.log("*                                                                                ");
  console.log("* Routes:                                                                        ");
  routesList.forEach(r => { 
    console.log(`*\t${r.key.padEnd(30)}\t-- ${r.path}`);
  });
  console.log("*********************************************************************************");
}

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
  if (!redisDisabled) {
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
  
  app.set('redis', clientRedis); 
  app.set('redisDisabled', redisDisabled); 
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
  app.set('mailer', clientMailerService);
  app.set('mailerTopic', "topic/dipendente");
  app.set('mailerDisabled', clientMailerServiceDisabled);
}

const InitApiFunctions = () => {
  var apiInfo = { key: 'info', path:'/api/info' }
  app.use(apiInfo.path, logHandler, function (req, res, next) {
    let data = {
      status: "Running",
      version: VERSION,
      currentUTCDate: new Date().toUTCString(),
    };
    res.status(200).send(data);
  });
  routesList.push(apiInfo);

  
  // User api
  var userRouter = require("./routes/user");
  var apiUser = { key: 'user', path:'/api/users' }
  app.use(apiUser.path, logHandler, authorizationHandler, roleHandler,  userRouter);
  routesList.push(apiUser);

  // Pazienti API
  var pazientiRouter = require("./routes/pazienti");
  var apiPazienti = { key: 'pazienti', path:'/api/pazienti' }
  app.use( apiPazienti.path, logHandler, authorizationHandler, roleHandler, pazientiRouter );
  routesList.push(apiPazienti);

  // Dipendenti API
  var dipendentiRouter = require("./routes/dipendenti");
  var apiDipendente = { key: 'dipendenti', path: '/api/dipendenti' }
  app.use(apiDipendente.path, logHandler, authorizationHandler, roleHandler,  dipendentiRouter );
  routesList.push(apiDipendente);

  // Consulenti API
  var consulentiRouter = require("./routes/consulenti");
  var apiConsulenti = { key: 'consulenti', path: '/api/consulenti' }
  app.use(apiConsulenti.path, logHandler, authorizationHandler, roleHandler,  consulentiRouter);
  routesList.push(apiConsulenti);

  // Fornitori API
  var fornitoriRouter = require("./routes/fornitori");
  var apiFornitori = { key: 'fornitori', path: '/api/fornitori' }
  app.use(apiFornitori.path, logHandler, authorizationHandler, roleHandler, fornitoriRouter );
  routesList.push(apiFornitori);

  // ASP API
  var aspRouter = require("./routes/asp");
  var apiAsp = { key: 'asp', path: '/api/asp' }
  app.use(apiAsp.path, logHandler, authorizationHandler, roleHandler, aspRouter);
  routesList.push(apiAsp);

  // Farmaci API
  var farmaciRouter = require("./routes/farmaci");
  var apiFarmaci = { key: 'farmaci', path: '/api/farmaci' }
  app.use(apiFarmaci.path, logHandler, authorizationHandler, roleHandler, farmaciRouter);
  routesList.push(apiFarmaci);

  // Eventi API
  var eventiRouter = require("./routes/eventi");
  var apiEventi = { key: 'eventi', path: '/api/eventi' }
  app.use(apiEventi.path, logHandler, authorizationHandler, roleHandler, eventiRouter);
  routesList.push(apiEventi);

   // Mansioni API
   var mansioniRouter = require("./routes/mansioni");
   var apiMansioni = { key: 'mansioni', path: '/api/mansioni' }
   app.use(apiMansioni.path, logHandler, authorizationHandler, roleHandler, mansioniRouter);
   routesList.push(apiMansioni);

  // Upload and Download
  var uploadRouter = require("./routes/upload");
  var apiUpload = { key: 'upload', path: '/api/upload'}
  var apiFile = { key: 'file', path: '/api/files'}
  app.use( apiUpload.path, logHandler, authorizationHandler, roleHandler, uploadRouter, writeHandler );
  app.use(apiFile.path, logHandler, authorizationHandler, roleHandler, uploadRouter);
  routesList.push(apiUpload);
  routesList.push(apiFile);

  var apiDownload = { key: 'download', path: '/api/download'}
  app.get(apiDownload.path, logHandler, authorizationHandler, roleHandler, readHandler);
  routesList.push(apiDownload);

  // Fatture API
  var fattureRouter = require("./routes/fatture");
  var apiFatture = { key: 'fatture', path: '/api/fatture'}
  app.use(apiFatture.path, logHandler, authorizationHandler, roleHandler, fattureRouter);
  routesList.push(apiFatture);

  // NotaCredito API
  var notaCreditoRouter = require("./routes/notacredito");
  var apiNotacredito = { key: 'notacredito', path: '/api/notacredito'}
  app.use( apiNotacredito.path, logHandler, authorizationHandler, roleHandler, notaCreditoRouter );
  routesList.push(apiNotacredito);

  // Bonifici API
  var bonificiRouter = require("./routes/bonifici");
  var apiBonifici= { key: 'bonifici', path: '/api/bonifici'}
  app.use(apiBonifici.path, logHandler, authorizationHandler, roleHandler, bonificiRouter);
  routesList.push(apiBonifici);

  // Menu API
  var menuRouter = require("./routes/menu");
  var apiMenu = { key: 'menu', path: '/api/menu'}
  app.use(apiMenu.path, logHandler, authorizationHandler, roleHandler, menuRouter);
  routesList.push(apiMenu);

  // Contratto API
  var contrattoRouter = require("./routes/contratto");
  var apiContratto = { key: 'contratto', path: '/api/contratto'}
  app.use(apiContratto.path, logHandler, authorizationHandler, roleHandler, contrattoRouter);
  routesList.push(apiContratto);

  // Ferie API
  var ferieRouter = require("./routes/ferie");
  var apiFerie = { key: 'ferie', path: '/api/ferie'}
  app.use(apiFerie.path, logHandler, authorizationHandler, roleHandler, ferieRouter);
  routesList.push(apiFerie);

  // Permessi API
  var permessiRouter = require("./routes/permessi");
  var apiPermessi = { key: 'permessi', path: '/api/permessi'}
  app.use(apiPermessi.path, logHandler, authorizationHandler, roleHandler, permessiRouter);
  routesList.push(apiPermessi);

  // Cambi turno API
  var cambiTurnoRouter = require("./routes/cambiturno");
  var apiCambiTurno = { key: 'cambiturno', path: '/api/cambiturno'}
  app.use(apiCambiTurno.path, logHandler, authorizationHandler, roleHandler, cambiTurnoRouter);
  routesList.push(apiCambiTurno);

  // Presenze API
  var presenzeRouter = require("./routes/presenze");
  var apiPresenze = { key: 'presenze', path: '/api/presenze'}
  app.use(apiPresenze.path, logHandler, authorizationHandler, roleHandler, presenzeRouter);
  routesList.push(apiPresenze);

  // Turni mensili API
  var turniMensiliRouter = require("./routes/turnimensili");
  var apiTurniMensili = { key: 'turnimensili', path: '/api/turnimensili' }
  app.use( apiTurniMensili.path, logHandler, authorizationHandler, roleHandler, turniMensiliRouter );
  routesList.push(apiTurniMensili);

  // Turni mensili API
  var documentiDipendentiRouter = require("./routes/documentidipendenti");
  var apiDocumentiDipendenti = { key: 'documentidipendenti', path: '/api/documentidipendenti' }
  app.use( apiDocumentiDipendenti.path, logHandler, authorizationHandler, roleHandler, documentiDipendentiRouter );
  routesList.push(apiDocumentiDipendenti);

  // MedicinaLavoro API
  var documentiMedicinaLavoroRouter = require("./routes/documentiMedicinaLavoro");
  var apiDocumentiMedicinaLavoro = { key: 'documentimedicinalavoro', path: '/api/documentimedicinalavoro' }
  app.use( apiDocumentiMedicinaLavoro.path, logHandler, authorizationHandler, roleHandler, documentiMedicinaLavoroRouter );
  routesList.push(apiDocumentiMedicinaLavoro);

  // CartellaClinica API
  var cartellaClinicaRouter = require("./routes/cartellaClinica");
  var apiCartellaClinica = { key: 'cartellaClinica', path: '/api/cartellaClinica' }
  app.use( apiCartellaClinica.path, logHandler, authorizationHandler, roleHandler, cartellaClinicaRouter );
  routesList.push(apiCartellaClinica);

  // Bonifici API
  var documentiFornitoreRouter = require("./routes/documentifornitore");
  var apiDocumentiFornitore = { key: 'documentifornitore', path: '/api/documentifornitore' }
  app.use( apiDocumentiFornitore.path, logHandler, authorizationHandler, roleHandler, documentiFornitoreRouter );
  routesList.push(apiDocumentiFornitore);

  var curriculumRouter = require("./routes/curriculum");
  var apiCurriculum = { key: 'curriculum', path: '/api/curriculum' }
  app.use(apiCurriculum.path, logHandler, authorizationHandler, roleHandler, curriculumRouter);
  routesList.push(apiCurriculum);

  var fattureFornitoriRouter = require("./routes/fattureFornitori");
  var apiFattureFornitore = { key: 'fatturefornitore', path: '/api/fatturefornitori' }
  app.use( apiFattureFornitore.path, logHandler, authorizationHandler, roleHandler, fattureFornitoriRouter );
  routesList.push(apiFattureFornitore);

  var bonificiFornitoriRouter = require("./routes/bonificiFornitori");
  var apiBonificiFornitori = { key: 'bonificifornitori', path: '/api/bonificifornitori' }
  app.use( apiBonificiFornitori.path, logHandler, authorizationHandler, roleHandler, bonificiFornitoriRouter  );
  routesList.push(apiBonificiFornitori);

  var anticipoFattureRouter = require("./routes/anticipoFatture");
  var apiAnticipoFatture = { key: 'anticipofatture', path: '/api/anticipofatture' }
  app.use( apiAnticipoFatture.path, logHandler, authorizationHandler, roleHandler, anticipoFattureRouter );
  routesList.push(apiAnticipoFatture);

  var prospettoCMRouter = require("./routes/prospettoCM");
  var apiProspettoCMR = { key: 'prospettocm', path: '/api/prospettocm' }
  app.use( apiProspettoCMR.path, logHandler, authorizationHandler, roleHandler, prospettoCMRouter );
  routesList.push(apiProspettoCMR);

  var puntoFattureRouter = require("./routes/puntoFatture");
  var apiPuntoFatture = { key: 'puntofatture', path: '/api/puntofatture' }
  app.use( apiPuntoFatture.path, logHandler, authorizationHandler, roleHandler, puntoFattureRouter );
  routesList.push(apiPuntoFatture);

  var DiarioClinicoRouter = require("./routes/diarioClinico");
  var apiDiarioClinico = { key: 'diarioclinico', path: '/api/diarioClinico' }
  app.use( apiDiarioClinico.path, logHandler, authorizationHandler, roleHandler, DiarioClinicoRouter );
  routesList.push(apiDiarioClinico);

  var VisiteSpecialisticheRouter = require("./routes/visiteSpecialistiche");
  var apiVisiteSpecialistiche = { key: 'visiteSpecialistiche', path: '/api/visiteSpecialistiche' }
  app.use( apiVisiteSpecialistiche.path, logHandler, authorizationHandler, roleHandler, VisiteSpecialisticheRouter );
  routesList.push(apiVisiteSpecialistiche);

  var documentiPazienteRouter = require("./routes/documentipazienti");
  var apiDocumentiPaziente = { key: 'documentipazienti', path: '/api/documentipazienti' }
  app.use( apiDocumentiPaziente.path, logHandler, authorizationHandler, roleHandler, documentiPazienteRouter );
  routesList.push(apiDocumentiPaziente);

  var DiarioEducativoRouter = require("./routes/diarioEducativo");
  var apiDiarioEducativo = { key: 'diarioEducativo', path: '/api/diarioEducativo' }
  app.use( apiDiarioEducativo.path, logHandler, authorizationHandler, roleHandler, DiarioEducativoRouter );
  routesList.push(apiDiarioEducativo);
  
  var DiarioAssSocialeRouter = require("./routes/diarioAssSociale");
  var apiDiarioAssSociale = { key: 'diarioAssSociale', path: '/api/diarioAssSociale' }
  app.use( apiDiarioAssSociale.path, logHandler, authorizationHandler, roleHandler, DiarioAssSocialeRouter );
  routesList.push(apiDiarioAssSociale);
      
  var CameraRouter = require("./routes/camera");
  var apiCamera = { key: 'camere', path: '/api/camera' }
  app.use( apiCamera.path, logHandler, authorizationHandler, roleHandler, CameraRouter );
  routesList.push(apiCamera);
      
  //var usersRouter = require("./routes/users");
  //app.use("/api/users", logHandler, authorizationHandler, usersRouter);
}

const InitNextCloud = () => {
  // uses explicite credentials
  console.log("Init NextCloud");
  var server = new nextcloud_node_client_1.Server({
    basicAuth: { password: NEXTCLOUD_PASW, username: NEXTCLOUD_USER },
    url: NEXTCLOUD_HOST,
  });
  clientNextCloud = new nextcloud_node_client_1["default"](server);
  clientNextCloud.getSystemInfo().then(function (x) {
    console.log("System Information NextCloud:", x.server.webserver);
  });
}

const StartApiService = () => {
  console.log("Starting Api Service...");
  app.listen(PORT, function () {
    return console.log("Innova Backend App listening on port http://localhost:" + PORT + "!");
  });
}

const getAuth = (req) => {
  var authheader = req.headers.authorization;
  //console.log("authheader: ", authheader);
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
    //return next(null, "You are not authenticated!");

    console.log("User not authorizated");
    return;
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

const checkAuthRole = async (user) => {
  const mansioneRole = user.role;
  const getData = () => {
    // { roles: { $all: [ObjectId('620d1dbd01df09c08ccd9822')] } }
    return Menu.find({ roles: { $all: [ObjectId(mansioneRole)] } });
  };

  if (user != undefined)  {
    const data = await getData();
    return true;
  }

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



// Scrittura file su nextCloud
var writeHandler = function (req, res, next) {
  let result = res.locals.result;
  let root = `${result.path}`;

  clientNextCloud 
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

  clientNextCloud 
    .getContent(fileName)
    .then((data) => {
      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename='${fileName}'.pdf`,
        "Content-Length": data.length,
      });

      res.end(data);
    })
    .catch((err) => {
      res.status(500);
      res.json({ result: err });
    });
};

InitApiService();
InitNextCloud();
InitRedisService();
InitMailerService();
InitMongoService();

InitApiFunctions();

PrintInfoService();
StartApiService();
