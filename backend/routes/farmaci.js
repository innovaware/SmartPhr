const express = require("express");
const router = express.Router();
const Farmaci = require("../models/farmaci");
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;


router.get("/", async (req, res) => {
  try {
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    const getData = () => {
      return Farmaci.find();
    };

    if (redisClient == undefined || redisDisabled) {
      const farmaci = await getData();
      res.status(200).json(farmaci);
      return;
    }

    const searchTerm = `FARMACIALL`;
    redisClient.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data) {
        res.status(200).send(JSON.parse(data));
      } else {
        const farmaci = await getData() 
        redisClient.setex(searchTerm, redisTimeCache, JSON.stringify(farmaci));
        res.status(200).json(farmaci);
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
      return Farmaci.findById(id);
    };

    if (redisClient == undefined || redisDisabled) {
      const farmaci = await getData();
      res.status(200).json(farmaci);
      return;
    }

    const searchTerm = `FARMACIBY${id}`;
    redisClient.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data) {
        res.status(200).send(JSON.parse(data));
      } else {
        const farmaci = await getData(); 

        redisClient.setex(searchTerm, redisTimeCache, JSON.stringify(farmaci));
        res.status(200).json(farmaci);
      }
    });
  } catch (err) {
    res.status(500).json({"Error": err});
  }
});

router.post("/", async (req, res) => {
  try {
    const farmaci = new Farmaci({
      nome: req.body.nome,
      descrizione: req.body.descrizione,
      formato: req.body.formato,
      dose: req.body.dose,
      qty: req.body.qty,
      codice_interno: req.body.codice_interno
    });

    const result = await farmaci.save();
    
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      const searchTerm = `FARMACIALL`;
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
    const farmaci = await Farmaci.updateOne(
      { _id: id },
      {
        $set: {
          nome: req.body.nome,
          descrizione: req.body.descrizione,
          formato: req.body.formato,
          dose: req.body.dose,
          qty: req.body.qty,
          codice_interno: req.body.codice_interno
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
    res.json(farmaci);

  } catch (err) {
    res.status(500).json({error: err}) 
  }
});

module.exports = router;
