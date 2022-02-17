const express = require("express");
const router = express.Router();
const DiarioAssSociale = require("../models/diarioAssSociale");
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    const getData = () => {
      return DiarioAssSociale.find({
        user: id,
      });
    };

    if (redisClient == undefined || redisDisabled) {
      const eventi = await getData();
      res.status(200).json(eventi);
      return;
    }

    const searchTerm = `DIARIOASSSOCIALEBY${id}`;
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
    const diario = new DiarioAssSociale({
      data: req.body.data,
      contenuto: req.body.contenuto,
      firma: req.body.firma,
      user: req.body.user,
    });

    const result = await diario.save();

    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      redisClient.del(`DIARIOASSSOCIALE*`);
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
    const diario = await DiarioAssSociale.updateOne(
      { _id: id },
      {
        $set: {
          data: req.body.data,
          contenuto: req.body.contenuto,
          firma: req.body.firma,
        },
      }
    );

    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      redisClient.del(`DIARIOASSSOCIALEBY${id}`);
    }

    res.status(200);
    res.json(diario);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

module.exports = router;
