const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { ObjectId } = require("bson");

const User = require("../models/user");
const Dipendenti = require("../models/dipendenti");
const Presenze = require("../models/presenze");
const Turnimensili = require("../models/turnimensili");

//const redis = require("redis");
//const redisPort = process.env.REDISPORT || 6379;
//const redisHost = process.env.REDISHOST || "redis";
//const redisDisabled = process.env.REDISDISABLE === "true" || false;
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;
//const client = redis.createClient(redisPort, redisHost);

/**
 * Ritorna informazioni dell'utente
 */
router.get("/info/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // var query = { 
    //   idUser: mongoose.Types.ObjectId(id) 
    // };
    // const dipendenti = await Dipendenti.find(query);

    const query = [
      {
        '$match': {
          'idUser': new ObjectId(id)
        }
      }, {
        '$lookup': {
          'from': 'mansioni', 
          'localField': 'mansione', 
          'foreignField': '_id', 
          'as': 'mansione'
        }
      }
    ];

    const dipendenti = await Dipendenti.aggregate(query);

    res.status(200).json(dipendenti);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

/**
 * Ritorna lista utenti
 * 
 */
router.get("/", async (req, res) => {
  const getData = () => {
    return User.find();
  };

  try {
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient == undefined || redisDisabled) {
      const users = await getData();
      res.status(200).json(users);
      return;
    } else {
      const searchTerm = `USERALL`;
      // Ricerca su Redis Cache
      redisClient.get(searchTerm, async (err, data) => {
        if (err) throw err;

        if (data) {
          // Dato trovato in cache - ritorna il json
          res.status(200).send(JSON.parse(data));
        } else {
          // Recupero informazioni dal mongodb
          const users = await getData();
          // Aggiorno la cache con i dati recuperati da mongodb
          redisClient.setex(searchTerm, redisTimeCache, JSON.stringify(users));

          // Ritorna il json
          res.status(200).json(users);
        }

      });
    }
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).json({ Error: err });

  }
});

/**
 * Ritorna informazioni dell'utente 
 */
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  redisClient = req.app.get("redis");
  redisDisabled = req.app.get("redisDisabled");
  
  /**
   * Ritorna informazioni dell'utente utilizzando l'id
   * @param {*} id 
   * @returns models/user.js
   */
  const getDataById = (id) => {
    return User.findById(id);
  };

  try {
    if (redisClient == undefined || redisDisabled) {
      const users = await getDataById(id);
      res.status(200).json(users);

    } else {
      const searchTerm = `USERBY${id}`;
      redisClient.get(searchTerm, async (err, data) => {
        if (err) throw err;

        if (data) {
          res.status(200).send(JSON.parse(data));
        } else {
          const user = await getDataById(id);
          redisClient.setex(searchTerm, redisTimeCache, JSON.stringify(user));
          res.status(200).json(user);

        }
      });
    }
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

/**
 * Login utente
 */
router.post("/authenticate", async (req, res) => {
  try {
    
    const user = res.locals.auth;
    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours()+1);

    const query = {
      user: mongoose.Types.ObjectId(user._id),
      dataRifInizio: { $lte: currentDate },
      dataRifFine: { $gte: currentDate },
      turnoInizio: { $lte: currentDate.getHours() },
      turnoFine: { $gte: currentDate.getHours() },
    };
    const turno = await Turnimensili.findOne(query);

    //if (turno == null && user.username !== "admin") {
    //  res.status(401);
    //  res.json({ Error: 'Not Authorized - Fuori turno' });

    //  return;
    //}

    const presenzeFind = await Dipendenti.aggregate([
      {
        $match: {
          idUser: mongoose.Types.ObjectId(user._id),
        },
      },
      {
        $lookup: {
          from: "presenze",
          localField: "idUser",
          foreignField: "user",
          as: "presenze",
        },
      },
      {
        $unwind: {
          path: "$codiceFiscale",
        },
      },
    ]);

    if (presenzeFind.length > 0) {
      if (turno != null) {
        const dataRif = currentDate;
        const dataRifNowInizio = new Date(
          Date.UTC(
            dataRif.getFullYear(),
            dataRif.getMonth(),
            dataRif.getDate(),
            0,
            0,
            0
          )
        );

        const dataRifNowFine = new Date(
          Date.UTC(
            dataRif.getFullYear(),
            dataRif.getMonth(),
            dataRif.getDate(),
            0,
            0,
            0
          )
        );

        turno.dataRifInizio.setHours(turno.turnoInizio+1);
        turno.dataRifFine.setHours(turno.turnoFine+1);
        dataRifNowInizio.setHours(turno.fturnoInizio+1);
        dataRifNowFine.setHours(turno.turnoFine+1);

        const resultPresenze = presenzeFind.map((x) => {
          return {
            presenze: x.presenze.find(
              (a) =>
              //a.data,
              a.data >= turno.dataRifInizio &&
              a.data <= turno.dataRifFine &&
              a.data >= dataRifNowInizio &&
              a.data <= dataRifNowFine
              ),
              
              debug: x.presenze.map((a) => a.data),
            };
          });

        const adding =
          resultPresenze.length == 0 || 
          resultPresenze[0].presenze == undefined;
        
        if (adding) {
            const presenzeAdding = new Presenze({
              data: currentDate,
              user: mongoose.Types.ObjectId(user._id),
            });

          // Aggiungere un record sulla collection presenze
          const result = await presenzeAdding.save();
          console.log("Add item in presenze");
        }
      }
    }
    
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      const searchTerm = `PRESENZEALL`;
      redisClient.del(searchTerm);
    }
    
    res.status(200);
    res.json(user);

  } catch (err) {
    console.error(err);
    res.status(500);
    res.json({ Error: err });

  }
});

