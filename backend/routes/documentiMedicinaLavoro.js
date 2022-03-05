const express = require("express");
const router = express.Router();
const DocMedicinaLavoro = require("../models/documentiMedicinaLavoro");
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;

router.get("/dipendente/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let type = req.params.type;

    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    const query = { dipendente: id };

    const getData = () => {
      return DocMedicinaLavoro.find(query);
    };

    if (redisClient == undefined || redisDisabled) {
      const eventi = await getData();
      res.status(200).json(eventi);
      return;
    }

    const searchTerm = `documentiMedicinaLavoro${id}`;
    redisClient.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data) {
        res.status(200).send(JSON.parse(data));
      } else {
        const documenti = await getData();
        redisClient.setex(
          searchTerm,
          redisTimeCache,
          JSON.stringify(documenti)
        );
        res.status(200).json(documenti);
      }
    });

    // const fatture = await fatture.find();
    // res.status(200).json(fatture);
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
      return DocMedicinaLavoro.findById(id);
    };

    if (redisClient == undefined || redisDisabled) {
      const eventi = await getData();
      res.status(200).json(eventi);
      return;
    }

    const searchTerm = `documentiMedicinaLavoro${id}`;
    redisClient.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data) {
        res.status(200).send(JSON.parse(data));
      } else {
        const doc = await getData();
        redisClient.setex(searchTerm, redisTimeCache, JSON.stringify(doc));
        res.status(200).json(doc);
      }
    });
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

router.post("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const doc = new DocMedicinaLavoro({
      dipendente: id,
      filenameRichiesta: req.body.filenameRichiesta,
      dateuploadRichiesta: Date.now(),
      noteRichiesta: req.body.noteRichiesta,
      filenameCertificato:
        req.body.filenameCertificato != null
          ? req.body.filenameCertificato
          : "",
      dateuploadCertificato:
        req.body.filenameCertificato != null ? Date.now() : "",
      noteCertificato: req.body.noteCertificato,
    });

    const result = await doc.save();

    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      redisClient.del(`documentiMedicinaLavoro${id}`);
    }

    res.status(200);
    res.json(result);
  } catch (err) {
    res.status(500);
    res.json({ Error: err });
  }
});

router.put("/documento/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await DocMedicinaLavoro.updateOne(
      { _id: id },
      {
        $set: {
          dipendente: req.body.dipendente,
          filename: req.body.filename,
          note: req.body.note,
        },
      }
    );

    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      redisClient.del(`documentiMedicinaLavoro${id}`);
    }

    res.status(200);
    res.json(doc);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

router.delete("/documento/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const item = await DocMedicinaLavoro.findById(id);
    const idDipendente = item.dipendente;
    const doc = await DocMedicinaLavoro.remove({ _id: id });

    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      redisClient.del(`documentiMedicinaLavoro${id}`);
      redisClient.del(`documentiMedicinaLavoro${idDipendente}`);
    }

    res.status(200);
    res.json(doc);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

module.exports = router;
