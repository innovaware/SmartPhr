const express = require("express");
const ASP = require("../models/asp");

const router = express.Router();
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;

router.get("/", async (req, res) => {
  try {
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    const getData = () => {
      return ASP.find();
    };

    if (redisClient == undefined || redisDisabled) {
      const asp = await getData();
      res.status(200).json(asp);
      return;
    }

    const searchTerm = "ASPALL";
    clientRedis.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data) {
        res.status(200).send(JSON.parse(data));
      } else {
        const asp = await getData();
        clientRedis.setex(searchTerm, redisTimeCache, JSON.stringify(asp));
        res.status(200).json(asp);
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
      return ASP.findById(id);
    };

    if (redisClient == undefined || redisDisabled) {
      const asp = await getData();
      res.status(200).json(asp);
      return;
    }

    const searchTerm = `ASPBY${id}`;
    clientRedis.get(searchTerm, async (err, asps) => {
      if (err) throw err;

      if (asps) {
        res.status(200).send(JSON.parse(asps));
      } else {
        const asp = await getData();
        clientRedis.setex(searchTerm, redisTimeCache, JSON.stringify(asp));
        res.status(200).json(asp);
      }
    });
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

router.post("/", async (req, res) => {
  try {
    const asp = new ASP({
      cognome: req.body.cognome,
      nome: req.body.nome,
      email: req.body.email,
      group: req.body.group,
      user: req.body.user,
    });

    const result = await asp.save();
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      const searchTerm = "ASPALL";
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
    const asp = await ASP.updateOne(
      { _id: id },
      {
        $set: {
          cognome: req.body.cognome,
          nome: req.body.nome,
          email: req.body.email,
          group: req.body.group,
          user: req.body.user,
        },
      }
    );

    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      const searchTerm = `ASPBY${id}`;
      redisClient.del(searchTerm);
    }

    res.status(200);
    res.json(asp);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

module.exports = router;
