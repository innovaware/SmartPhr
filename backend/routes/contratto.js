const express = require("express");
//const jwt_decode = require("jwt-decode");

const router = express.Router();
const Contratto = require("../models/contratto");

const redis = require("redis");
const redisPort = process.env.REDISPORT || 6379;
const redisHost = process.env.REDISHOST || "redis";
const redisDisabled = process.env.REDISDISABLE === "true" || false;
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;

const client = redis.createClient(redisPort, redisHost);

router.get("/consulente/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const searchTerm = `CONTRATTOCONSULENTE${id}`;
    client.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data && !redisDisabled) {
        console.log(`${searchTerm}: ${data}`);
        res.status(200).send(JSON.parse(data));
      } else {
        const contratto = await Contratto.find({
          idConsulente: id,
        });
        client.setex(searchTerm, redisTimeCache, JSON.stringify(contratto));
        res.status(200).json(contratto);
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
    const searchTerm = `CONTRATTOBY${id}`;
    client.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data && !redisDisabled) {
        res.status(200).send(JSON.parse(data));
      } else {
        const contratto = await Contratto.findById(id);
        client.setex(searchTerm, redisTimeCache, JSON.stringify(contratto));
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


    const searchTerm = `CONTRATTOCONSULENTE${id}`;
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

    const searchTerm = `CONTRATTOBY${id}`;
    client.del(searchTerm);

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

    let searchTerm = `CONTRATTOBY${id}`;
    client.del(searchTerm);
    searchTerm = `CONTRATTOCONSULENTE${idConsulente}`;
    client.del(searchTerm);


    res.status(200).json(contratto);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

module.exports = router;
