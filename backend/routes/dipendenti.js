const express = require("express");
const router = express.Router();
const Dipendenti = require("../models/dipendenti");
const redis = require("redis");
const redisPort = process.env.REDISPORT || 6379;
const redisHost = process.env.REDISHOST || "redis";
const redisDisabled = process.env.REDISDISABLE === "true" || false;
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;

const client = redis.createClient(redisPort, redisHost);

router.get("/", async (req, res) => {
  try {
    const searchTerm = `DIPENDENTIALL`;
    // Ricerca su Redis Cache
    client.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data && !redisDisabled) {
        // Dato trovato in cache - ritorna il json 
        res.status(200).send(JSON.parse(data));
      } else {
        // Recupero informazioni dal mongodb
        const dipendenti = await Dipendenti.find();

        // Aggiorno la cache con i dati recuperati da mongodb
        client.setex(searchTerm, redisTimeCache, JSON.stringify(dipendenti));

        // Ritorna il json 
        res.status(200).json(dipendenti);
      }
    });
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).json({ Error: err });
  }
});

// http://[HOST]:[PORT]/api/dipendenti/[ID_DIPENDENTE]
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const searchTerm = `DIPENDENTIBY${id}`;
    client.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data && !redisDisabled) {
        res.status(200).send(JSON.parse(data));
      } else {
        const dipendenti = await Dipendenti.findById(id);

        client.setex(searchTerm, redisTimeCache, JSON.stringify(dipendenti));
        res.status(200).json(dipendenti);
      }
    });
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

// http://[HOST]:[PORT]/api/dipendenti (POST)
// INSERT dipendente su DB
router.post("/", async (req, res) => {
  try {
    const dipendente = new Dipendenti({
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
      titoloStudio: req.body.titoloStudio,
      mansione: req.body.mansione,
      tipoContratto: req.body.tipoContratto,
      telefono: req.body.telefono,
      email: req.body.email,
      idUser: req.body.idUser,
    });

    // Salva i dati sul mongodb
    const result = await dipendente.save();

    const searchTerm = `DIPENDENTIALL`;
    client.del(searchTerm);

    res.status(200);
    res.json(result);
  } catch (err) {
    res.status(500);
    res.json({ Error: err });
  }
});

// http://[HOST]:[PORT]/api/dipendenti/[ID_DIPENDENTE]
// Modifica del dipendente
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // Aggiorna il documento su mongodb
    const dipendenti = await Dipendenti.updateOne(
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
          titoloStudio: req.body.titoloStudio,
          mansione: req.body.mansione,
          tipoContratto: req.body.tipoContratto,
          telefono: req.body.telefono,
          email: req.body.email,
        },
      }
    );

    const searchTerm = `DIPENDENTIBY${id}`;
    client.del(searchTerm);

    res.status(200).json(dipendenti);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});


module.exports = router;
