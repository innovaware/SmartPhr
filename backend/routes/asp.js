const express = require("express");
const ASP = require("../models/asp");
const Log = require("../models/log");
const Dipendenti = require("../models/dipendenti");

const router = express.Router();
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;

router.get("/", async (req, res) => {
    try {
        // Get the redisDisabled flag from the app settings
        const redisDisabled = req.app.get("redisDisabled");

        const getData = () => {
            return ASP.find();
        };

        // Fetch data directly if Redis is disabled or undefined
        const asp = await getData();
        res.status(200).json(asp);
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
    redisClient.get(searchTerm, async (err, asps) => {
      if (err) throw err;

      if (asps) {
        res.status(200).send(JSON.parse(asps));
      } else {
        const asp = await getData();
        redisClient.setex(searchTerm, redisTimeCache, JSON.stringify(asp));
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

      const user = res.locals.auth;

      const getDipendente = () => {
          return Dipendenti.findById(user.dipendenteID);
      };

      const dipendenti = await getDipendente();

      const log = new Log({
          data: new Date(),
          operatore: dipendenti.nome + " " + dipendenti.cognome,
          operatoreID: user.dipendenteID,
          className: "ASP",
          operazione: "Inserimento ASP. ",
      });
      console.log("log: ", log);
      const resultLog = await log.save();

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

      const user = res.locals.auth;

      const getDipendente = () => {
          return Dipendenti.findById(user.dipendenteID);
      };

      const dipendenti = await getDipendente();

      const log = new Log({
          data: new Date(),
          operatore: dipendenti.nome + " " + dipendenti.cognome,
          operatoreID: user.dipendenteID,
          className: "ASP",
          operazione: "Modifica ASP. ",
      });
      console.log("log: ", log);
      const resultLog = await log.save();

    res.status(200);
    res.json(asp);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

module.exports = router;