/**
 * Logout utente
 */
router.post("/logout", async (req, res) => {
  try {
    const user = res.locals.auth;
      console.log("Logout");
      console.log(res.locals.auth);
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      const searchTerm = `PRESENZEALL`;
      redisClient.del(searchTerm);
    }

    res.status(200);
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500);
    res.json({ Error: err });

  }
});


/**
 * Inserimento utente
 * 
 * Inserimento utente nel database
 * Utente:
 *    group
 *    username
 *    password
 *    active
 *    role
 */
router.post("/", async (req, res) => {
  try {

    const user = new User({
      group: req.body.group,
      username: req.body.username,
      password: req.body.password,
      active: false,
      role: req.body.mansione,
    });
    
    // Salva i dati sul mongodb
    const result = await user.save();

    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      const searchTerm = `USERALL`;
      redisClient.del(searchTerm);
    }
      
    res.status(200);
    res.json(result);
  } catch (err) {
    res.status(500);
    res.json({ Error: err });

  }
});

/**
 * Modifica data dell'utente
 * @see model/user.js
 */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    if (id == undefined || id === "undefined") {
      res.status(400).json({message: "Error identify not found"});
      return;
    }

    mailer = req.app.get('mailer');
    mailerTopic = req.app.get('mailerTopic');
    mailerDisabled = req.app.get('mailerDisabled');

    const userUpdate = {
      group: req.body.group,
      username: req.body.username,
      password: req.body.password,
      active: req.body.active
    }

    if (mailer != undefined && !mailerDisabled && mailerTopic != undefined) {
      var query = { idUser: mongoose.Types.ObjectId(id) };
      const dipendenti = await Dipendenti.find(query);
      mailer.publish(mailerTopic, JSON.stringify(dipendenti));
    }
    
    // Aggiorna il documento su mongodb
    const user = await User.updateOne(
      { _id: id },
      { $set: userUpdate });
      
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      const searchTerm = `USERBY${id}`;
      redisClient.del(searchTerm);
    }

    res.status(200).json({
      operation: "Update",
      status: "Success",
    });
  } catch (err) {
    res.status(500).json({ Error: err });

  }
});

/**
 * Elimina l'utente
 * 
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.remove({ _id: id });
    
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      let searchTerm = `USERBY${id}`;
      redisClient.del(searchTerm);
      searchTerm = `USER${id}`;
      redisClient.del(searchTerm);
    }

    res.status(200);
    res.json(user);
  } catch (err) {
    res.status(500).json({ Error: err });

  }
});

module.exports = router;
