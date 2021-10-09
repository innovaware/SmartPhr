const express = require("express");
const router = express.Router();
const Consulenti = require("../models/consulenti");
const redis = require("redis");
const redisPort = process.env.REDISPORT || 6379;
const redisHost = process.env.REDISHOST || "redis";
const redisDisabled = process.env.REDISDISABLE === "true" || false;
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;

const client = redis.createClient(redisPort, redisHost);

router.get("/", async (req, res) => {
  try {
    const searchTerm = `CONSULENTIALL`;
    const showOnlyCancellati = req.query.show == "deleted";
    const showAll = req.query.show == "all";

    if (showOnlyCancellati || showAll) {
      console.log("Show all or deleted");
      let query = {};
      if (showOnlyCancellati) {
        query = { cancellato: true };
      }
      const consulenti = await Consulenti.find(query);
      res.status(200).json(consulenti);
    } else {
      client.get(searchTerm, async (err, data) => {
        if (err) throw err;

        if (data && !redisDisabled) {
          res.status(200).send(JSON.parse(data));
        } else {
          const query = {
            $or: [{ cancellato: { $exists: false } }, { cancellato: false }],
          };
          const consulenti = await Consulenti.find(query);

          if (consulenti.length > 0) res.status(200).json(consulenti);
          else res.status(404).json({ error: "No patients found" });

          client.setex(searchTerm, redisTimeCache, JSON.stringify(consulenti));
          // res.status(200).json(consulenti);
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
    if (id == undefined || id === "undefined") {
      console.log("Error id is not defined ", id);
      res.status(404).json({ Error: "Id not defined" });
      return;
    }

    const searchTerm = `CONSULENTIBY${id}`;
    client.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data && !redisDisabled) {
        res.status(200).send(JSON.parse(data));
      } else {
        const consulenti = await Consulenti.findById({
          $and: [
            {
              $or: [{ cancellato: { $exists: false } }, { cancellato: false }],
            },
            { _id: id },
          ],
        });

        client.setex(searchTerm, redisTimeCache, JSON.stringify(consulenti));
        if (consulenti != null) res.status(200).json(consulenti);
        else res.status(404).json({ error: "No patient found" });
      }
    });
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

router.post("/", async (req, res) => {
  try {
    const dipendente = new Consulenti({
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
      tipologiaContratto: req.body.tipologiaContratto,
      telefono: req.body.telefono,
      email: req.body.email,
    });

    const result = await dipendente.save();
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
      return;
    }

    const consulenti = await Consulenti.updateOne(
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
          tipologiaContratto: req.body.tipologiaContratto,
          telefono: req.body.telefono,
          email: req.body.email,
        },
      }
    );

    const searchTerm = `CONSULENTIBY${id}`;
    client.del(searchTerm);

    res.status(200);
    res.json(consulenti);
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
      return;
    }

    if (id == null) {
      res.status(400).json({ error: "id not valid" });
    }

    const consulente = await Consulenti.updateOne(
      { _id: id },
      {
        $set: {
          cancellato: true,
          dataCancellazione: new Date(),
        },
      }
    );

    client.del(`CONSULENTIBY${id}`);
    client.del(`CONSULENTIALL`);

    res.status(200);
    res.json(consulente);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

module.exports = router;
