const User = require("../models/user");
const Mansioni = require("../models/mansioni");
const express = require("express");
const redis = require("redis");

const router = express.Router();
//const redisPort = process.env.REDISPORT || 6379;
//const redisHost = process.env.REDISHOST || "redis";
//const redisDisabled = process.env.REDISDISABLE === "true" || false;
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;
//const client = redis.createClient(redisPort, redisHost);

router.get("/", async (req, res) => {
  try {
    const getData = () => {
      return Mansioni.find();
    };

    // Se non usamu Redis
    const mansioni = await getData();
    res.status(200).json(mansioni);

  } catch (err) {
    console.error("Errore: ", err);
    res.status(500).json({ Errore: err });
  }
});


// http://[HOST]:[PORT]/api/mansioni/[ID]
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        // Funzioni ca pigghia i dati di na mansioni particolari
        const getData = () => {
            return Mansioni.findById(id);
        };

        // Si non stamu usannu Redis
        const mansioni = await getData();
        res.status(200).json(mansioni);
    } catch (err) {
        res.status(500).json({ Errore: err });
    }
});



// http://[HOST]:[PORT]/api/mansioni (POST)
// INSERT mansioni su DB
router.post("/", async (req, res) => {
  try {

    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");
    clientMailerService = req.app.get("mailer");
    clientMailerTopic = req.app.get("mailerTopic");
    clientMailerDiabled = req.app.get("mailerDisabled");


    const mansione = new Mansioni({
        descrizione: req.body.descrizione,
        codice: req.body.codice
    });

    const result = await mansione.save();



    res.status(200);
    res.json(result);
  } catch (err) {
    res.status(500);
    res.json({ Error: err });
  }
});

// http://[HOST]:[PORT]/api/dipendenti/[ID_DIPENDENTE]
// Modifica del dipendente
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // Aggiorna il documento su mongodb
    const mansione = await Mansioni.updateOne(
      { _id: id },
      {
        $set: {
            descrizione: req.body.descrizione,
            codice: req.body.codice
        },
      }
    );


    res.status(200).json(mansione);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const mansione = await Mansioni.remove({ _id: id });


    res.status(200);
    res.json(mansione);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

module.exports = router;
