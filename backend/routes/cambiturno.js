const express = require("express");
const router = express.Router();
const CambiTurno = require("../models/cambiturno");
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;

router.get("/", async (req, res) => {
  try {
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    const getData = () => {
      return CambiTurno.find();
    };

    if (redisClient == undefined || redisDisabled) {
      const eventi = await getData();
      res.status(200).json(eventi);
      return;
    }

    const searchTerm = `CAMBITURNOALL`;
    // Ricerca su Redis Cache
    redisClient.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data) {
        // Dato trovato in cache - ritorna il json
        res.status(200).send(JSON.parse(data));
      } else {
        // Recupero informazioni dal mongodb
        const cambiturno = await getData();

        // Aggiorno la cache con i dati recuperati da mongodb
        redisClient.setex(searchTerm, redisTimeCache, JSON.stringify(cambiturno));

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
router.get("/dipendente/:id", async (req, res) => {
  const { id } = req.params;
  try {
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    const getData = () => {
      return CambiTurno.find({ user: id });
    };

    if (redisClient == undefined || redisDisabled) {
      const eventi = await getData();
      res.status(200).json(eventi);
      return;
    }

    const searchTerm = `CAMBITURNOBY${id}`;
    redisClient.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data) {
        res.status(200).send(JSON.parse(data));
      } else {
        const cambiturno = await getData();

        redisClient.setex(searchTerm, redisTimeCache, JSON.stringify(cambiturno));
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
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    const getData = () => {
      return CambiTurno.findById(id);
    };

    if (redisClient == undefined || redisDisabled) {
      const eventi = await getData();
      res.status(200).json(eventi);
      return;
    }

    const searchTerm = `CAMBITURNOBY${id}`;
    redisClient.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data) {
        res.status(200).send(JSON.parse(data));
      } else {
        const cambiturno = await getData();

        redisClient.setex(searchTerm, redisTimeCache, JSON.stringify(cambiturno));
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
      user: req.body.user,
      cognome: req.body.cognome,
      nome: req.body.nome,
      cf: req.body.cf,
      user: req.body.user,
      dataInizioVT: req.body.dataInizioVT,
      dataFineVT: req.body.dataFineVT,
      dataInizioNT: req.body.dataInizioNT,
      dataFineNT: req.body.dataFineNT,
      motivazione: req.body.motivazione,
      dataRichiesta: req.body.dataRichiesta,
      accettata: false,
      closed: false,
    });

    // Salva i dati sul mongodb
    const result = await cambiturno.save();

    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      redisClient.del(`CAMBITURNOALL`);
    }

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
          dataInizioVT: req.body.dataInizioVT,
          dataFineVT: req.body.dataFineVT,
          dataInizioNT: req.body.dataInizioNT,
          dataFineNT: req.body.dataFineNT,
          motivazione: req.body.motivazione,
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
      redisClient.del(`CAMBITURNOBY${id}`);
    }

    res.status(200).json(cambiturno);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

module.exports = router;
