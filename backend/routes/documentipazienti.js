const express = require("express");
//const jwt_decode = require("jwt-decode");

const router = express.Router();
const DocPaziente = require("../models/documentiPazienti");

const redis = require("redis");
const redisPort = process.env.REDISPORT || 6379;
const redisHost = process.env.REDISHOST || "redis";
const redisDisabled = process.env.REDISDISABLE === "true" || false;
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;

const client = redis.createClient(redisPort, redisHost);

router.get("/paziente/:id/:type", async (req, res) => {
  try {

    console.log("id: ", req.params.id);
    console.log("types: ", req.params.type);
    let id  = req.params.id;
    let type = req.params.type;

    const searchTerm = `documentiPaziente${id}`;
    /*client.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data && !redisDisabled) {
        console.log(`${searchTerm}: ${data}`);
        res.status(200).send(JSON.parse(data));
      } else {
        const documenti = await DocPaziente.find({
          paziente: id,
          type : type
        });
        client.setex(searchTerm, redisTimeCache, JSON.stringify(documenti));
        res.status(200).json(documenti);
      }
    });*/


    const documenti = await DocPaziente.find({
      paziente: id,
      type : type
    });

    client.setex(searchTerm, redisTimeCache, JSON.stringify(documenti));
        res.status(200).json(documenti);

        
    // const fatture = await fatture.find();
    // res.status(200).json(fatture);
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).json({ Error: err });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const searchTerm = `documentiPaziente${id}`;
    client.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data && !redisDisabled) {
        res.status(200).send(JSON.parse(data));
      } else {
        const doc = await DocPaziente.findById(id);
        client.setex(searchTerm, redisTimeCache, JSON.stringify(doc));
        res.status(200).json(doc);
      }
    });
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

router.post("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const doc = new DocPaziente({
      paziente: id,
      filename: req.body.filename,
      dateupload: Date.now(),
      note: req.body.note,
      type: req.body.type,
      descrizione:  req.body.descrizione,
      filenameesito:  req.body.filenameesito
    });

    console.log("Insert doc: ", doc);

    const result = await doc.save();


    const searchTerm = `documentiPaziente${id}`;
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
    const doc = await DocPaziente.updateOne(
      { _id: id },
      {
        $set: {
          paziente: req.body.paziente,
          filename: req.body.filename,
          filenameesito: req.body.filenameesito,
          note: req.body.note,
        },
      }
    );

    const searchTerm = `documentiPazienteBY${id}`;
    client.del(searchTerm);

    res.status(200);
    res.json(doc);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});


router.delete("/documento/:id", async (req, res) => {
  try {
    const { id } = req.params;

    console.log('id:' + id);

    const item = await DocPaziente.findById(id);
    console.log('item:' + item);
    const idPaziente = item.paziente;
    const doc = await DocPaziente.remove({ _id: id });

    let searchTerm = `documentiPazienteBY${id}`;
    client.del(searchTerm);
    searchTerm = `documentiPaziente${idPaziente}`;
    client.del(searchTerm);


    res.status(200);
    res.json(doc);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});



// AUTORIZZAZIONE USCITA

router.get("/autorizzazioneUscita/all", async (req, res) => {
  try {
    console.log("GET Autorizzazione Uscita");

    const searchTerm = `AUTORIZZAZIONE_USCITA`;
    client.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data && !redisDisabled) {
        res.status(200).send(JSON.parse(data));
      } else {
        const pazienti = await DocPaziente.find({
          $and: [
            { type: "AutorizzazioneUscita" },
            {
              $or: [{ cancellato: { $exists: false } }, { cancellato: false }],
            },
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
        const pazienti = await DocPaziente.find({
          $and: [
            { paziente: id },
            { type: "AutorizzazioneUscita" },
            {
              $or: [{ cancellato: { $exists: false } }, { cancellato: false }],
            },
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

router.post("/autorizzazioneUscita/:id", async (req, res) => {
  console.log("Autorizzazione uscita insert");
  const { id } = req.params;
  const doc = new DocPaziente({
    paziente: id,
    filename: req.body.filename,
    dateupload: Date.now(),
    note: req.body.note,
    type: "AutorizzazioneUscita",
    cancellato: false,
    dataCancellazione: undefined,
    descrizione: undefined,
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

    const pazienti = await DocPaziente.updateOne(
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
router.get("/esitoStrumentale/all", async (req, res) => {
  try {
    const searchTerm = `ESITO_STRUMENTALE`;
    client.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data && !redisDisabled) {
        res.status(200).send(JSON.parse(data));
      } else {

        const query = {
          $and: [
            { type: "EsitoStrumentale" },
            {
              $or: [{ cancellato: { $exists: false } }, { cancellato: false }],
            },
          ],
        };

        const pazienti = await DocPaziente.find(query);

        client.setex(searchTerm, redisTimeCache, JSON.stringify(pazienti));
        if (pazienti != null) res.status(200).json(pazienti);
        else res.status(404).json({ error: "No patient found" });
      }
    });
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

router.get("/esitoStrumentale/:id", async (req, res) => {
  const { id } = req.params;
  try {
    if (id == undefined || id === "undefined") {
      console.log("Error id is not defined ", id);
      res.status(404).json({ Error: "Id not defined" });
      return;
    }

    console.log("GET Esito Strumentale. Id: ", id);

    const searchTerm = `ESITO_STRUMENTALE_BY${id}`;
    client.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data && !redisDisabled) {
        res.status(200).send(JSON.parse(data));
      } else {

        const query = {
          $and: [
            { paziente: id },
            { type: "EsitoStrumentale" },
            {
              $or: [{ cancellato: { $exists: false } }, { cancellato: false }],
            },
          ],
        };

        const pazienti = await DocPaziente.find(query);
        console.log("GET Esito Strumentale. data: ", query);

        client.setex(searchTerm, redisTimeCache, JSON.stringify(pazienti));
        if (pazienti != null) res.status(200).json(pazienti);
        else res.status(404).json({ error: "No patient found" });
      }
      // console.log("GET Esito Strumentale. data: ", data);
    });
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

router.post("/esitoStrumentale/:id", async (req, res) => {
  console.log("Esito strumentale insert");
  const { id } = req.params;
  const doc = new DocPaziente({
    paziente: id,
    filename: req.body.filename,
    dateupload: Date.now(),
    note: req.body.note,
    type: "EsitoStrumentale",
    typeDocument: req.body.typeDocument,
    cancellato: false,
    dataCancellazione: undefined,
    descrizione: undefined,
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

    const pazienti = await DocPaziente.updateOne(
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

// REFERTO EMATOCHIMICO

router.get("/refertoEmatochimico/all", async (req, res) => {
  try {

    const searchTerm = `REFERTO_EMATOCHIMICO`;
    client.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data && !redisDisabled) {
        res.status(200).send(JSON.parse(data));
      } else {
        const pazienti = await DocPaziente.find({
          $and: [
            { type: "RefertoEsameEmatochimico" },
            {
              $or: [{ cancellato: { $exists: false } }, { cancellato: false }],
            },
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



module.exports = router;
