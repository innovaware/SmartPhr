const express = require("express");
const router = express.Router();
const Pazienti = require("../models/pazienti");
const redis = require("redis");
const redisPort = process.env.REDISPORT || 6379;
const redisHost = process.env.REDISHOST || "redis";
const redisDisabled = process.env.REDISDISABLE === "true" || false;
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;

const client = redis.createClient(redisPort, redisHost);

router.get("/", async (req, res) => {
  try {
    const searchTerm = `PAZIENTIALL`;
    const showOnlyCancellati = req.query.show == "deleted";
    const showAll = req.query.show == "all";

    if (showOnlyCancellati || showAll) {
      console.log("Show all or deleted");
      let query = {};
      if (showOnlyCancellati) {
        query = { cancellato: true };
      }
      const pazienti = await Pazienti.find(query);
      res.status(200).json(pazienti);
    } else {
      client.get(searchTerm, async (err, data) => {
        if (err) throw err;

        if (data && !redisDisabled) {
          res.status(200).send(JSON.parse(data));
        } else {
          const pazienti = await Pazienti.find({
            $or: [{ cancellato: { $exists: false } }, { cancellato: false }],
          });

          if (pazienti.length > 0) res.status(200).json(pazienti);
          else res.status(404).json({ error: "No patients found" });

          client.setex(searchTerm, redisTimeCache, JSON.stringify(pazienti));
          //res.status(200).json(pazienti);
        }
      });
    }
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).json({ Error: err });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {

    // console.log("Check input parameters ", (id === "undefined"));
    if (id == undefined || id === "undefined") {
      console.log("Error id is not defined ", id);
      res.status(404).json({ Error: "Id not defined" });
      return
    }

    const searchTerm = `PAZIENTIBY${id}`;
    client.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data && !redisDisabled) {
        res.status(200).send(JSON.parse(data));
      } else {
        const pazienti = await Pazienti.findOne({
          $and: [
            {
              $or: [{ cancellato: { $exists: false } }, { cancellato: false }],
            },
            { _id: id },
          ],
        });

        client.setex(searchTerm, redisTimeCache, JSON.stringify(pazienti));
        if (pazienti != null) res.status(200).json(pazienti);
        else res.status(404).json({ error: "No patient found" });
      }
    });
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

router.post("/", async (req, res) => {
  try {
    const pazienti = new Pazienti({
      cognome: req.body.cognome,
      nome: req.body.nome,
      sesso: req.body.sesso,
      luogoNascita: req.body.luogoNascita,
      dataNascita: req.body.dataNascita,
      residenza: req.body.residenza,
      statoCivile: req.body.statoCivile,
      figli: req.body.figli,
      scolarita: req.body.scolarita,
      situazioneLavorativa: req.body.situazioneLavorativa,
      personeRiferimento: req.body.personeRiferimento,
      telefono: req.body.telefono,
      dataIngresso: req.body.dataIngresso,
      provincia: req.body.provincia,
      localita: req.body.localita,
      comuneNascita: req.body.comuneNascita,
      provinciaNascita: req.body.provinciaNascita,
    });

    const result = await pazienti.save();
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
    if (id == undefined || id === "undefined") {
      console.log("Error id is not defined ", id);
      res.status(404).json({ Error: "Id not defined" });
      return
    }

    const pazienti = await Pazienti.updateOne(
      { _id: id },
      {
        $set: {
          cognome: req.body.cognome,
          nome: req.body.nome,
          sesso: req.body.sesso,
          luogoNascita: req.body.luogoNascita,
          dataNascita: req.body.dataNascita,
          residenza: req.body.residenza,
          statoCivile: req.body.statoCivile,
          figli: req.body.figli,
          scolarita: req.body.scolarita,
          situazioneLavorativa: req.body.situazioneLavorativa,
          personeRiferimento: req.body.personeRiferimento,
          telefono: req.body.telefono,
          dataIngresso: req.body.dataIngresso,
          provincia: req.body.provincia,
          localita: req.body.localita,
          comuneNascita: req.body.comuneNascita,
          provinciaNascita: req.body.provinciaNascita,
        },
      }
    );

    const searchTerm = `PAZIENTIBY${id}`;
    client.del(searchTerm);

    res.status(200);
    res.json(pazienti);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (id == undefined || id === "undefined") {
      console.log("Error id is not defined ", id);
      res.status(404).json({ Error: "Id not defined" });
      return
    }

    if (id == null) {
      res.status(400).json({ error: "id not valid" });
    }

    const pazienti = await Pazienti.updateOne(
      { _id: id },
      {
        $set: {
          cancellato: true,
          dataCancellazione: new Date(),
        },
      }
    );

    client.del(`PAZIENTIBY${id}`);
    client.del(`PAZIENTIALL`);

    res.status(200);
    res.json(pazienti);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

module.exports = router;
