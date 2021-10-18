const express = require("express");
//const jwt_decode = require("jwt-decode");

const router = express.Router();
const Fatture = require("../models/fatture");

const redis = require("redis");
const redisPort = process.env.REDISPORT || 6379;
const redisHost = process.env.REDISHOST || "redis";
const redisDisabled = process.env.REDISDISABLE === "true" || false;
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;

const client = redis.createClient(redisPort, redisHost);

router.get("/", async (req, res) => {
    console.log("get fatture fornitori");
  try {
    const searchTerm = `FATTUREFORNITORIALL`;
    
    client.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data && !redisDisabled) {
        res.status(200).send(JSON.parse(data));
      } else {
        const fattureFornitori = await Fatture.aggregate([
            { $project: { identifyUserObj: { "$toObjectId": "$identifyUser" }, filename: 1, dateupload: 1, note: 1 }},
            { $lookup: {
              localField: "identifyUserObj",
              from: "fornitori",
              foreignField: "_id",
              as: "fromFornitori"
            }},
             {
                $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$fromFornitori", 0 ] }, "$$ROOT" ] } }
             },
             { $project: { dataNascita: 0, comuneNascita: 0, provinciaNascita: 0, indirizzoNascita: 0, indirizzoResidenza: 0, comuneResidenza: 0, provinciaResidenza: 0, mansione: 0, tipoContratto: 0, telefono: 0, email: 0, fromFornitori: 0 } }
          ]);
        client.setex(searchTerm, redisTimeCache, JSON.stringify(fattureFornitori));
        res.status(200).json(fattureFornitori);
      }
    });
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});
/* 
router.post("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const fatture = new Fatture({
      identifyUser: id,
      filename: req.body.filename,
      dateupload: Date.now(),
      note: req.body.note,
    });

    console.log("Insert fattura: ", fatture);

    const result = await fatture.save();


    const searchTerm = `fatture${id}`;
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
    const fatture = await Fatture.updateOne(
      { _id: id },
      {
        $set: {
          identifyUser: req.body.identifyUser,
          filename: req.body.filename,
          note: req.body.note,
        },
      }
    );

    const searchTerm = `fattureBY${id}`;
    client.del(searchTerm);

    res.status(200);
    res.json(fatture);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Fatture.findById(id);
    const identifyUser = item.identifyUser;
    const fatture = await Fatture.remove({ _id: id });

    let searchTerm = `fattureBY${id}`;
    client.del(searchTerm);
    searchTerm = `fatture${identifyUser}`;
    client.del(searchTerm);


    res.status(200);
    res.json(fatture);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});
 */
module.exports = router;
