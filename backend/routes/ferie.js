const express = require("express");
const router = express.Router();
const Ferie = require("../models/ferie");
const redis = require("redis");
const redisPort = process.env.REDISPORT || 6379;
const redisHost = process.env.REDISHOST || "redis";
const redisDisabled = process.env.REDISDISABLE === "true" || false;
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;

const client = redis.createClient(redisPort, redisHost);

router.get("/", async (req, res) => {
  try {
    const searchTerm = `FERIEALL`;
    // Ricerca su Redis Cache
    client.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data && !redisDisabled) {
        // Dato trovato in cache - ritorna il json 
        res.status(200).send(JSON.parse(data));
      } else {
        // Recupero informazioni dal mongodb
        const ferie = await Ferie.find();

        // Aggiorno la cache con i dati recuperati da mongodb
        client.setex(searchTerm, redisTimeCache, JSON.stringify(ferie));

        // Ritorna il json 
        res.status(200).json(ferie);
      }
    });
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).json({ Error: err });
  }
});


//LISTA FERIE DIPENDENTE
// http://[HOST]:[PORT]/api/ferieDipendente/[ID_DIPENDENTE]
router.get("/dipendente/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const searchTerm = `FERIEBY${id}`;
      client.get(searchTerm, async (err, data) => {
        if (err) throw err;
  
        if (data && !redisDisabled) {
          res.status(200).send(JSON.parse(data));
        } else {
          const ferie = await Ferie.find({ user: id });
  
          client.setex(searchTerm, redisTimeCache, JSON.stringify(ferie));
          res.status(200).json(ferie);
        }
      });
    } catch (err) {
      res.status(500).json({ Error: err });
    }
  });




// http://[HOST]:[PORT]/api/ferie/[ID]
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const searchTerm = `FERIEBY${id}`;
    client.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data && !redisDisabled) {
        res.status(200).send(JSON.parse(data));
      } else {
        const ferie = await Ferie.findById(id);

        client.setex(searchTerm, redisTimeCache, JSON.stringify(ferie));
        res.status(200).json(ferie);
      }
    });
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

// http://[HOST]:[PORT]/api/ferie (POST)
// INSERT Ferie su DB
router.post("/", async (req, res) => {
  try {
    const ferie = new Ferie({
        dataInizio: req.body.dataInizio,
        dataFine: req.body.dataFine,
        dataRichiesta: req.body.dataRichiesta,
        accettata: false,
        user: req.body.user,
        cognome: req.body.cognome,
        nome: req.body.nome,
        cf: req.body.cf,
        closed: false
    });

    // Salva i dati sul mongodb
    const result = await ferie.save();

    const searchTerm = `FERIEALL`;
    client.del(searchTerm);

    res.status(200);
    res.json(result);
  } catch (err) {
    res.status(500);
    res.json({ Error: err });
  }
});

// http://[HOST]:[PORT]/api/ferie/[ID]
// Modifica delle ferie
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // Aggiorna il documento su mongodb
    const ferie = await Ferie.updateOne(
      { _id: id },
      {
        $set: {
            dataInizio: req.body.dataInizio,
            dataFine: req.body.dataFine,
            dataRichiesta: req.body.dataRichiesta,
            accettata: req.body.accettata,
            user: req.body.user,
            cognome: req.body.cognome,
            nome: req.body.nome,
            cf: req.body.cf,
            closed: true
        },
      }
    );

    const searchTerm = `FERIEBY${id}`;
    client.del(searchTerm);

    res.status(200).json(ferie);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});


module.exports = router;
