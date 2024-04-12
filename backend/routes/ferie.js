const express = require("express");
const router = express.Router();
const Ferie = require("../models/ferie");
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;

router.get("/", async (req, res) => {
  try {
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    const getData = () => {
      return Ferie.find();
    };

    if (redisClient == undefined || redisDisabled) {
      const eventi = await getData();
      res.status(200).json(eventi);
      return;
    }

    const searchTerm = `FERIEALL`;
    // Ricerca su Redis Cache
    redisClient.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data) {
        // Dato trovato in cache - ritorna il json
        res.status(200).send(JSON.parse(data));
      } else {
        // Recupero informazioni dal mongodb
        const ferie = await getData();

        // Aggiorno la cache con i dati recuperati da mongodb
        redisClient.setex(searchTerm, redisTimeCache, JSON.stringify(ferie));

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
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

      const getData = () => {
          return Ferie.find({
            $and: [
                {
                    $or: [{ cancellato: { $exists: false } }, { cancellato: false }],
                  },
                  { user: id },
            ],
        });
    };

    if (redisClient == undefined || redisDisabled) {
      const eventi = await getData();
      res.status(200).json(eventi);
      return;
    }

    const searchTerm = `FERIEBY${id}`;
    redisClient.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data) {
        res.status(200).send(JSON.parse(data));
      } else {
        const ferie = await getData();

        redisClient.setex(searchTerm, redisTimeCache, JSON.stringify(ferie));
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
  
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    const getData = () => {
      return Ferie.findById(id);
    };

    if (redisClient == undefined || redisDisabled) {
      const eventi = await getData();
      res.status(200).json(eventi);
      return;
    }
    const searchTerm = `FERIEBY${id}`;
    redisClient.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data) {
        res.status(200).send(JSON.parse(data));
      } else {
        const ferie = await getData();

        redisClient.setex(searchTerm, redisTimeCache, JSON.stringify(ferie));
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
      closed: false,
    });

    // Salva i dati sul mongodb
    const result = await ferie.save();

 
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if(redisClient != undefined && !redisDisabled) {
      redisClient.del(`FERIEALL`);
    }

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
          closed: true,
        },
      }
    );
 
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if(redisClient != undefined && !redisDisabled) {
      redisClient.del(`FERIEBY${id}`);
    }

    res.status(200).json(ferie);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

/// Eliminare Ferie
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        if (id == undefined || id === "undefined") {
            console.log("Error id is not defined ", id);
            res.status(404).json({ Error: "Id not defined" });
            return;
        }

        if (id == null) {
            res.status(400).json({ error: "id not valid" });
        }

        const richiesta = await Ferie.updateOne(
            { _id: id },
            {
                $set: {
                    cancellato: true,
                    dataCancellazione: new Date().getDate(),
                },
            }
        );

        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        if (redisClient != undefined && !redisDisabled) {
            redisClient.del(`FERIEBY${id}`);
            redisClient.del(`FERIEALL`);
        }

        res.status(200);
        res.json(richiesta);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

module.exports = router;
