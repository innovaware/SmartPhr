const express = require("express");
//const jwt_decode = require("jwt-decode");

const router = express.Router();
const DocumentiFornitore = require("../models/documentiFornitore");

const redis = require("redis");
const redisPort = process.env.REDISPORT || 6379;
const redisHost = process.env.REDISHOST || "redis";
const redisDisabled = process.env.REDISDISABLE === "true" || false;
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;

const client = redis.createClient(redisPort, redisHost);

async function getDocumentoFornitoreByIdFornitore(req, res) {
  try {
    const { id } = req.params;

    const searchTerm = `documentiFornitore${id}`;
    client.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data && !redisDisabled) {
        //console.log(`${searchTerm}: ${data}`);
        res.status(200).send(JSON.parse(data));
      } else {
        const documentiFornitore = await DocumentiFornitore.find({
          fornitore: id,
        });
        client.setex(searchTerm, redisTimeCache, JSON.stringify(documentiFornitore));
        console.log("Add caching: ", searchTerm);

        res.status(200).json(documentiFornitore);
      }
    });

    // const bonifici = await bonifici.find();
    // res.status(200).json(bonifici);
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).json({ Error: err });
  }
}

async function getDocumentoFornitoreById(req, res) {
  const { id } = req.params;
  try {
    const searchTerm = `documentiFornitoreBY${id}`;
    client.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data && !redisDisabled) {
        res.status(200).send(JSON.parse(data));
      } else {
        const documentiFornitore = await DocumentiFornitore.findById(id);
        client.setex(searchTerm, redisTimeCache, JSON.stringify(documentiFornitore));
        console.log("Add caching: ", searchTerm);

        res.status(200).json(documentiFornitore);
      }
    });
  } catch (err) {
    res.status(500).json({ Error: err });
  }
}

async function insertDocumentoFornitoreByFornitoreId(req, res) {
  try {
    const { id } = req.params;
    const documentiFornitore = new DocumentiFornitore({
      fornitore: id,
      filename: req.body.filename,
      dateupload: Date.now(),
      note: req.body.note,
    });

    console.log("Insert documentiFornitore: ", documentiFornitore);

    const result = await documentiFornitore.save();

    const searchTerm = `documentiFornitore${id}`;
    client.del(searchTerm);

    res.status(200);
    res.json(result);
  } catch (err) {
    res.status(500);
    res.json({ Error: err });
  }
}

async function modifyDocumentoFornitoreByFornitoreId(req, res) {
  try {
    const { id } = req.params;
    const documentiFornitore = await DocumentiFornitore.updateOne(
      { _id: id },
      {
        $set: {
          fornitore: req.body.pazienteID,
          filename: req.body.filename,
          note: req.body.note,
        },
      }
    );

    const searchTerm = `documentiFornitoreBY${id}`;
    client.del(searchTerm);
    console.log("Delete caching: ", searchTerm);

    res.status(200);
    res.json(documentiFornitore);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
}

async function deleteDocumentoFornitore(req, res) {
  try {
    const { id } = req.params;

    const documentiFornitore_item = await DocumentiFornitore.findById(id);
    const idFornitore = documentiFornitore_item.fornitore;

    const documentiFornitore = await DocumentiFornitore.remove({ _id: id });


    let searchTerm = `documentiFornitoreBY${id}`;
    client.del(searchTerm);
    console.log("Delete caching: ", searchTerm);

    searchTerm = `documentiFornitore${idPaziente}`;
    client.del(searchTerm);
    console.log("Delete caching: ", searchTerm);

    res.status(200);
    res.json(bonifici);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
}

router.get("/fornitore/:id", getDocumentoFornitoreByIdFornitore);
router.get("/:id", getDocumentoFornitoreById);
router.post("/fornitore/:id", insertDocumentoFornitoreByFornitoreId);
router.put("/:id", modifyDocumentoFornitoreByFornitoreId);
router.delete("/:id", deleteDocumentoFornitore);

module.exports = router;
