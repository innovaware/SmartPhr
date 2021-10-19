const express = require("express");
//const jwt_decode = require("jwt-decode");

const router = express.Router();
const DocDipendente = require("../models/documentidipendenti");

const redis = require("redis");
const redisPort = process.env.REDISPORT || 6379;
const redisHost = process.env.REDISHOST || "redis";
const redisDisabled = process.env.REDISDISABLE === "true" || false;
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;

const client = redis.createClient(redisPort, redisHost);

router.get("/dipendente/:id/:type", async (req, res) => {
  try {

    console.log("id: ", req.params.id);
    console.log("types: ", req.params.type);
    let id  = req.params.id;
    let type = req.params.type;

    const searchTerm = `documentiDipendente${id}`;
    /*client.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data && !redisDisabled) {
        console.log(`${searchTerm}: ${data}`);
        res.status(200).send(JSON.parse(data));
      } else {
        const documenti = await DocDipendente.find({
          dipendente: id,
          type : type
        });
        client.setex(searchTerm, redisTimeCache, JSON.stringify(documenti));
        res.status(200).json(documenti);
      }
    });*/


    const documenti = await DocDipendente.find({
      dipendente: id,
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
    const searchTerm = `documentiDipendente${id}`;
    client.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data && !redisDisabled) {
        res.status(200).send(JSON.parse(data));
      } else {
        const doc = await DocDipendente.findById(id);
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
    const doc = new DocDipendente({
      dipendente: id,
      filename: req.body.filename,
      dateupload: Date.now(),
      note: req.body.note,
      type: req.body.type,
      descrizione:  req.body.descrizione,
      filenameesito:  req.body.filenameesito
    });

    console.log("Insert doc: ", doc);

    const result = await doc.save();


    const searchTerm = `documentiDipendente${id}`;
    client.del(searchTerm);

    res.status(200);
    res.json(result);
  } catch (err) {
    res.status(500);
    res.json({ Error: err });
  }
});

router.put("/documentidipendente/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await DocDipendente.updateOne(
      { _id: id },
      {
        $set: {
          dipendente: req.body.dipendente,
          filename: req.body.filename,
          note: req.body.note,
        },
      }
    );

    const searchTerm = `documentiDipendenteBY${id}`;
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

    const item = await DocDipendente.findById(id);
    console.log('item:' + item);
    const idDipendente = item.dipendente;
    const doc = await DocDipendente.remove({ _id: id });

    let searchTerm = `documentiDipendenteBY${id}`;
    client.del(searchTerm);
    searchTerm = `documentiDipendente${idDipendente}`;
    client.del(searchTerm);


    res.status(200);
    res.json(doc);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

module.exports = router;
