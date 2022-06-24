const express = require("express");
const router = express.Router();
const AttivitaFarmaciPresidi = require("../models/attivitaFarmaciPresidi");
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;

router.get("/farmaci", async (req, res) => {
  try {
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    const getData = () => {
      return AttivitaFarmaciPresidi.find({ 
        type: "Farmaci"
       });
    };

    if (redisClient == undefined || redisDisabled) {
      const attivita = await getData();
      res.status(200).json(attivita);
      return;
    }

    const searchTerm = `ATTIVITAALL`;
    // Ricerca su Redis Cache
    redisClient.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data) {
        // Dato trovato in cache - ritorna il json
        res.status(200).send(JSON.parse(data));
      } else {
        // Recupero informazioni dal mongodb
        const attivita = await getData();

        // Aggiorno la cache con i dati recuperati da mongodb
        redisClient.setex(searchTerm, redisTimeCache, JSON.stringify(attivita));

        // Ritorna il json
        res.status(200).json(attivita);
      }
    });
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).json({ Error: err });
  }
});


router.get("/presidi", async (req, res) => {
  try {
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    const getData = () => {
      return AttivitaFarmaciPresidi.find({ 
        type: "Presidi"
       });
    };

    if (redisClient == undefined || redisDisabled) {
      const attivita = await getData();
      res.status(200).json(attivita);
      return;
    }

    const searchTerm = `ATTIVITAALL`;
    // Ricerca su Redis Cache
    redisClient.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data) {
        // Dato trovato in cache - ritorna il json
        res.status(200).send(JSON.parse(data));
      } else {
        // Recupero informazioni dal mongodb
        const attivita = await getData();

        // Aggiorno la cache con i dati recuperati da mongodb
        redisClient.setex(searchTerm, redisTimeCache, JSON.stringify(attivita));

        // Ritorna il json
        res.status(200).json(attivita);
      }
    });
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).json({ Error: err });
  }
});




//LISTA ATTIVITA PAZIENTE
router.get("/farmacipaziente/:id", async (req, res) => {
  const { id } = req.params;
  try {
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    var start = new Date();
  start.setHours(0,0,0,0);

  var end = new Date();
  end.setHours(23,59,59,999);

  console.log('PAZIENTE: ' + id);
  console.log('start: ' + start);
  console.log('end: ' + end);

    const getData = () => {
      return Attivita.find({ 
          paziente: id,
          type: "Farmaci"
         });
    };

    if (redisClient == undefined || redisDisabled) {
      const attivita = await getData();
      res.status(200).json(attivita);
      return;
    }

    const searchTerm = `ATTIVITABY${id}`;
    redisClient.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data) {
        res.status(200).send(JSON.parse(data));
      } else {
        const attivita = await getData();

        redisClient.setex(searchTerm, redisTimeCache, JSON.stringify(attivita));
        res.status(200).json(attivita);
      }
    });
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});


router.get("/presidipaziente/:id", async (req, res) => {
  const { id } = req.params;
  try {
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    var start = new Date();
  start.setHours(0,0,0,0);

  var end = new Date();
  end.setHours(23,59,59,999);

  console.log('PAZIENTE: ' + id);
  console.log('start: ' + start);
  console.log('end: ' + end);

    const getData = () => {
      return Attivita.find({ 
          paziente: id,
          type: "Presidi"
         });
    };

    if (redisClient == undefined || redisDisabled) {
      const attivita = await getData();
      res.status(200).json(attivita);
      return;
    }

    const searchTerm = `ATTIVITABY${id}`;
    redisClient.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data) {
        res.status(200).send(JSON.parse(data));
      } else {
        const attivita = await getData();

        redisClient.setex(searchTerm, redisTimeCache, JSON.stringify(attivita));
        res.status(200).json(attivita);
      }
    });
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});




module.exports = router;
