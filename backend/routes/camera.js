const express = require("express");
const Camere = require("../models/camere");

const router = express.Router();
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;

router.get("/", async (req, res) => {
  try {
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    const getData = () => {
      return Camere.find();
    };

    if (redisClient == undefined || redisDisabled) {
      const camere = await getData();
      console.log("camere:", camere);

      res.status(200).json(camere);
      return;
    }

    const searchTerm = "CAMEREALL";
    clientRedis.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data) {
        res.status(200).send(JSON.parse(data));
      } else {
        const camere = await getData();
        clientRedis.setex(searchTerm, redisTimeCache, JSON.stringify(camere));
        res.status(200).json(camere);
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
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    const getData = () => {
      return Camere.findById(id);
    };

    if (redisClient == undefined || redisDisabled) {
      const camere = await getData();
      res.status(200).json(camere);
      return;
    }

    const searchTerm = `CAMERABY${id}`;
    clientRedis.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data) {
        res.status(200).send(JSON.parse(data));
      } else {
        const camere = await getData();
        clientRedis.setex(searchTerm, redisTimeCache, JSON.stringify(camere));
        res.status(200).json(camere);
      }
    });
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

router.post("/", async (req, res) => {
  try {
    const camera = new Camere({
      camera: req.body.camera,
      piano: req.body.piano,
    });

    const result = await camera.save();
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      const searchTerm = "CAMEREALL";
      redisClient.del(searchTerm);
    }

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
    const camera = await Camere.updateOne(
      { _id: id },
      {
        $set: {
          camera: req.body.camera,
          piano: req.body.piano,
        },
      }
    );

    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      const searchTerm = `CAMERABY${id}`;
      redisClient.del(searchTerm);
    }

    res.status(200);
    res.json(camera);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

module.exports = router;
