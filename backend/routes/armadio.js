const express = require("express");
const router = express.Router();
const ElementiArmadio = require("../models/elementiArmadio");
const AttivitaArmadio = require("../models/attivitaArmadio");
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;


//ELEMENTI
router.get("/", async (req, res) => {
  try {
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    const getData = () => {
      return ElementiArmadio.find();
    };

    if (redisClient == undefined || redisDisabled) {
      const elementiArmadio = await getData();
      res.status(200).json(elementiArmadio);
      return;
    }

    const searchTerm = `ELEMENTIARMADIOALL`;
    // Ricerca su Redis Cache
    redisClient.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data) {
        // Dato trovato in cache - ritorna il json
        res.status(200).send(JSON.parse(data));
      } else {
        // Recupero informazioni dal mongodb
        const elementiArmadio = await getData();

        // Aggiorno la cache con i dati recuperati da mongodb
        redisClient.setex(searchTerm, redisTimeCache, JSON.stringify(elementiArmadio));

        // Ritorna il json
        res.status(200).json(elementiArmadio);
      }
    });
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).json({ Error: err });
  }
});

//LISTA ELEMENTIARMADIO PAZIENTE
// http://[HOST]:[PORT]/api/armadio/[PAZIENTE]
router.get("/paziente/:id", async (req, res) => {
  const { id } = req.params;
  try {
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    const getData = () => {
      return ElementiArmadio.find({ paziente: id });
    };

    if (redisClient == undefined || redisDisabled) {
      const elementiArmadio = await getData();
      res.status(200).json(elementiArmadio);
      return;
    }

    const searchTerm = `ELEMENTIARMADIOBYPAZIENTE-${id}`;
    redisClient.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data) {
        res.status(200).send(JSON.parse(data));
      } else {
        const elementiArmadio = await getData();

        redisClient.setex(searchTerm, redisTimeCache, JSON.stringify(elementiArmadio));
        res.status(200).json(elementiArmadio);
      }
    });
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

// http://[HOST]:[PORT]/api/armadio/[ID]
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    const getData = () => {
      return ElementiArmadio.findById(id);
    };

    if (redisClient == undefined || redisDisabled) {
      const elementiArmadio = await getData();
      res.status(200).json(elementiArmadio);
      return;
    }

    const searchTerm = `ELEMENTOARMADIOBY${id}`;
    redisClient.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data) {
        res.status(200).send(JSON.parse(data));
      } else {
        const elementiArmadio = await getData();

        redisClient.setex(searchTerm, redisTimeCache, JSON.stringify(elementiArmadio));
        res.status(200).json(elementiArmadio);
      }
    });
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});




//LISTA ATTIVITA
router.get("/attivita/", async (req, res) => {
  try {
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    const getData = () => {
      return AttivitaArmadio.find();
    };

    if (redisClient == undefined || redisDisabled) {
      const attivitaArmadio = await getData();
      res.status(200).json(attivitaArmadio);
      return;
    }

    const searchTerm = `ATTARMADIOALL`;
    // Ricerca su Redis Cache
    redisClient.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data) {
        // Dato trovato in cache - ritorna il json
        res.status(200).send(JSON.parse(data));
      } else {
        // Recupero informazioni dal mongodb
        const attivitaArmadio = await getData();

        // Aggiorno la cache con i dati recuperati da mongodb
        redisClient.setex(searchTerm, redisTimeCache, JSON.stringify(attivitaArmadio));

        // Ritorna il json
        res.status(200).json(attivitaArmadio);
      }
    });
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).json({ Error: err });
  }
});

//LISTA ELEMENTIARMADIO PAZIENTE
// http://[HOST]:[PORT]/api/armadio/attivitapaziente/[PAZIENTE]
router.get("/attivitapaziente/:id", async (req, res) => {
  const { id } = req.params;
  try {
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    const getData = () => {
      return AttivitaArmadio.find({ paziente: id });
    };

    if (redisClient == undefined || redisDisabled) {
      const attivitaArmadio = await getData();
      res.status(200).json(attivitaArmadio);
      return;
    }

    const searchTerm = `ATT-ARMADIOBYPAZIENTE-${id}`;
    redisClient.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data) {
        res.status(200).send(JSON.parse(data));
      } else {
        const attivitaArmadio = await getData();

        redisClient.setex(searchTerm, redisTimeCache, JSON.stringify(attivitaArmadio));
        res.status(200).json(attivitaArmadio);
      }
    });
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});





// http://[HOST]:[PORT]/api/elementiArmadio (POST)
// INSERT permessi su DB
router.post("/", async (req, res) => {
  try {
    const elementoArmadio = new ElementiArmadio({
        paziente: req.body.paziente,
        pazienteName: req.body.pazienteName,
        data: req.body.data,
        elemento: req.body.elemento,
        note: req.body.note,
        quantita: req.body.quantita
    });

    // Salva i dati sul mongodb
    const result = await elementoArmadio.save();


    const attivitaArmadio = new AttivitaArmadio({
      operator: req.body.operator,
      operatorName: req.body.operatorName,
      paziente: req.body.paziente,
      pazienteName: req.body.pazienteName,
      data: req.body.data,
      elemento: req.body.elemento,
      note: req.body.note,
      quantita: req.body.quantita
  });

  // Salva i dati sul mongodb
  const resultAtt = await attivitaArmadio.save();



    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      redisClient.del(`ELEMENTIARMADIOALL`);
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
    const cambiturno = await ElementiArmadio.updateOne(
      { _id: id },
      {
        $set: {
            paziente: req.body.paziente,
            pazienteName: req.body.pazienteName,
            data: req.body.data,
            elemento: req.body.elemento,
            note: req.body.note,
            quantita: req.body.quantita
        },
      }
    );


    const attivitaArmadio = new AttivitaArmadio({
      operator: req.body.operator,
      operatorName: req.body.operatorName,
      paziente: req.body.paziente,
      pazienteName: req.body.pazienteName,
      data: req.body.data,
      elemento: req.body.elemento,
      note: req.body.note,
      quantita: req.body.quantita
  });

  // Salva i dati sul mongodb
  const result = await attivitaArmadio.save();



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
