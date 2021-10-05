const express = require("express");
const router = express.Router();
const CambiTurno = require("../models/cambiturno");
const redis = require("redis");
const redisPort = process.env.REDISPORT || 6379;
const redisHost = process.env.REDISHOST || "redis";
const redisDisabled = process.env.REDISDISABLE === "true" || false;
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;

const client = redis.createClient(redisPort, redisHost);

router.get("/", async (req, res) => {
  try {
    const searchTerm = `CAMBITURNOALL`;
    // Ricerca su Redis Cache
    client.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data && !redisDisabled) {
        // Dato trovato in cache - ritorna il json 
        res.status(200).send(JSON.parse(data));
      } else {
        // Recupero informazioni dal mongodb
        const cambiturno = await CambiTurno.find();

        // Aggiorno la cache con i dati recuperati da mongodb
        client.setex(searchTerm, redisTimeCache, JSON.stringify(cambiturno));

        // Ritorna il json 
        res.status(200).json(cambiturno);
      }
    });
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).json({ Error: err });
  }
});


//LISTA CAMBITURNO DIPENDENTE
// http://[HOST]:[PORT]/api/cambiturnoDipendente/[ID_DIPENDENTE]
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const searchTerm = `CAMBITURNOBY${id}`;
      client.get(searchTerm, async (err, data) => {
        if (err) throw err;
  
        if (data && !redisDisabled) {
          res.status(200).send(JSON.parse(data));
        } else {
          const cambiturno = await CambiTurno.find(({ userId }) => userId === id);
  
          client.setex(searchTerm, redisTimeCache, JSON.stringify(cambiturno));
          res.status(200).json(cambiturno);
        }
      });
    } catch (err) {
      res.status(500).json({ Error: err });
    }
  });




// http://[HOST]:[PORT]/api/cambiturno/[ID]
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const searchTerm = `CAMBITURNOBY${id}`;
    client.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data && !redisDisabled) {
        res.status(200).send(JSON.parse(data));
      } else {
        const cambiturno = await CambiTurno.findById(id);

        client.setex(searchTerm, redisTimeCache, JSON.stringify(cambiturno));
        res.status(200).json(cambiturno);
      }
    });
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

// http://[HOST]:[PORT]/api/cambiturno (POST)
// INSERT permessi su DB
router.post("/", async (req, res) => {
  try {
    const cambiturno = new CambiTurno({
        dataInizio: req.body.dataInizio,
        dataFine: req.body.dataFine,
        dataRichiesta: req.body.dataRichiesta,
        accettata: false,
        userId: req.body.idUser
    });

    // Salva i dati sul mongodb
    const result = await cambiturno.save();

    const searchTerm = `CAMBITURNOALL`;
    client.del(searchTerm);

    res.status(200);
    res.json(result);
  } catch (err) {
    res.status(500);
    res.json({ Error: err });
  }
});

// http://[HOST]:[PORT]/api/cambiturno/[ID]
// Modifica delle cambiturno
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // Aggiorna il documento su mongodb
    const cambiturno = await CambiTurno.updateOne(
      { _id: id },
      {
        $set: {
            dataInizio: req.body.dataInizio,
            dataFine: req.body.dataFine,
            dataRichiesta: req.body.dataRichiesta,
            accettata: req.body.accettata
        },
      }
    );

    const searchTerm = `CAMBITURNOBY${id}`;
    client.del(searchTerm);

    res.status(200).json(cambiturno);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});


module.exports = router;
