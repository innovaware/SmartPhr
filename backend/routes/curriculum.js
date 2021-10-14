const express = require("express");
//const jwt_decode = require("jwt-decode");

const router = express.Router();
const Curriculum = require("../models/curriculum");

const redis = require("redis");
const redisPort = process.env.REDISPORT || 6379;
const redisHost = process.env.REDISHOST || "redis";
const redisDisabled = process.env.REDISDISABLE === "true" || false;
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;

const client = redis.createClient(redisPort, redisHost);

router.get("/dipendente/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const searchTerm = `CURRICULUMDIPENDENTE${id}`;
    client.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data && !redisDisabled) {
        console.log(`${searchTerm}: ${data}`);
        res.status(200).send(JSON.parse(data));
      } else {
        const curriculum = await Curriculum.find({
          idDipendente: id,
        });
        client.setex(searchTerm, redisTimeCache, JSON.stringify(curriculum));
        res.status(200).json(curriculum);
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
    const searchTerm = `CURRICULUMBY${id}`;
    client.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data && !redisDisabled) {
        res.status(200).send(JSON.parse(data));
      } else {
        const curriculum = await Curriculum.findById(id);
        client.setex(searchTerm, redisTimeCache, JSON.stringify(curriculum));
        res.status(200).json(curriculum);
      }
    });
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

router.post("/dipendente/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const curriculum = new Curriculum({
      idDipendente: id,
      filename: req.body.filename,
      dateupload: Date.now(),
      note: req.body.note,
    });

    console.log("Insert curriculum: ", curriculum);

    const result = await curriculum.save();


    const searchTerm = `CURRICULUMDIPENDENTE${id}`;
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
    const curriculum = await Curriculum.updateOne(
      { _id: id },
      {
        $set: {
          idDipendente: req.body.pazienteID,
          filename: req.body.filename,
          note: req.body.note,
        },
      }
    );

    const searchTerm = `CURRICULUMBY${id}`;
    client.del(searchTerm);

    res.status(200).json(curriculum);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Curriculum.findById(id);
    const idDipendente = item.idDipendente;
    const curriculum = await Curriculum.remove({ _id: id });

    let searchTerm = `CURRICULUMBY${id}`;
    client.del(searchTerm);
    searchTerm = `CURRICULUMDIPENDENTE${idConsulente}`;
    client.del(searchTerm);


    res.status(200).json(curriculum);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

module.exports = router;
