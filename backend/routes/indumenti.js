const express = require("express");
const Indumenti = require("../models/indumenti");
const Log = require("../models/log");
const Dipendenti = require("../models/dipendenti");
const router = express.Router();
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;

router.get("/", async (req, res) => {
  try {
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");


    const getData = () => {
      return Indumenti.find();
    };

    if (redisClient == undefined || redisDisabled) {
      const indumenti = await getData();
      res.status(200).json(indumenti);
      return;
    }

    const searchTerm = `INDUMENTIALL`;
    // Ricerca su Redis Cache
    redisClient.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data) {
        // Dato trovato in cache - ritorna il json
        res.status(200).send(JSON.parse(data));
      } else {
        // Recupero informazioni dal mongodb
        const indumenti = await getData();

        // Aggiorno la cache con i dati recuperati da mongodb
        redisClient.setex(searchTerm, redisTimeCache, JSON.stringify(indumenti));

        // Ritorna il json
        res.status(200).json(indumenti);
      }
    });
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).json({ Error: err });
  }
});


router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    const getData = () => {
      return Indumenti.findById(id);
    };

    if (redisClient == undefined || redisDisabled) {
      const indumenti = await getData();
      res.status(200).json(indumenti);
      return;
    }

    const searchTerm = `INDUMENTI${id}`;
    redisClient.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data) {
        res.status(200).send(JSON.parse(data));
      } else {
        const indumenti = await getData();

        redisClient.setex(searchTerm, redisTimeCache, JSON.stringify(indumenti));
        res.status(200).json(indumenti);
      }
    });
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});


router.post("/", async (req, res) => {
  try {
    const indumenti = new Indumenti(req.body);
    console.log(req.body);

      const result = await indumenti.save();

      const user = res.locals.auth;

      const getDipendente = () => {
          return Dipendenti.findById(user.dipendenteID);
      };

      const dipendenti = await getDipendente();

      const log = new Log({
          data: new Date(),
          operatore: dipendenti.nome + " " + dipendenti.cognome,
          operatoreID: user.dipendenteID,
          className: "Indumenti",
          operazione: "Inserimento indumento: " + indumenti.nome + ". Quantità: " + indumenti.quantita,
      });
      console.log("log: ", log);
      const resultLog = await log.save();

    res.status(200);
    res.json(result);

  } catch (err) {
    res.status(500);
    res.json({"Error": err});
  }
});


module.exports = router;
