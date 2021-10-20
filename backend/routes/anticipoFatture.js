const express = require("express");
//const jwt_decode = require("jwt-decode");

const router = express.Router();
const AnticipoFatture = require("../models/anticipoFatture");

const redis = require("redis");
const redisPort = process.env.REDISPORT || 6379;
const redisHost = process.env.REDISHOST || "redis";
const redisDisabled = process.env.REDISDISABLE === "true" || false;
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;

const client = redis.createClient(redisPort, redisHost);

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const searchTerm = `anticipoFatture${id}`;
    client.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data && !redisDisabled) {
        console.log(`${searchTerm}: ${data}`);
        res.status(200).send(JSON.parse(data));
      } else {
        const anticipoFatture = await AnticipoFatture.find({
          identifyUser: id,
        });
        client.setex(searchTerm, redisTimeCache, JSON.stringify(anticipoFatture));
        res.status(200).json(anticipoFatture);
      }
    });

    // const anticipoFatture = await anticipoFatture.find();
    // res.status(200).json(anticipoFatture);
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).json({ Error: err });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  console.error("AnticipoFatture get/:id: ", id);
  try {
    const searchTerm = `anticipoFattureBY${id}`;
    client.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data && !redisDisabled) {
        res.status(200).send(JSON.parse(data));
      } else {
        const anticipoFatture = await AnticipoFatture.findById(id);
        console.error("AnticipoFatture.findById(id): ", JSON.stringify(anticipoFatture));
        client.setex(searchTerm, redisTimeCache, JSON.stringify(anticipoFatture));
        res.status(200).json(anticipoFatture);
      }
    });
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

router.post("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const anticipoFatture = new AnticipoFatture({
      identifyUser: id,
      filename: req.body.filename,
      dateupload: Date.now(),
      note: req.body.note,
    });

    console.log("Insert anticipo: ", anticipoFatture);

    const result = await anticipoFatture.save();


    const searchTerm = `anticipoFatture${id}`;
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
    const anticipoFatture = await AnticipoFatture.updateOne(
      { _id: id },
      {
        $set: {
          identifyUser: req.body.identifyUser,
          filename: req.body.filename,
          note: req.body.note,
        },
      }
    );

    const searchTerm = `anticipoFattureBY${id}`;
    client.del(searchTerm);

    res.status(200);
    res.json(anticipoFatture);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const item = await AnticipoFatture.findById(id);
    const identifyUser = item.identifyUser;
    const anticipoFatture = await AnticipoFatture.remove({ _id: id });

    let searchTerm = `anticipoFattureBY${id}`;
    client.del(searchTerm);
    searchTerm = `anticipoFatture${identifyUser}`;
    client.del(searchTerm);


    res.status(200);
    res.json(anticipoFatture);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

module.exports = router;
