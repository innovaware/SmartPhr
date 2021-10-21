const express = require("express");
//const jwt_decode = require("jwt-decode");

const router = express.Router();
const NotaCredito = require("../models/notacredito");

const redis = require("redis");
const redisPort = process.env.REDISPORT || 6379;
const redisHost = process.env.REDISHOST || "redis";
const redisDisabled = process.env.REDISDISABLE === "true" || false;
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;

const client = redis.createClient(redisPort, redisHost);

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const searchTerm = `notacredito${id}`;
    client.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data && !redisDisabled) {
        console.log(`${searchTerm}: ${data}`);
        res.status(200).send(JSON.parse(data));
      } else {
        const notacredito = await NotaCredito.find({
          identifyUser: id,
        });
        client.setex(searchTerm, redisTimeCache, JSON.stringify(notacredito));
        res.status(200).json(notacredito);
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
    const searchTerm = `notacreditoBY${id}`;
    client.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data && !redisDisabled) {
        res.status(200).send(JSON.parse(data));
      } else {
        const notacredito = await NotaCredito.findById(id);
        client.setex(searchTerm, redisTimeCache, JSON.stringify(notacredito));
        res.status(200).json(notacredito);
      }
    });
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

router.post("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const notacredito = new NotaCredito({
      identifyUser: id,
      filename: req.body.filename,
      dateupload: Date.now(),
      note: req.body.note,
    });

    console.log("Insert fattura: ", notacredito);

    const result = await notacredito.save();


    const searchTerm = `notacredito${id}`;
    client.del(searchTerm);

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
    const notacredito = await NotaCredito.updateOne(
      { _id: id },
      {
        $set: {
          identifyUser: req.body.identifyUser,
          filename: req.body.filename,
          note: req.body.note,
        },
      }
    );

    const searchTerm = `notacreditoBY${id}`;
    client.del(searchTerm);

    res.status(200);
    res.json(notacredito);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    const item = await NotaCredito.findById(id);
    const identifyUser = item.identifyUser;
    
    const notacredito = await NotaCredito.remove({ _id: id });
    
    let searchTerm = `notacreditoBY${id}`;
    client.del(searchTerm);
    searchTerm = `notacredito${identifyUser}`;
    client.del(searchTerm);

    res.status(200);
    res.json(notacredito);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

module.exports = router;
