const express = require("express");
const router = express.Router();
const Permessi = require("../models/permessi");
const redis = require("redis");
const redisPort = process.env.REDISPORT || 6379;
const redisHost = process.env.REDISHOST || "redis";
const redisDisabled = process.env.REDISDISABLE === "true" || false;
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;

const client = redis.createClient(redisPort, redisHost);

router.get("/", async (req, res) => {
  try {
    const searchTerm = `PERMESSIALL`;
    // Ricerca su Redis Cache
    client.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data && !redisDisabled) {
        // Dato trovato in cache - ritorna il json 
        res.status(200).send(JSON.parse(data));
      } else {
        // Recupero informazioni dal mongodb
        const permessi = await Permessi.find();

        // Aggiorno la cache con i dati recuperati da mongodb
        client.setex(searchTerm, redisTimeCache, JSON.stringify(permessi));

        // Ritorna il json 
        res.status(200).json(permessi);
      }
    });
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).json({ Error: err });
  }
});


//LISTA PERMESSI DIPENDENTE
// http://[HOST]:[PORT]/api/permessiDipendente/[ID_DIPENDENTE]
router.get("/dipendente/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const searchTerm = `PERMESSIBY${id}`;
      client.get(searchTerm, async (err, data) => {
        if (err) throw err;
  
        if (data && !redisDisabled) {
          res.status(200).send(JSON.parse(data));
        } else {
         
          const permessi = await Permessi.find({ user: id });
  
          client.setex(searchTerm, redisTimeCache, JSON.stringify(permessi));
          res.status(200).json(permessi);
        }
      });
    } catch (err) {
      res.status(500).json({ Error: err });
    }
  });




// http://[HOST]:[PORT]/api/permessi/[ID]
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const searchTerm = `PERMESSIBY${id}`;
    client.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data && !redisDisabled) {
        res.status(200).send(JSON.parse(data));
      } else {
        const permessi = await Permessi.findById(id);

        client.setex(searchTerm, redisTimeCache, JSON.stringify(permessi));
        res.status(200).json(permessi);
      }
    });
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

// http://[HOST]:[PORT]/api/permessi (POST)
// INSERT permessi su DB
router.post("/", async (req, res) => {
  try {
    const permessi = new Permessi({
        dataInizio: req.body.dataInizio,
        dataFine: req.body.dataFine,
        dataRichiesta: req.body.dataRichiesta,
        accettata: false,
        user: req.body.idUser,
        closed: false
    });

    // Salva i dati sul mongodb
    const result = await permessi.save();

    const searchTerm = `PERMESSIALL`;
    client.del(searchTerm);

    res.status(200);
    res.json(result);
  } catch (err) {
    res.status(500);
    res.json({ Error: err });
  }
});

// http://[HOST]:[PORT]/api/permessi/[ID]
// Modifica delle permessi
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // Aggiorna il documento su mongodb
    const permessi = await Permessi.updateOne(
      { _id: id },
      {
        $set: {
            dataInizio: req.body.dataInizio,
            dataFine: req.body.dataFine,
            dataRichiesta: req.body.dataRichiesta,
            accettata: req.body.accettata,
            closed: true
        },
      }
    );

    const searchTerm = `PERMESSIBY${id}`;
    client.del(searchTerm);

    res.status(200).json(permessi);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});


module.exports = router;
