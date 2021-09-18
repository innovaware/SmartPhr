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
  try {
    const searchTerm = `FILEBYUSER${id}`;
    console.log(`Find document from user: ${id}`);
    client.get(searchTerm, async (err, data) => {
      if (err) throw err;

      // console.log(`Data from redis: ${data}`);
      if (data && !redisDisabled) {
        res.status(200).send(JSON.parse(data));
      } else {
        console.log(`Find document from user: ${id}`);
        const documents = await SmartDocument.find({ user: id });

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
      let path = req.body.path.split("/");
      let name = req.body.name;

      result = {
        file: file,
        typeDocument: typeDocument,
        path: path,
        name: name,
      };
      res.locals.result = result;
      // res.json({ result: result });

      let root = `${result.path[0]}`;
      const document = new SmartDocument({
        typeDocument: typeDocument,
        path: root,
        name: name,
        user: root,
      });

      document
        .save()
        .then((x) => {
          console.log(x);
          const searchTerm = `FILEBYUSER${root}`;
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
