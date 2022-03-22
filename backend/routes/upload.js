const { ObjectId } = require("bson");
const express = require("express");
const router = express.Router();
const SmartDocument = require("../models/SmartDocument");
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  redisClient = req.app.get("redis");
  redisDisabled = req.app.get("redisDisabled");

  const getData = () => {
    return SmartDocument.find({ user: id });
  };

  if (redisClient == undefined || redisDisabled) {
    const documents = await getData();
    res.status(200).json(documents);
    return;
  }

  try {
    const searchTerm = `FILEBYUSER${id}`;
    redisClient.get(searchTerm, async (err, data) => {
      if (err) throw err;

      // console.log(`Data from redis: ${data}`);
      if (data) {
        res.status(200).send(JSON.parse(data));
      } else {
        const documents = await getData();

        redisClient.setex(
          searchTerm,
          redisTimeCache,
          JSON.stringify(documents)
        );
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
      let path = req.body.path; //.split("/");
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
        dateupload: new Date(),
      });

      redisClient = req.app.get("redis");
      redisDisabled = req.app.get("redisDisabled");

      const resultDocumentSave = await document.save();
      res.locals.result.id = resultDocumentSave._id;

      if (redisClient != undefined && !redisDisabled) {
        const searchTerm = `FILEBYUSER${path}`;
        redisClient.del(searchTerm);
      }

      next();
    }
  } catch (err) {
    res.status(500);
    res.json({ Error: err });
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

    const result = await SmartDocument.deleteOne({ _id: ObjectId(id)});

    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      const searchTerm = `FILEBYUSER${id}`;
      redisClient.del(searchTerm);
    }

    res.status(200);
    res.json(result);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});


module.exports = router;
