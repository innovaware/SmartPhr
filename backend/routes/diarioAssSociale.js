const express = require("express");

const router = express.Router();
const DiarioAssSociale = require("../models/diarioAssSociale");

const redis = require("redis");
const redisPort = process.env.REDISPORT || 6379;
const redisHost = process.env.REDISHOST || 'redis';
const redisDisabled = process.env.REDISDISABLE === "true" || false;
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;

const client = redis.createClient(redisPort, redisHost);


router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const searchTerm = `ASPBY${id}`;
    client.get(searchTerm, async (err, asps) => {
      if (err) throw err;

      if (asps) {
        res.status(200).send(JSON.parse(asps));
      } else {
        const diario = await DiarioAssSociale.find({
            user: id
          });
        client.setex(searchTerm, redisTimeCache, JSON.stringify(diario));
        res.status(200).json(diario);
      }
    });
    
  } catch (err) {
    res.status(500).json({ "Error": err });
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
    res.status(200);
    res.json(result);

  } catch (err) {
    res.status(500);
    res.json({ "Error": err });
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
            firma: req.body.firma
        },
      }
    );

    const searchTerm = `DIARIOBY${id}`;
    client.del(searchTerm);

    res.status(200);
    res.json(diario);

  } catch (err) {
    res.status(500).json({ "Error": err });
  }
});

module.exports = router;
