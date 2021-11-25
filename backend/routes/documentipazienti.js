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

module.exports = router;
