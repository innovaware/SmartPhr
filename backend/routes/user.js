const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const User = require("../models/user");
const Dipendenti = require("../models/dipendenti");
const Presenze = require("../models/presenze");
const Turnimensili = require("../models/turnimensili");

const redis = require("redis");
//const redisPort = process.env.REDISPORT || 6379;
//const redisHost = process.env.REDISHOST || "redis";
//const redisDisabled = process.env.REDISDISABLE === "true" || false;
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;
//const client = redis.createClient(redisPort, redisHost);

router.get("/info/:id", async (req, res) => {
  const { id } = req.params;
  try {
    var query = { idUser: mongoose.Types.ObjectId(id) };
    console.log("Info: ", query);
    const dipendenti = await Dipendenti.find(query);
    res.status(200).json(dipendenti);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

router.get("/", async (req, res) => {
  const getData = () => {
    const users = User.find();
    return users;
  }

  try {
    redisClient = res.locals.clientRedis;
    if (redisClient == undefined) {
      const users = await getData();
      res.status(200).json(users);      
      return;
    }
    else {
      const searchTerm = `USERALL`;
      // Ricerca su Redis Cache
      client.get(searchTerm, async (err, data) => {
        if (err) throw err;
        
        if (data && !redisDisabled) {
          // Dato trovato in cache - ritorna il json
          res.status(200).send(JSON.parse(data));
        } else {
          // Recupero informazioni dal mongodb
          const users = await getData(); 
          // Aggiorno la cache con i dati recuperati da mongodb
          client.setex(searchTerm, redisTimeCache, JSON.stringify(users));
          
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

// http://[HOST]:[PORT]/api/user/[ID_USER]
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const searchTerm = `USERBY${id}`;
    client.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data && !redisDisabled) {
        res.status(200).send(JSON.parse(data));
      } else {
        const user = await User.findById(id);

        client.setex(searchTerm, redisTimeCache, JSON.stringify(user));
        res.status(200).json(user);
      }
    });
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

router.post("/authenticate", async (req, res) => {
  try {
    const user = res.locals.auth;

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
      const turno = await Turnimensili.findOne({
        user: mongoose.Types.ObjectId(user._id),
        dataRifInizio: { $lte: new Date() },
        dataRifFine: { $gte: new Date() },
      });

      if (turno != null) {
        const dataRif = new Date();
        const dataRifNowInizio =  new Date(
          Date.UTC(
            dataRif.getFullYear(), 
            dataRif.getMonth(), 
            dataRif.getDate(), 
            0, 
            0, 
            0)); 

        const dataRifNowFine =  new Date(
          Date.UTC(
            dataRif.getFullYear(), 
            dataRif.getMonth(), 
            dataRif.getDate(), 
            0, 
            0, 
            0)); 

        
        //dataRif2.setTimezone('Europe/Rome');
        
        turno.dataRifInizio.setHours( turno.turnoInizio );
        turno.dataRifFine.setHours( turno.turnoFine );
        dataRifNowInizio.setHours( turno.turnoInizio );
        dataRifNowFine.setHours( turno.turnoFine );
        
        const resultPrenseze = presenzeFind.map(
          x => {
            return {
              presenze: x.presenze
              .find(a=> 
                //a.data,
                a.data >= turno.dataRifInizio && a.data <= turno.dataRifFine &&
                  a.data >= dataRifNowInizio && a.data <= dataRifNowFine
                ),

              debug: x.presenze.map(a=> a.data)
                
              }
            })
            
            
        const adding = resultPrenseze.length == 0 || resultPrenseze[0].presenze == undefined;
        if (adding) {
          const presenzeAdding = new Presenze({
            data: new Date(),
            user: mongoose.Types.ObjectId(user._id),
          });
          
          // Aggiungere un record sulla collection presenze
          const result = await presenzeAdding.save();
          console.log("Add item in presenze");
        }
      }
    }
        
    const searchTerm = `PRESENZEALL`;
    client.del(searchTerm);

    res.status(200);
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500);
    res.json({ Error: err });
  }
});

router.post("/logout", async (req, res) => {
  try {
    const user = res.locals.auth;
       console.log("Logout"); 
    const searchTerm = `PRESENZEALL`;
    client.del(searchTerm);

    res.status(200);
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500);
    res.json({ Error: err });
  }
});

// http://[HOST]:[PORT]/api/user (POST)
// INSERT
router.post("/", async (req, res) => {
  try {
    clientMailerService = res.locals.clientMailerService;
    topic = res.locals.topicMailerservice;

    const user = new User({
      group: req.body.group,
      username: req.body.username,
      password: req.body.password,
      active: false,
      role: "",
    });

    // Salva i dati sul mongodb
    const result = await user.save();

    const searchTerm = `USERALL`;
    client.del(searchTerm);

    res.status(200);
    res.json(result);
  } catch (err) {
    res.status(500);
    res.json({ Error: err });
  }
});

// http://[HOST]:[PORT]/api/user/[ID_USER]
// Modifica
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (id == undefined || id === "undefined") {
      res.status(400).json({
        message: "Error identify not found",
      });
      return;
    }

    // Aggiorna il documento su mongodb
    const user = await User.updateOne(
      { _id: id },
      {
        $set: {
          group: req.body.group,
          username: req.body.username,
          password: req.body.password,
          active: req.body.active,
          role: "",
        },
      }
    );

    const searchTerm = `USERBY${id}`;
    client.del(searchTerm);

    res.status(200).json({
      operation: "Update",
      status: "Success",
    });
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.remove({ _id: id });

    let searchTerm = `USERBY${id}`;
    client.del(searchTerm);
    searchTerm = `USER${id}`;
    client.del(searchTerm);

    res.status(200);
    res.json(user);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

module.exports = router;
