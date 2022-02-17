const express = require("express");
const router = express.Router();
const Permessi = require("../models/permessi");
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;

router.get("/", async (req, res) => {
  try {
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    const getData = () => {
      return Permessi.find();
    };

    if (redisClient == undefined || redisDisabled) {
      const eventi = await getData();
      res.status(200).json(eventi);
      return;
    }

    const searchTerm = `PERMESSIALL`;
    // Ricerca su Redis Cache
    redisClient.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data) {
        // Dato trovato in cache - ritorna il json
        res.status(200).send(JSON.parse(data));
      } else {
        // Recupero informazioni dal mongodb
        const permessi = await getData();

        // Aggiorno la cache con i dati recuperati da mongodb
        redisClient.setex(searchTerm, redisTimeCache, JSON.stringify(permessi));

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
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    const getData = () => {
      return Permessi.find({ user: id });
    };

    if (redisClient == undefined || redisDisabled) {
      const eventi = await getData();
      res.status(200).json(eventi);
      return;
    }

    const searchTerm = `PERMESSIBY${id}`;
    redisClient.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data) {
        res.status(200).send(JSON.parse(data));
      } else {
        const permessi = await getData();

        redisClient.setex(searchTerm, redisTimeCache, JSON.stringify(permessi));
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
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    const getData = () => {
      return Permessi.findById(id);
    };

    if (redisClient == undefined || redisDisabled) {
      const eventi = await getData();
      res.status(200).json(eventi);
      return;
    }

    const searchTerm = `PERMESSIBY${id}`;
    redisClient.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data && !redisDisabled) {
        res.status(200).send(JSON.parse(data));
      } else {
        const permessi = await getData();

        redisClient.setex(searchTerm, redisTimeCache, JSON.stringify(permessi));
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
      user: req.body.user,
      closed: false,
    });

    // Salva i dati sul mongodb
    const result = await permessi.save();
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      redisClient.del(`PERMESSIALL`);
    }

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
          user: req.body.user,
          closed: true,
        },
      }
    );

    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      redisClient.del(`PERMESSIBY${id}`);
    }

    res.status(200).json(permessi);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

module.exports = router;
