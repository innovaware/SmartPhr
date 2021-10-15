const express = require("express");
const router = express.Router();
const Turnimensili = require("../models/turnimensili");
const redis = require("redis");
const redisPort = process.env.REDISPORT || 6379;
const redisHost = process.env.REDISHOST || "redis";
const redisDisabled = process.env.REDISDISABLE === "true" || false;
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;

const client = redis.createClient(redisPort, redisHost);

router.get("/", async (req, res) => {
  try {
    const searchTerm = `TURNIMENSILIALL`;
    // Ricerca su Redis Cache
    client.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data && !redisDisabled) {
        // Dato trovato in cache - ritorna il json 
        res.status(200).send(JSON.parse(data));
      } else {
        // Recupero informazioni dal mongodb
        const turnimensili = await Turnimensili.find();

        // Aggiorno la cache con i dati recuperati da mongodb
        client.setex(searchTerm, redisTimeCache, JSON.stringify(turnimensili));

        // Ritorna il json 
        res.status(200).json(turnimensili);
      }
    });
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).json({ Error: err });
  }
});


//LISTA TURNIMENSILI DIPENDENTE
// http://[HOST]:[PORT]/api/turnimensiliDipendente/[ID_DIPENDENTE]
router.get("/dipendente/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const searchTerm = `TURNIMENSILIBY${id}`;
      client.get(searchTerm, async (err, data) => {
        if (err) throw err;
  
        if (data && !redisDisabled) {
          res.status(200).send(JSON.parse(data));
        } else {
          
          const turnimensili = await Turnimensili.find({ user: id });
  
          client.setex(searchTerm, redisTimeCache, JSON.stringify(turnimensili));
          res.status(200).json(turnimensili);
        }
      });
    } catch (err) {
      res.status(500).json({ Error: err });
    }
  });




// http://[HOST]:[PORT]/api/turnimensili/[ID]
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const searchTerm = `TURNIMENSILIBY${id}`;
    client.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data && !redisDisabled) {
        res.status(200).send(JSON.parse(data));
      } else {
        const turnimensili = await Turnimensili.findById(id);

        client.setex(searchTerm, redisTimeCache, JSON.stringify(turnimensili));
        res.status(200).json(turnimensili);
      }
    });
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

// http://[HOST]:[PORT]/api/turnimensili (POST)
// INSERT turnimensili su DB
router.post("/", async (req, res) => {
  try {
    const turnimensili = new Turnimensili({
        data: req.body.data,
        turno: req.body.turno,
      
    });

    // Salva i dati sul mongodb
    const result = await turnimensili.save();

    const searchTerm = `TURNIMENSILIALL`;
    client.del(searchTerm);

    res.status(200);
    res.json(result);
  } catch (err) {
    res.status(500);
    res.json({ Error: err });
  }
});

// http://[HOST]:[PORT]/api/turnimensili/[ID]
// Modifica delle turnimensili
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // Aggiorna il documento su mongodb
    const turnimensili = await Turnimensili.updateOne(
      { _id: id },
      {
        $set: {
            data: req.body.data,
            turno: req.body.turno
        },
      }
    );

    const searchTerm = `TURNIMENSILIBY${id}`;
    client.del(searchTerm);

    res.status(200).json(turnimensili);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});


module.exports = router;
