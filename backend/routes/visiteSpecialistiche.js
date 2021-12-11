const express = require("express");

const router = express.Router();
const VisiteSpecialistiche = require("../models/visiteSpecialistiche");

const redis = require("redis");
const redisPort = process.env.REDISPORT || 6379;
const redisHost = process.env.REDISHOST || "redis";
const redisDisabled = process.env.REDISDISABLE === "true" || false;
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;

const client = redis.createClient(redisPort, redisHost);

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const searchTerm = `VISITEBY${id}`;
    client.get(searchTerm, async (err, asps) => {
      if (err) throw err;

      if (asps) {
        res.status(200).send(JSON.parse(asps));
      } else {
        const visita = await VisiteSpecialistiche.find({
          user: id,
        });
        client.setex(searchTerm, redisTimeCache, JSON.stringify(visita));
        res.status(200).json(visita);
      }
    });
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

router.post("/", async (req, res) => {
  try {
    const visita = new VisiteSpecialistiche({
      dataReq: req.body.dataReq,
      contenuto: req.body.contenuto,
      dataEsec: req.body.dataEsec,
      user: req.body.user,
    });

    const result = await visita.save();
    res.status(200);
    res.json(result);


    const searchTerm = `VISITA*`;
    client.del(searchTerm);

  } catch (err) {
    res.status(500);
    res.json({ Error: err });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const visita = await VisiteSpecialistiche.updateOne(
      { _id: id },
      {
        $set: {
          dataReq: req.body.dataReq,
          contenuto: req.body.contenuto,
          dataEsec: req.body.dataEsec,
        },
      }
    );

    const searchTerm = `VISITABY${id}`;
    client.del(searchTerm);

    res.status(200);
    res.json(visita);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

router.get("/", async (req, res) => {
  const { id } = req.params;
  try {
    const searchTerm = `VISITE${id}`;
    client.get(searchTerm, async (err, asps) => {
      if (err) throw err;

      if (asps) {
        res.status(200).send(JSON.parse(asps));
      } else {
        const visita = await VisiteSpecialistiche.find({});
        client.setex(searchTerm, redisTimeCache, JSON.stringify(visita));
        res.status(200).json(visita);
      }
    });
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

module.exports = router;
