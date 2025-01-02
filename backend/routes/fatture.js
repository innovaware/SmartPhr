const express = require("express");
const router = express.Router();
const Fatture = require("../models/fatture");
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;
const Log = require("../models/log");
const Dipendenti = require("../models/dipendenti");

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Function to get data from the database
        const getData = () => {
            return Fatture.find({
                identifyUser: id,
            });
        };

        // Fetch data from the database
        const fatture = await getData();

        // Send the data in the response
        res.status(200).json(fatture);
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ Error: err.message });
    }
});

router.post("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const fatture = new Fatture({
      identifyUser: id,
      filename: req.body.filename,
      dateupload: Date.now(),
      note: req.body.note,
    });

    console.log("Insert fattura: ", fatture);

    const result = await fatture.save();

    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      const searchTerm = `fatture${id}`;
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
          className: "Fatture",
          operazione: "Inserimento fattura: " + fatturre.filename,
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
    const fatture = await Fatture.updateOne(
      { _id: id },
      {
        $set: {
          identifyUser: req.body.identifyUser,
          filename: req.body.filename,
          note: req.body.note,
        },
      }
    );

    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      const searchTerm = `fattureBY${id}`;
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
          className: "Fatture",
          operazione: "Modifica fattura: " + fatturre.filename,
      });
      console.log("log: ", log);
      const resultLog = await log.save();

    res.status(200);
    res.json(fatture);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Fatture.findById(id);
    const identifyUser = item.identifyUser;
    const fatture = await Fatture.remove({ _id: id });

    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      redisClient.del(`fattureBY${id}`);
      redisClient.del(`fatture${identifyUser}`);
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
          className: "Fatture",
          operazione: "Eliminazione fattura: " + fatturre.filename,
      });
      console.log("log: ", log);
      const resultLog = await log.save();

    res.status(200);
    res.json(fatture);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

module.exports = router;
