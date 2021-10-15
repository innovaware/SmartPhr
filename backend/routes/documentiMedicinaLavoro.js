const express = require("express");
//const jwt_decode = require("jwt-decode");

const router = express.Router();
const DocMedicinaLavoro = require("../models/documentiMedicinaLavoro");

const redis = require("redis");
const redisPort = process.env.REDISPORT || 6379;
const redisHost = process.env.REDISHOST || "redis";
const redisDisabled = process.env.REDISDISABLE === "true" || false;
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;

const client = redis.createClient(redisPort, redisHost);

router.get("/dipendente/:id", async (req, res) => {
  try {

    console.log("id: ", req.params.id);
    console.log("types: ", req.params.type);
    let id  = req.params.id;
    let type = req.params.type;

    const searchTerm = `documentiMedicinaLavoro${id}`;
    client.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data && !redisDisabled) {
        console.log(`${searchTerm}: ${data}`);
        res.status(200).send(JSON.parse(data));
      } else {
        const documenti = await DocMedicinaLavoro.find({
          dipendente: id
        });
        client.setex(searchTerm, redisTimeCache, JSON.stringify(documenti));
        res.status(200).json(documenti);
      }
    });

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
    const searchTerm = `documentiMedicinaLavoro${id}`;
    client.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data && !redisDisabled) {
        res.status(200).send(JSON.parse(data));
      } else {
        const doc = await DocMedicinaLavoro.findById(id);
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
    const doc = new DocMedicinaLavoro({
      dipendente: id,
      filenameRichiesta: req.body.filenameRichiesta,
      dateuploadRichiesta: Date.now(),
      noteRichiesta: req.body.noteRichiesta,
      filenameCertificato: req.body.filenameCertificato != null ? req.body.filenameCertificato : "",
      dateuploadCertificato:  req.body.filenameCertificato != null ? Date.now() : "",
      noteCertificato: req.body.noteCertificato
    });

    console.log("Insert doc: ", doc);

    const result = await doc.save();


    const searchTerm = `documentiMedicinaLavoro${id}`;
    client.del(searchTerm);

    res.status(200);
    res.json(result);
  } catch (err) {
    res.status(500);
    res.json({ Error: err });
  }
});

router.put("/documento/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await DocMedicinaLavoro.updateOne(
      { _id: id },
      {
        $set: {
          dipendente: req.body.dipendente,
          filename: req.body.filename,
          note: req.body.note,
        },
      }
    );

    const searchTerm = `documentiMedicinaLavoro${id}`;
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

    const item = await DocMedicinaLavoro.findById(id);
    console.log('item:' + item);
    const idDipendente = item.dipendente;
    const doc = await DocMedicinaLavoro.remove({ _id: id });

    let searchTerm = `documentiMedicinaLavoro${id}`;
    client.del(searchTerm);
    searchTerm = `documentiMedicinaLavoro${idDipendente}`;
    client.del(searchTerm);


    res.status(200);
    res.json(doc);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

module.exports = router;
