const express = require("express");
//const jwt_decode = require("jwt-decode");

const router = express.Router();
const PuntoFatture = require("../models/puntoFatture");

const redis = require("redis");
const redisPort = process.env.REDISPORT || 6379;
const redisHost = process.env.REDISHOST || "redis";
const redisDisabled = process.env.REDISDISABLE === "true" || false;
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;

const client = redis.createClient(redisPort, redisHost);

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const searchTerm = `puntoFatture${id}`;
    client.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data && !redisDisabled) {
        console.log(`${searchTerm}: ${data}`);
        res.status(200).send(JSON.parse(data));
      } else {
        const puntoFatture = await PuntoFatture.find({
          identifyUser: id,
        });
        client.setex(searchTerm, redisTimeCache, JSON.stringify(puntoFatture));
        res.status(200).json(puntoFatture);
      }
    });

    // const puntoFatture = await puntoFatture.find();
    // res.status(200).json(puntoFatture);
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).json({ Error: err });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  console.error("PuntoFatture get/:id: ", id);
  try {
    const searchTerm = `puntoFattureBY${id}`;
    client.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data && !redisDisabled) {
        res.status(200).send(JSON.parse(data));
      } else {
        const puntoFatture = await PuntoFatture.findById(id);
        console.error("PuntoFatture.findById(id): ", JSON.stringify(puntoFatture));
        client.setex(searchTerm, redisTimeCache, JSON.stringify(puntoFatture));
        res.status(200).json(puntoFatture);
      }
    });
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

router.post("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const puntoFatture = new PuntoFatture({
      identifyUser: id,
      filename: req.body.filename,
      dateupload: Date.now(),
      note: req.body.note,
    });

    console.log("Insert punto: ", puntoFatture);

    const result = await puntoFatture.save();


    const searchTerm = `puntoFatture${id}`;
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
    const puntoFatture = await PuntoFatture.updateOne(
      { _id: id },
      {
        $set: {
          identifyUser: req.body.identifyUser,
          filename: req.body.filename,
          note: req.body.note,
        },
      }
    );

    const searchTerm = `puntoFattureBY${id}`;
    client.del(searchTerm);

    res.status(200);
    res.json(puntoFatture);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const item = await PuntoFatture.findById(id);
    const identifyUser = item.identifyUser;
    const puntoFatture = await PuntoFatture.remove({ _id: id });

    let searchTerm = `puntoFattureBY${id}`;
    client.del(searchTerm);
    searchTerm = `puntoFatture${identifyUser}`;
    client.del(searchTerm);


    res.status(200);
    res.json(puntoFatture);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

module.exports = router;
