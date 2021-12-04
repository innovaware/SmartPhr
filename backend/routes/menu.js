const express = require("express");
const router = express.Router();
const Menu = require("../models/menu");
const redis = require("redis");
const redisPort = process.env.REDISPORT || 6379;
const redisHost = process.env.REDISHOST ||  'redis';

const redisDisabled = process.env.REDISDISABLE === "true" || false;
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;

const client = redis.createClient(redisPort, redisHost);

router.get("/", async (req, res) => {
  try {
    const searchTerm = `MENUALL`;
    client.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data && !redisDisabled) {
        res.status(200).send(JSON.parse(data));
      } else {
        const menu = await Menu.find();

        client.setex(searchTerm, redisTimeCache, JSON.stringify(menu));
        res.status(200).json(menu);
      }
    });
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).json({ Error: err });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    if (id == undefined || id === "undefined") {
      console.log("Error id is not defined ", id);
      res.status(404).json({ Error: "Id not defined" });
      return;
    }

    if (data == undefined || data === "undefined") {
      console.log("Error data is not defined ", id);
      res.status(404).json({ Error: "Data not defined" });
      return;
    }

    const result = await Menu.updateOne(
      { _id: id },
      {
        $set: data,
      },
      { upsert: true }
    );


    res.status(200);
    res.json(result);

    const searchTerm = `MENU*`;
    client.del(searchTerm);

  } catch (err) {
    res.status(500);
    res.json({"Error": err});
  }
});


module.exports = router;
