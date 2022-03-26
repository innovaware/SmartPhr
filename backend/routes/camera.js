const express = require("express");
const Camere = require("../models/camere");

const router = express.Router();
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;

router.get("/:p", async (req, res) => {
  const { p } = req.params;
  try {
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    const getData = () => {
      const query = {piano: p}
      return Camere.find(query);
    };

    if (redisClient == undefined || redisDisabled) {
      const camere = await getData();

      res.status(200).json(camere);
      return;
    }

    const searchTerm = `CAMEREALL${p}`;
    redisClient.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data) {
        res.status(200).send(JSON.parse(data));
      } else {
        const camere = await getData();
        redisClient.setex(searchTerm, redisTimeCache, JSON.stringify(camere));
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
    redisClient.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data) {
        res.status(200).send(JSON.parse(data));
      } else {
        const camere = await getData();
        redisClient.setex(searchTerm, redisTimeCache, JSON.stringify(camere));
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
      geometry: req.body.geometry,
      forPatient: req.body.forPatient,
    });

    const result = await camera.save();
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      const searchTerm = "CAMEREALL*";
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
          geometry: req.body.geometry,
          forPatient: req.body.forPatient,
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

// http://[HOST]:[PORT]/api/cambiturno (POST)
// INSERT permessi su DB
router.post("/", async (req, res) => {
  try {
    const camera = new Camere({
      camera: req.body.camera,
      piano: req.body.piano,
      geometry: req.body.geometry,
      forPatient: req.body.forPatient,
    });

    // Salva i dati sul mongodb
    const result = await camera.save();

    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      redisClient.del(`CAMERE*`);
    }

    res.status(200);
    res.json(result);
  } catch (err) {
    res.status(500);
    res.json({ Error: err });
  }
});



router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const camera = await Camere.remove({ _id: id });

    if (redisClient != undefined && !redisDisabled) {
      redisClient.del(`CAMERE*`);
    }

    res.status(200);
    res.json(camera);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});
module.exports = router;
