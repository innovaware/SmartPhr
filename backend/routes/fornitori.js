const express = require("express");
const router = express.Router();
const Fornitori = require("../models/fornitori");
//const redis = require("redis");
//const redisPort = process.env.REDISPORT || 6379;
//const redisHost = process.env.REDISHOST || 'redis';
//const redisDisabled = process.env.REDISDISABLE === "true" || false;
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;
//const client = redis.createClient(redisPort, redisHost);

router.get("/", async (req, res) => {
  try {
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");
    
    const getData = () => {
      return Fornitori.find()
    };

    if (redisClient == undefined || redisDisabled) {
      const fornitori = await getData()
      res.status(200).json(fornitori);
      return;
    }

    const searchTerm = `FORNITORIALL`;
    redisClient.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data) {
        res.status(200).send(JSON.parse(data));
      } else {
        const fornitori = await getData()

        redisClient.setex(searchTerm, redisTimeCache, JSON.stringify(fornitori));
        res.status(200).json(fornitori);
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
    
    const getData = (query) => {
      return Consulenti.find(query);
    };



    const searchTerm = `FORNITORIBY${id}`;
    redisClient.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data && !redisDisabled) {
        res.status(200).send(JSON.parse(data));
      } else {
        const fornitori = await Fornitori.findById(id);

        redisClient.setex(searchTerm, redisTimeCache, JSON.stringify(fornitori));
        res.status(200).json(fornitori);
      }
    });
  } catch (err) {
    res.status(500).json({"Error": err});
  }
});

router.post("/", async (req, res) => {
  try {
    const fornitore = new Fornitori({
      cognome: req.body.cognome,
      nome: req.body.nome,
      codiceFiscale: req.body.codiceFiscale,
      dataNascita: req.body.dataNascita,
      comuneNascita: req.body.comuneNascita,
      provinciaNascita: req.body.provinciaNascita,
      indirizzoNascita: req.body.indirizzoNascita,
      indirizzoResidenza: req.body.indirizzoResidenza,
      comuneResidenza: req.body.comuneResidenza,
      provinciaResidenza: req.body.provinciaResidenza,  
      mansione: req.body.mansione,
      tipoContratto: req.body.tipoContratto,
      telefono: req.body.telefono,
      email: req.body.email,
    });

    console.log(req.body);

    const result = await fornitore.save();

    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      const searchTerm = `FORNITORIALL`;
      redisClient.delete(searchTerm);
    }

    res.status(200);
    res.json(result);

  } catch (err) {
    res.status(500);
    res.json({"Error": err});
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const fornitori = await Fornitori.updateOne(
      { _id: id },
      {
        $set: {
          cognome: req.body.cognome,
          nome: req.body.nome,
          codiceFiscale: req.body.codiceFiscale,
          dataNascita: req.body.dataNascita,
          comuneNascita: req.body.comuneNascita,
          provinciaNascita: req.body.provinciaNascita,
          indirizzoNascita: req.body.indirizzoNascita,
          indirizzoResidenza: req.body.indirizzoResidenza,
          comuneResidenza: req.body.comuneResidenza,
          provinciaResidenza: req.body.provinciaResidenza,  
          mansione: req.body.mansione,
          tipoContratto: req.body.tipoContratto,
          telefono: req.body.telefono,
          email: req.body.email,
        },
      }
    );
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      const searchTerm = `FORNITORIBY${id}`;
      redisClient.del(searchTerm);
    }

    res.status(200);
    res.json(fornitori);

  } catch (err) {
    res.status(500).json({"Error": err});
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Fornitori.findById(id);
    const identifyUser = item.identifyUser;
    const fornitori = await Fornitori.remove({ _id: id });

    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      let searchTerm = `fornitoriBY${id}`;
      redisClient.del(searchTerm);
      searchTerm = `fornitori${identifyUser}`;
      redisClient.del(searchTerm);
    }


    res.status(200);
    res.json(fornitori);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

module.exports = router;
