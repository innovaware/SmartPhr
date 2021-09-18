const express = require("express");
const router = express.Router();
const Fornitori = require("../models/fornitori");
const redis = require("redis");
const redisPort = process.env.REDISPORT || 6379;
const redisHost = process.env.REDISHOST || 'redis';
const redisDisabled = process.env.REDISDISABLE === "true" || false;
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;

const client = redis.createClient(redisPort, redisHost);

router.get("/", async (req, res) => {
  try {
    const searchTerm = `FORNITORIALL`;
    client.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data && !redisDisabled) {
        res.status(200).send(JSON.parse(data));
      } else {
        const fornitori = await Fornitori.find();

        client.setex(searchTerm, redisTimeCache, JSON.stringify(fornitori));
        res.status(200).json(fornitori);
      }
    });


  } catch (err) {
    console.error("Error: ", err);
    res.status(500).json({"Error": err});
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const searchTerm = `FORNITORIBY${id}`;
    client.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data && !redisDisabled) {
        res.status(200).send(JSON.parse(data));
      } else {
        const fornitori = await Fornitori.findById(id);

        client.setex(searchTerm, redisTimeCache, JSON.stringify(fornitori));
        res.status(200).json(fornitori);
      }
    });
  } catch (err) {
    res.status(500).json({"Error": err});
  }
});

router.post("/", async (req, res) => {
  try {
    const fornitore = new Fornitori({
      cognome: req.body.cognome,
      nome: req.body.nome,
      email: req.body.email,
      group: req.body.group,
      user: req.body.user,
    });

    console.log(req.body);

    const result = await fornitore.save();
    res.status(200);
    res.json(result);

  } catch (err) {
    res.status(500);
    res.json({"Error": err});
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const fornitori = await Fornitori.updateOne(
      { _id: id },
      {
        $set: {
          cognome: req.body.cognome,
          nome: req.body.nome,
          email: req.body.email,
          group: req.body.group,
          user: req.body.user,
        },
      }
    );

    const searchTerm = `FORNITORIBY${id}`;
    client.del(searchTerm);
    res.status(200);
    res.json(fornitori);

  } catch (err) {
    res.status(500).json({"Error": err});
  }
});

module.exports = router;
