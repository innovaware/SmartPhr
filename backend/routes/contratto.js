const express = require("express");
const router = express.Router();
const Contratto = require("../models/contratto");
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;

router.get("/consulente/:id", async (req, res) => {
  try {
    const { id } = req.params;

    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    const getData = () => {
      return Contratto.find({
        idConsulente: id,
      });
    };

    if (redisClient == undefined || redisDisabled) {
      const eventi = await getData();
      res.status(200).json(eventi);
      return;
    }

    const searchTerm = `CONTRATTOCONSULENTE${id}`;
    redisClient.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data) {
        res.status(200).send(JSON.parse(data));
      } else {
        const contratto = await getData();
        redisClient.setex(searchTerm, redisTimeCache, JSON.stringify(contratto));
        res.status(200).json(contratto);
      }
    });
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).json({ Error: err });
  }
});

router.get("/", async (req, res) => {
  try {
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    const getData = () => {
      return Contratto.find();
    };

    if (redisClient == undefined || redisDisabled) {
      const eventi = await getData();
      res.status(200).json(eventi);
      return;
    }

    const searchTerm = `CONTRATTOALL`;
    // Ricerca su Redis Cache
    redisClient.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data) {
        // Dato trovato in cache - ritorna il json
        res.status(200).send(JSON.parse(data));
      } else {
        // Recupero informazioni dal mongodb
        const contratti = await getData();

        // Aggiorno la cache con i dati recuperati da mongodb
        redisClient.setex(searchTerm, redisTimeCache, JSON.stringify(contratti));

        // Ritorna il json
        res.status(200).json(contratti);
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
      return Contratto.findById(id);
    };

    if (redisClient == undefined || redisDisabled) {
      const eventi = await getData();
      res.status(200).json(eventi);
      return;
    }

    const searchTerm = `CONTRATTOBY${id}`;
    redisClient.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data) {
        res.status(200).send(JSON.parse(data));
      } else {
        const contratto = await getData();
        redisClient.setex(searchTerm, redisTimeCache, JSON.stringify(contratto));
        res.status(200).json(contratto);
      }
    });
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

router.post("/consulente/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const contratto = new Contratto({
      idConsulente: id,
      filename: req.body.filename,
      dateupload: Date.now(),
      note: req.body.note,
    });

    console.log("Insert contratto: ", contratto);

    const result = await contratto.save();
    
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");
    if (redisClient != undefined && !redisDisabled) {
      redisClient.del(`CONTRATTOCONSULENTE${id}`);
    }

    res.status(200);
    res.json(result);
  } catch (err) {
    res.status(500);
    res.json({ Error: err });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const contratto = await Contratto.updateOne(
      { _id: id },
      {
        $set: {
          idConsulente: req.body.pazienteID,
          filename: req.body.filename,
          note: req.body.note,
        },
      }
    );

    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");
    if (redisClient != undefined && !redisDisabled) {
      redisClient.del(`CONTRATTOBY${id}`);
    }

    res.status(200).json(contratto);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Contratto.findById(id);
    const idConsulente = item.idConsulente;
    const contratto = await Contratto.remove({ _id: id });

    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");
    if (redisClient != undefined && !redisDisabled) {
      redisClient.del(`CONTRATTOBY${id}`);
      redisClient.del(`CONTRATTOCONSULENTE${idConsulente}`);
    }

    res.status(200).json(contratto);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

module.exports = router;
