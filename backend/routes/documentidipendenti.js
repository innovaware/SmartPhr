const express = require("express");
const router = express.Router();
const DocDipendente = require("../models/documentidipendenti");
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;

router.get("/dipendente/:id/:type", async (req, res) => {
  try {
    let id = req.params.id;
    let type = req.params.type;

    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    const getData = () => {
      return DocDipendente.find({
        dipendente: id,
        type: type,
      });
    };

    if (redisClient == undefined || redisDisabled) {
      const eventi = await getData();
      res.status(200).json(eventi);
      return;
    }

    const searchTerm = `documentiDipendente${id}`;
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
      return DocDipendente.findById(id);
    };

    if (redisClient == undefined || redisDisabled) {
      const eventi = await getData();
      res.status(200).json(eventi);
      return;
    }

    const searchTerm = `documentiDipendente${id}`;
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
    const doc = new DocDipendente({
      dipendente: id,
      filename: req.body.filename,
      dateupload: Date.now(),
      note: req.body.note,
      type: req.body.type,
      descrizione: req.body.descrizione,
      filenameesito: req.body.filenameesito,
    });

    const result = await doc.save();

    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      redisClient.del(`documentiDipendente${id}`);
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
    const doc = await DocDipendente.updateOne(
      { _id: id },
      {
        $set: {
          dipendente: req.body.dipendente,
          filename: req.body.filename,
          filenameesito: req.body.filenameesito,
          note: req.body.note,
        },
      }
    );

    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      redisClient.del(`documentiDipendenteBY${id}`);
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

    const item = await DocDipendente.findById(id);
    console.log("item:" + item);
    const idDipendente = item.dipendente;
    const doc = await DocDipendente.remove({ _id: id });

    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      redisClient.del(`documentiDipendenteBY${id}`);
      redisClient.del(`documentiDipendente${idDipendente}`);
    }

    res.status(200);
    res.json(doc);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

module.exports = router;
