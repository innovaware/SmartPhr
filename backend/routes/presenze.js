const express = require("express");
const router = express.Router();
const Presenze = require("../models/presenze");
const redis = require("redis");
const redisPort = process.env.REDISPORT || 6379;
const redisHost = process.env.REDISHOST || "redis";
const redisDisabled = process.env.REDISDISABLE === "true" || false;
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;

const client = redis.createClient(redisPort, redisHost);

router.get("/", async (req, res) => {
  try {
    const searchTerm = `PRESENZEALL`;
    // Ricerca su Redis Cache
    client.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data && !redisDisabled) {
        // Dato trovato in cache - ritorna il json 
        res.status(200).send(JSON.parse(data));
      } else {
        // Recupero informazioni dal mongodb
        const presenze = await Presenze.find();

        // Aggiorno la cache con i dati recuperati da mongodb
        client.setex(searchTerm, redisTimeCache, JSON.stringify(presenze));

        // Ritorna il json 
        res.status(200).json(presenze);
      }
    });
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).json({ Error: err });
  }
});


//LISTA PRESENZE DIPENDENTE
// http://[HOST]:[PORT]/api/presenzeDipendente/[ID_DIPENDENTE]
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const searchTerm = `PRESENZEBY${id}`;
      client.get(searchTerm, async (err, data) => {
        if (err) throw err;
  
        if (data && !redisDisabled) {
          res.status(200).send(JSON.parse(data));
        } else {
          const presenze = await Presenze.find(({ userId }) => userId === id);
  
          client.setex(searchTerm, redisTimeCache, JSON.stringify(presenze));
          res.status(200).json(presenze);
        }
      });
    } catch (err) {
      res.status(500).json({ Error: err });
    }
  });




// http://[HOST]:[PORT]/api/presenze/[ID]
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const searchTerm = `PRESENZEBY${id}`;
    client.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data && !redisDisabled) {
        res.status(200).send(JSON.parse(data));
      } else {
        const presenze = await Presenze.findById(id);

        client.setex(searchTerm, redisTimeCache, JSON.stringify(presenze));
        res.status(200).json(presenze);
      }
    });
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

// http://[HOST]:[PORT]/api/presenze (POST)
// INSERT permessi su DB
router.post("/", async (req, res) => {
  try {
    const presenze = new Presenze({
        data: req.body.data,
        turno: req.body.turno,
      
    });

    // Salva i dati sul mongodb
    const result = await presenze.save();

    const searchTerm = `PRESENZEALL`;
    client.del(searchTerm);

    res.status(200);
    res.json(result);
  } catch (err) {
    res.status(500);
    res.json({ Error: err });
  }
});

// http://[HOST]:[PORT]/api/presenze/[ID]
// Modifica delle presenze
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // Aggiorna il documento su mongodb
    const presenze = await Presenze.updateOne(
      { _id: id },
      {
        $set: {
            data: req.body.data,
            turno: req.body.turno
        },
      }
    );

    const searchTerm = `PRESENZEBY${id}`;
    client.del(searchTerm);

    res.status(200).json(presenze);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});


module.exports = router;
