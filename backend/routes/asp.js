const express = require("express");

const router = express.Router();
const ASP = require("../models/asp");

const redis = require("redis");
const redisPort = 6379
const client = redis.createClient(redisPort);

router.get("/", async (req, res) => {
  try {

    const searchTerm = "ASPALL";
    client.get(searchTerm, async (err, asps) => {
      if (err) throw err;

      if (asps) {
        res.status(200).send(JSON.parse(asps));
      } else {
        const asp = await ASP.find();
        client.setex(searchTerm, 600, JSON.stringify(asp));
        res.status(200).json(asp);
      }
    });

    // const asp = await ASP.find();
    // res.status(200).json(asp);

  } catch (err) {
    console.error("Error: ", err);
    res.status(500).json({ "Error": err });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const searchTerm = `ASPBY${id}`;
    client.get(searchTerm, async (err, asps) => {
      if (err) throw err;

      if (asps) {
        res.status(200).send(JSON.parse(asps));
      } else {
        const asp = await ASP.findById(id);
        client.setex(searchTerm, 600, JSON.stringify(asp));
        res.status(200).json(asp);
      }
    });
    
  } catch (err) {
    res.status(500).json({ "Error": err });
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
    res.status(200);
    res.json(result);

  } catch (err) {
    res.status(500);
    res.json({ "Error": err });
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
    res.status(200);
    res.json(asp);

  } catch (err) {
    res.status(500).json({ "Error": err });
  }
});

module.exports = router;
