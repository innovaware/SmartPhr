const express = require("express");
const router = express.Router();
const DiarioClinico = require("../models/diarioClinico");
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    const getData = () => {
      return DiarioClinico.find({
        user: id,
      });
    };

    if (redisClient == undefined || redisDisabled) {
      const eventi = await getData();
      res.status(200).json(eventi);
      return;
    }

    const searchTerm = `DIARIOCLINICOBY${id}`;
    redisClient.get(searchTerm, async (err, asps) => {
      if (err) throw err;

      if (asps) {
        res.status(200).send(JSON.parse(asps));
      } else {
        const diario = await getData();
        redisClient.setex(searchTerm, redisTimeCache, JSON.stringify(diario));
        res.status(200).json(diario);
      }
    });
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

router.post("/", async (req, res) => {
  try {
    const diario = new DiarioClinico({
      data: req.body.data,
      contenuto: req.body.contenuto,
      terapia: req.body.terapia,
      user: req.body.user,
    });

    const result = await diario.save();
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      redisClient.del(`DIARIOCLINICO*`);
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
    const diario = await DiarioClinico.updateOne(
      { _id: id },
      {
        $set: {
          data: req.body.data,
          contenuto: req.body.contenuto,
          terapia: req.body.terapia,
        },
      }
    );

    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      redisClient.del(`DIARIOCLINICOBY${id}`);
    }

    res.status(200);
    res.json(diario);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

module.exports = router;
