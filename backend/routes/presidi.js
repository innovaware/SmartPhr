const express = require("express");
const router = express.Router();
const Presidi = require("../models/presidi");
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;


router.get("/", async (req, res) => {
  try {
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    const getData = () => {
      return Presidi.find();
    };

    if (redisClient == undefined || redisDisabled) {
      const presidi = await getData();
      res.status(200).json(presidi);
      return;
    }

    const searchTerm = `PRESIDIALL`;
    redisClient.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data) {
        res.status(200).send(JSON.parse(data));
      } else {
        const presidi = await getData() 
        redisClient.setex(searchTerm, redisTimeCache, JSON.stringify(presidi));
        res.status(200).json(presidi);
      }
    });

  } catch (err) {
    console.error("Error: ", err);
    res.status(500).json({"Error": err});
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    const getData = () => {
      return Presidi.findById(id);
    };

    if (redisClient == undefined || redisDisabled) {
      const presidi = await getData();
      res.status(200).json(presidi);
      return;
    }

    const searchTerm = `PRESIDIBY${id}`;
    redisClient.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data) {
        res.status(200).send(JSON.parse(data));
      } else {
        const presidi = await getData(); 

        redisClient.setex(searchTerm, redisTimeCache, JSON.stringify(presidi));
        res.status(200).json(presidi);
      }
    });
  } catch (err) {
    res.status(500).json({"Error": err});
  }
});

router.post("/", async (req, res) => {
  try {
    const presidi = new Presidi({
      nome: req.body.nome,
      descrizione: req.body.descrizione,
      note: req.body.note,
      taglia: req.body.taglia,
      qty: req.body.qty
    });

    const result = await presidi.save();
    
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      const searchTerm = `PRESIDIALL`;
      redisClient.del(searchTerm);
    }

    res.status(200);
    res.json(result);

  } catch (err) {
    res.status(500).json({error: err}) 
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const presidi = await Presidi.updateOne(
      { _id: id },
      {
        $set: {
          nome: req.body.nome,
          descrizione: req.body.descrizione,
          note: req.body.note,
          taglia: req.body.taglia,
          qty: req.body.qty
        },
      }
    );

    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      const searchTerm = `FARMACIBY${id}`;
      redisClient.del(searchTerm);
    }

    res.status(200);
    res.json(presidi);

  } catch (err) {
    res.status(500).json({error: err}) 
  }
});

module.exports = router;
