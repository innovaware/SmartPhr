const express = require("express");
const router = express.Router();
const DataIngresso = require("../models/dataIngresso");
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;

router.get("/", async (req, res) => {
  try {
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    const getData = () => {
      return DataIngresso.find();
    };

    if (redisClient == undefined || redisDisabled) {
      const ingressi = await getData();
      res.status(200).json(ingressi);
      return;
    }

    const searchTerm = `INGRESSIALL`;
    // Ricerca su Redis Cache
    redisClient.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data) {
        // Dato trovato in cache - ritorna il json
        res.status(200).send(JSON.parse(data));
      } else {
        // Recupero informazioni dal mongodb
        const ingressi = await getData();

        // Aggiorno la cache con i dati recuperati da mongodb
        redisClient.setex(searchTerm, redisTimeCache, JSON.stringify(ingressi));

        // Ritorna il json
        res.status(200).json(ingressi);
      }
    });
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).json({ Error: err });
  }
});

//LISTA INGRESSI PAZIENTE
// http://[HOST]:[PORT]/api/ingresso/[ID_PAZIENTE]
router.get("/paziente/:id", async (req, res) => {
  const { id } = req.params;
  try {
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    const getData = () => {
      return DataIngresso.find({ paziente: id });
    };

    if (redisClient == undefined || redisDisabled) {
      const ingresso = await getData();
      res.status(200).json(eventi);
      return;
    }

    const searchTerm = `INGRESSOBY${id}`;
    redisClient.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data) {
        res.status(200).send(JSON.parse(data));
      } else {
        const ingresso = await getData();

        redisClient.setex(searchTerm, redisTimeCache, JSON.stringify(ingresso));
        res.status(200).json(ingresso);
      }
    });
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

// http://[HOST]:[PORT]/api/INGRESSO/[ID]
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    const getData = () => {
      return DataIngresso.findById(id);
    };

    if (redisClient == undefined || redisDisabled) {
      const ingresso = await getData();
      res.status(200).json(ingresso);
      return;
    }

    const searchTerm = `INGRESSOBY${id}`;
    redisClient.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data) {
        res.status(200).send(JSON.parse(data));
      } else {
        const ingresso = await getData();

        redisClient.setex(searchTerm, redisTimeCache, JSON.stringify(ingresso));
        res.status(200).json(ingresso);
      }
    });
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

// http://[HOST]:[PORT]/api/ingresso (POST)
// INSERT ingresso su DB
router.post("/", async (req, res) => {
  console.log('dataIngresso: ' + req.body);
  try {
    const ingresso = new DataIngresso({
      user: req.body.user,
      sanificazione: req.body.sanificazione,
      sistemazione_letto: req.body.sistemazione_letto,
      armadio: req.body.armadio,
      trattamento_igienico: req.body.trattamento_igienico,
      paziente: req.body.paziente
    });

    // Salva i dati sul mongodb
    const result = await ingresso.save();

    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      redisClient.del(`INGRESSOALL`);
    }

    res.status(200);
    res.json(result);
  } catch (err) {
    res.status(500);
    res.json({ Error: err });
  }
});

// http://[HOST]:[PORT]/api/ingresso/[ID]
// Modifica delle ingresso
router.put("/:id", async (req, res) => {
  try {
    console.log('dataIngresso put: ' + req.body);
    const { id } = req.params;
    // Aggiorna il documento su mongodb
    const ingresso = await DataIngresso.updateOne(
      { _id: id },
      {
        $set: {
            user: req.body.user,
            sanificazione: req.body.sanificazione,
            sistemazione_letto: req.body.sistemazione_letto,
            armadio: req.body.armadio,
            trattamento_igienico: req.body.trattamento_igienico
        },
      }
    );

    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      redisClient.del(`INGRESSOBY${id}`);
    }

    res.status(200).json(ingresso);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

module.exports = router;
