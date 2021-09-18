const express = require("express");
//const jwt_decode = require("jwt-decode");

const router = express.Router();
const Fatture = require("../models/fatture");

const redis = require("redis");
const redisPort = process.env.REDISPORT || 6379;
const redisHost = process.env.REDISHOST || 'redis';
const redisDisabled = process.env.REDISDISABLE === "true" || false;
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;

const client = redis.createClient(redisPort, redisHost);

router.get("/paziente/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const searchTerm = `fatturePaziente${id}`;
    client.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data && !redisDisabled) {
        res.status(200).send(JSON.parse(data));
      } else {
        const fatture = await Fatture.find({
          paziente: id
        });
        client.setex(searchTerm, redisTimeCache, JSON.stringify(fatture));
        res.status(200).json(fatture);
      }
    });

    // const fatture = await fatture.find();
    // res.status(200).json(fatture);

  } catch (err) {
    console.error("Error: ", err);
    res.status(500).json({ "Error": err });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const searchTerm = `fattureBY${id}`;
    client.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data && !redisDisabled) {
        res.status(200).send(JSON.parse(data));
      } else {
        const fatture = await Fatture.findById(id);
        client.setex(searchTerm, redisTimeCache, JSON.stringify(fatture));
        res.status(200).json(fatture);
      }
    });
    
  } catch (err) {
    res.status(500).json({ "Error": err });
  }
});

router.post("/", async (req, res) => {
  try {
    const fatture = new Fatture({
      paziente: req.body.pazienteID,
    });

    console.log("Insert fattura: ", fatture);

    const result = await fatture.save();
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
    const fatture = await Fatture.updateOne(
      { _id: id },
      {
        $set: {
          paziente: req.body.pazienteID,
        },
      }
    );

    const searchTerm = `fattureBY${id}`;
    client.del(searchTerm);

    res.status(200);
    res.json(fatture);

  } catch (err) {
    res.status(500).json({ "Error": err });
  }
});

module.exports = router;
