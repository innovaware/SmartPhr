const express = require("express");
//const jwt_decode = require("jwt-decode");

const router = express.Router();
const Bonifici = require("../models/bonifici");

const redis = require("redis");
const redisPort = process.env.REDISPORT || 6379;
const redisHost = process.env.REDISHOST || "redis";
const redisDisabled = process.env.REDISDISABLE === "true" || false;
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;

const client = redis.createClient(redisPort, redisHost);

async function get(req, res) {
  try {
    const { id } = req.params;

    const searchTerm = `bonifici${id}`;
    client.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data && !redisDisabled) {
        //console.log(`${searchTerm}: ${data}`);
        res.status(200).send(JSON.parse(data));
      } else {
        const bonifici = await Bonifici.find({
          identifyUser: id,
        });
        client.setex(searchTerm, redisTimeCache, JSON.stringify(bonifici));
        console.log("Add caching: ", searchTerm);

        res.status(200).json(bonifici);
      }
    });

    // const bonifici = await bonifici.find();
    // res.status(200).json(bonifici);
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).json({ Error: err });
  }
}

async function getBonificoById(req, res) {
  const { id } = req.params;
  try {
    const searchTerm = `bonificiBY${id}`;
    client.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data && !redisDisabled) {
        res.status(200).send(JSON.parse(data));
      } else {
        const bonifici = await Bonifici.findById(id);
        client.setex(searchTerm, redisTimeCache, JSON.stringify(bonifici));
        console.log("Add caching: ", searchTerm);

        res.status(200).json(bonifici);
      }
    });
  } catch (err) {
    res.status(500).json({ Error: err });
  }
}

async function insertBonifico(req, res) {
  try {
    const { id } = req.params;
    const bonifici = new Bonifici({
      identifyUser: id,
      filename: req.body.filename,
      dateupload: Date.now(),
      note: req.body.note,
    });

    console.log("Insert bonifici: ", bonifici);

    const result = await bonifici.save();

    const searchTerm = `bonifici${id}`;
    client.del(searchTerm);

    res.status(200);
    res.json(result);
  } catch (err) {
    res.status(500);
    res.json({ Error: err });
  }
}

async function modifyBonifico(req, res) {
  try {
    const { id } = req.params;
    const bonifici = await Bonifici.updateOne(
      { _id: id },
      {
        $set: {
          identifyUser: req.body.identifyUser,
          filename: req.body.filename,
          note: req.body.note,
        },
      }
    );

    const searchTerm = `bonificiBY${id}`;
    client.del(searchTerm);
    console.log("Delete caching: ", searchTerm);

    res.status(200);
    res.json(bonifici);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
}

async function deleteBonifico(req, res) {
  try {
    const { id } = req.params;

    const bonifici_item = await Bonifici.findById(id);
    const identifyUser = bonifici_item.identifyUser;

    const bonifici = await Bonifici.remove({ _id: id });


    let searchTerm = `bonificiBY${id}`;
    client.del(searchTerm);
    console.log("Delete caching: ", searchTerm);

    searchTerm = `bonifici${identifyUser}`;
    client.del(searchTerm);
    console.log("Delete caching: ", searchTerm);

    res.status(200);
    res.json(bonifici);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
}

router.get("/:id", get);
router.get("/:id", getBonificoById);
router.post("/:id", insertBonifico);
router.put("/:id", modifyBonifico);
router.delete("/:id", deleteBonifico);

module.exports = router;
