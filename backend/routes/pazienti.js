const express = require("express");
const router = express.Router();
const Pazienti = require("../models/pazienti");
const redis = require("redis");
const documentoAutorizzazioneUscita = require("../models/documentoAutorizzazioneUscita");
const documentoEsitoStrumentale = require("../models/documentoEsitoStrumentale");
const redisPort = process.env.REDISPORT || 6379;
const redisHost = process.env.REDISHOST || "redis";
const redisDisabled = process.env.REDISDISABLE === "true" || false;
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;

const client = redis.createClient(redisPort, redisHost);

router.get("/", async (req, res) => {
  try {
    //redisDisabled = false;

    const showOnlyCancellati = req.query.show == "deleted";
    const showAll = req.query.show == "all";
    const pageNumber = parseInt(req.query.pageNumber);
    const pageSize = parseInt(req.query.pageSize);
    const sortOrder = req.query.sortOrder;

    const skip = pageNumber > 0 ? (pageNumber - 1) * pageSize : 0;
    const limit = pageSize;

    const searchTerm = `PAZIENTIALL${skip}${limit}${sortOrder}`;

    console.info("searchTerm:", searchTerm);
    console.info("pageNumber:", pageNumber);
    console.info("pageSize:", pageSize);
    console.info("sortOrder:", sortOrder);

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
          const query = {
            $or: [{ cancellato: { $exists: false } }, { cancellato: false }],
          };

          console.info(`skip:${skip} limit: ${limit}`);
          const pazienti = await Pazienti.find(query).skip(skip).limit(limit);

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
    if (id == undefined || id === "undefined") {
      console.log("Error id is not defined ", id);
      res.status(404).json({ Error: "Id not defined" });
      return;
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
      indirizzoResidenza: req.body.indirizzoResidenza,
      comuneResidenza: req.body.comuneResidenza,
      provinciaResidenza: req.body.provinciaResidenza,
      statoCivile: req.body.statoCivile,
      figli: req.body.figli,
      scolarita: req.body.scolarita,
      situazioneLavorativa: req.body.situazioneLavorativa,
      personeRiferimento: req.body.personeRiferimento,
      telefono: req.body.telefono,
      dataIngresso: req.body.dataIngresso,
      indirizzoNascita: req.body.indirizzoNascita,
      comuneNascita: req.body.comuneNascita,
      provinciaNascita: req.body.provinciaNascita,

      schedaInfermeristica: req.body.schedaInfermeristica,
      schedaClinica: req.body.schedaClinica,
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
      return;
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
          indirizzoResidenza: req.body.indirizzoResidenza,
          comuneResidenza: req.body.comuneResidenza,
          provinciaResidenza: req.body.provinciaResidenza,
          statoCivile: req.body.statoCivile,
          figli: req.body.figli,
          scolarita: req.body.scolarita,
          situazioneLavorativa: req.body.situazioneLavorativa,
          personeRiferimento: req.body.personeRiferimento,
          telefono: req.body.telefono,
          dataIngresso: req.body.dataIngresso,
          indirizzoNascita: req.body.indirizzoNascita,
          comuneNascita: req.body.comuneNascita,
          provinciaNascita: req.body.provinciaNascita,

          schedaInfermeristica: req.body.schedaInfermeristica,
          schedaClinica: req.body.schedaClinica,
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
      return;
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
    client.del(`PAZIENTIALL*`);

    res.status(200);
    res.json(pazienti);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

router.get("/autorizzazioneUscita/:id", async (req, res) => {
  const { id } = req.params;
  try {
    if (id == undefined || id === "undefined") {
      console.log("Error id is not defined ", id);
      res.status(404).json({ Error: "Id not defined" });
      return;
    }

    console.log("GET Autorizzazione Uscita");

    const searchTerm = `AUTORIZZAZIONE_USCITA_BY${id}`;
    client.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data && !redisDisabled) {
        res.status(200).send(JSON.parse(data));
      } else {
        const pazienti = await documentoAutorizzazioneUscita.find({
          $and: [
            {idPaziente: id},
            {$or: [{ cancellato: { $exists: false } }, { cancellato: false }]}
          ]          
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

router.post("/autorizzazioneUscita/:id", async (req, res) => {
  console.log("Autorizzazione uscita insert");
  const { id } = req.params;
  const doc = new documentoAutorizzazioneUscita({
    idPaziente: id,
    filename: req.body.filename,
    dateupload: Date.now(),
    note: req.body.note,
    type: req.body.type,
    cancellato: false,
    dataCancellazione: undefined,
  });

  console.log("Insert doc: ", doc);
  const result = await doc.save();
  const searchTerm = `AUTORIZZAZIONE_USCITA_BY${id}`;
  client.del(searchTerm);

  res.status(200);
  res.json(doc);
});

router.delete("/autorizzazioneUscita/:id", async (req, res) => {
  try {
    console.log("Delete Autorizzazione Uscita");
    const { id } = req.params;
    if (id == undefined || id === "undefined") {
      console.log("Error id is not defined ", id);
      res.status(404).json({ Error: "Id not defined" });
      return;
    }

    if (id == null) {
      res.status(400).json({ error: "id not valid" });
    }

    const pazienti = await documentoAutorizzazioneUscita.updateOne(
      { _id: id },
      {
        $set: {
          cancellato: true,
          dataCancellazione: new Date(),
        },
      }
    );

    client.del(`AUTORIZZAZIONE_USCITA_BY${id}`);
    client.del(`AUTORIZZAZIONE_USCITA*`);

    res.status(200);
    res.json(pazienti);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});


/// ESITO STRUMENTALE

router.get("/esitoStrumentale/:id", async (req, res) => {
  const { id } = req.params;
  try {
    if (id == undefined || id === "undefined") {
      console.log("Error id is not defined ", id);
      res.status(404).json({ Error: "Id not defined" });
      return;
    }

    //console.log("GET Esito Strumentale");

    const searchTerm = `ESITO_STRUMENTALE_BY${id}`;
    client.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data && !redisDisabled) {
        res.status(200).send(JSON.parse(data));
      } else {
        const pazienti = await documentoEsitoStrumentale.find({
          $and: [
            {idPaziente: id},
            {$or: [{ cancellato: { $exists: false } }, { cancellato: false }]}
          ]          
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

router.post("/esitoStrumentale/:id", async (req, res) => {
  console.log("Esito strumentale insert");
  const { id } = req.params;
  const doc = new documentoEsitoStrumentale({
    idPaziente: id,
    filename: req.body.filename,
    dateupload: Date.now(),
    note: req.body.note,
    type: req.body.type,
    cancellato: false,
    dataCancellazione: undefined,
  });

  console.log("Insert doc: ", doc);
  const result = await doc.save();
  const searchTerm = `ESITO_STRUMENTALE_BY${id}`;
  client.del(searchTerm);

  res.status(200);
  res.json(doc);
});

router.delete("/esitoStrumentale/:id", async (req, res) => {
  try {
    console.log("Delete Esito strumentale Uscita");
    const { id } = req.params;
    if (id == undefined || id === "undefined") {
      console.log("Error id is not defined ", id);
      res.status(404).json({ Error: "Id not defined" });
      return;
    }

    if (id == null) {
      res.status(400).json({ error: "id not valid" });
    }

    const pazienti = await documentoEsitoStrumentale.updateOne(
      { _id: id },
      {
        $set: {
          cancellato: true,
          dataCancellazione: new Date(),
        },
      }
    );

    client.del(`ESITO_STRUMENTALE_BY${id}`);
    client.del(`ESITO_STRUMENTALE*`);

    res.status(200);
    res.json(pazienti);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});


module.exports = router;
