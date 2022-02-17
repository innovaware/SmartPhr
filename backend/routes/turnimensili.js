const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Turnimensili = require("../models/turnimensili");
const Dipendenti = require("../models/dipendenti");
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;

router.get("/", async (req, res) => {
  try {
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    const getData = () => {
      return Dipendenti.aggregate([
        {
          $lookup: {
            from: "turnimensili",
            localField: "idUser",
            foreignField: "user",
            as: "turni",
          },
        },
      ]);
    };

    if (redisClient == undefined || redisDisabled) {
      const eventi = await getData();
      res.status(200).json(eventi);
      return;
    }

    const searchTerm = `TURNIMENSILIALL`;
    // Ricerca su Redis Cache
    redisClient.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data) {
        // Dato trovato in cache - ritorna il json
        res.status(200).send(JSON.parse(data));
      } else {
        // Recupero informazioni dal mongodb
        const turnimensili = await getData();
        //const turnimensili = await Turnimensili.find();

        // Aggiorno la cache con i dati recuperati da mongodb
        redisClient.setex(searchTerm, redisTimeCache, JSON.stringify(turnimensili));

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
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    const getData = () => {
      return Dipendenti.aggregate([
        { $match: { _id: mongoose.Types.ObjectId(id) } },
        {
          $lookup: {
            from: "turnimensili",
            localField: "idUser",
            foreignField: "user",
            as: "turni",
          },
        },
      ]);
    };

    if (redisClient == undefined || redisDisabled) {
      const eventi = await getData();
      res.status(200).json(eventi);
      return;
    }

    const searchTerm = `TURNIMENSILIBY${id}`;
    redisClient.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data) {
        res.status(200).send(JSON.parse(data));
      } else {
        //const turnimensili = await Turnimensili.find({ user: id });
        const turnimensili = await getData();
        redisClient.setex(searchTerm, redisTimeCache, JSON.stringify(turnimensili));
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
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    const getData = () => {
      return Turnimensili.findById(id);
    };

    if (redisClient == undefined || redisDisabled) {
      const eventi = await getData();
      res.status(200).json(eventi);
      return;
    }

    const searchTerm = `TURNIMENSILIBY${id}`;
    redisClient.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data) {
        res.status(200).send(JSON.parse(data));
      } else {
        const turnimensili = await getData();

        redisClient.setex(searchTerm, redisTimeCache, JSON.stringify(turnimensili));
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
      dataRifInizio: new Date(req.body.dataRifInizio),
      dataRifFine: new Date(req.body.dataRifFine),
      turnoInizio: Number.parseInt(req.body.turnoInizio),
      turnoFine: Number.parseInt(req.body.turnoFine),
      user: mongoose.Types.ObjectId(req.body.user),
    });

    // Salva i dati sul mongodb
    const result = await turnimensili.save();

    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      redisClient.del(`TURNIMENSILIALL`);
    }

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
          dataRifInizio: new Date(req.body.dataRifInizio),
          dataRifFine: new Date(req.body.dataRifFine),
          turnoInizio: Number.parseInt(req.body.turnoInizio),
          turnoFine: Number.parseInt(req.body.turnoFine),
          user: mongoose.Types.ObjectId(req.body.user),
        },
      }
    );

    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      redisClient.del(`TURNIMENSILIBY${id}`);
    }

    res.status(200).json(turnimensili);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

module.exports = router;
