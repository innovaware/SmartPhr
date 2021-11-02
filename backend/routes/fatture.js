const express = require("express");
//const jwt_decode = require("jwt-decode");

const router = express.Router();
const Fatture = require("../models/fatture");

const redis = require("redis");
const redisPort = process.env.REDISPORT || 6379;
const redisHost = process.env.REDISHOST || "redis";
const redisDisabled = process.env.REDISDISABLE === "true" || false;
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;

const client = redis.createClient(redisPort, redisHost);

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const searchTerm = `fatture${id}`;
    client.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data && !redisDisabled) {
        console.log(`${searchTerm}: ${data}`);
        res.status(200).send(JSON.parse(data));
      } else {
        const fatture = await Fatture.find({
          identifyUser: id,
        });
        client.setex(searchTerm, redisTimeCache, JSON.stringify(fatture));
        res.status(200).json(fatture);
      }
    });

    // const fatture = await fatture.find();
    // res.status(200).json(fatture);
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).json({ Error: err });
  }
});

/* router.get("/:id", async (req, res) => {
  const { id } = req.params;
  console.error("Fatture get/:id: ", id);
  try {
    const searchTerm = `fattureBY${id}`;
    client.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data && !redisDisabled) {
        res.status(200).send(JSON.parse(data));
      } else {
        const fatture = await Fatture.findById(id);
        console.error("Fatture.findById(id): ", JSON.stringify(fatture));
        client.setex(searchTerm, redisTimeCache, JSON.stringify(fatture));
        res.status(200).json(fatture);
      }
    });
  } catch (err) {
    res.status(500).json({ Error: err });
  }
}); */

router.post("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const fatture = new Fatture({
      identifyUser: id,
      filename: req.body.filename,
      dateupload: Date.now(),
      note: req.body.note,
    });

    console.log("Insert fattura: ", fatture);

    const result = await fatture.save();


    const searchTerm = `fatture${id}`;
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
    const fatture = await Fatture.updateOne(
      { _id: id },
      {
        $set: {
          identifyUser: req.body.identifyUser,
          filename: req.body.filename,
          note: req.body.note,
        },
      }
    );

    const searchTerm = `fattureBY${id}`;
    client.del(searchTerm);

    res.status(200);
    res.json(fatture);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Fatture.findById(id);
    const identifyUser = item.identifyUser;
    const fatture = await Fatture.remove({ _id: id });

    let searchTerm = `fattureBY${id}`;
    client.del(searchTerm);
    searchTerm = `fatture${identifyUser}`;
    client.del(searchTerm);


    res.status(200);
    res.json(fatture);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

module.exports = router;
