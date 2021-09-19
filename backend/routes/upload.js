const express = require("express");
const SmartDocument = require("../models/SmartDocument");
const redis = require("redis");
const redisPort = process.env.REDISPORT || 6379;
const redisHost = process.env.REDISHOST || "redis";
const client = redis.createClient(redisPort, redisHost);
const redisDisabled = process.env.REDISDISABLE === "true" || false;
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;

const router = express.Router();

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  console.log(`GET FILES from paziente: ${id}`);
  
  try {
    const searchTerm = `FILEBYUSER${id}`;
    client.get(searchTerm, async (err, data) => {
      if (err) throw err;

      // console.log(`Data from redis: ${data}`);
      if (data && !redisDisabled) {
        res.status(200).send(JSON.parse(data));
      } else {
        const documents = await SmartDocument.find({ user: id });
        console.log(`From MONGO document from user: ${id} ${documents.length}`);

        client.setex(searchTerm, redisTimeCache, JSON.stringify(documents));
        res.status(200).json(documents);
      }
    });
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

router.post("/", async (req, res, next) => {
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: "No file uploaded",
      });
    } else {
      let result;

      let file = req.files.file;
      let typeDocument = req.body.typeDocument;
      let path = req.body.path;//.split("/");
      let name = req.body.name;

      result = {
        file: file,
        typeDocument: typeDocument,
        path: path,
        name: name,
      };
      res.locals.result = result;
      // res.json({ result: result });

      const document = new SmartDocument({
        typeDocument: typeDocument,
        // path: root,
        path: path,
        name: name,
        user: path,
      });

      console.log(`From MONGO save document: ${document}`);
      document
        .save()
        .then((x) => {
          console.log(x);
          const searchTerm = `FILEBYUSER${path}`;
          client.del(searchTerm);
        })
        .catch((err) => {
          console.error(err);
        });

      next();
    }
  } catch (err) {
    res.status(500);
    res.json({ Error: err });
  }
});

module.exports = router;
