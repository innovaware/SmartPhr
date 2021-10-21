const express = require("express");
//const jwt_decode = require("jwt-decode");

const router = express.Router();
const ProspettoCM = require("../models/prospettoCM");

const redis = require("redis");
const redisPort = process.env.REDISPORT || 6379;
const redisHost = process.env.REDISHOST || "redis";
const redisDisabled = process.env.REDISDISABLE === "true" || false;
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;

const client = redis.createClient(redisPort, redisHost);

router.get("/", async (req, res) => {
    try {
      const searchTerm = `PROSPETTOCMALL`;
    const showOnlyCancellati = req.query.show == "deleted";
      const showAll = req.query.show == "all";
  
      if (showOnlyCancellati || showAll) {
        console.log("Show all or deleted");
        let query = {};
        if (showOnlyCancellati) {
          query = { cancellato: true };
        }
        const prospettoCM = await ProspettoCM.find(query);
        res.status(200).json(prospettoCM);
      } else { 
        client.get(searchTerm, async (err, data) => {
          if (err) throw err;
  
          if (data && !redisDisabled) {
            res.status(200).send(JSON.parse(data));
          } else {
            const query = {
                $or: [{ cancellato: { $exists: false } }, { cancellato: false }],
              };
            const prospettoCM = await ProspettoCM.find(query);
  
            res.status(200).json(prospettoCM);
            client.setex(searchTerm, redisTimeCache, JSON.stringify(prospettoCM));
            // res.status(200).json(curriculum);
          }
        });
       }
    } catch (err) {
      console.error("Error: ", err);
      res.status(500).json({ Error: err });
    }
  });

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const searchTerm = `PROSPETTOCM${id}`;
    client.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data && !redisDisabled) {
        console.log(`${searchTerm}: ${data}`);
        res.status(200).send(JSON.parse(data));
      } else {
        const prospettoCM = await ProspettoCM.find({
          identifyUser: id,
        });
        client.setex(searchTerm, redisTimeCache, JSON.stringify(prospettoCM));
        res.status(200).json(prospettoCM);
      }
    });

    // const prospettoCM = await prospettoCM.find();
    // res.status(200).json(prospettoCM);
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).json({ Error: err });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  console.error("ProspettoCM get/:id: ", id);
  try {
    const searchTerm = `PROSPETTOCMBY${id}`;
    client.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data && !redisDisabled) {
        res.status(200).send(JSON.parse(data));
      } else {
        const prospettoCM = await ProspettoCM.findById(id);
        console.error("ProspettoCM.findById(id): ", JSON.stringify(prospettoCM));
        client.setex(searchTerm, redisTimeCache, JSON.stringify(prospettoCM));
        res.status(200).json(prospettoCM);
      }
    });
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

router.post("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const prospettoCM = new ProspettoCM({
      identifyUser: id,
      filename: req.body.filename,
      dateupload: Date.now(),
      note: req.body.note,
    });

    console.log("Insert prospetto: ", prospettoCM);

    const result = await prospettoCM.save();


    const searchTerm = `prospettoCM${id}`;
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
    const prospettoCM = await ProspettoCM.updateOne(
      { _id: id },
      {
        $set: {
          identifyUser: req.body.identifyUser,
          filename: req.body.filename,
          note: req.body.note,
        },
      }
    );

    const searchTerm = `prospettoCMBY${id}`;
    client.del(searchTerm);

    res.status(200);
    res.json(prospettoCM);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const item = await ProspettoCM.findById(id);
    const identifyUser = item.identifyUser;
    const prospettoCM = await ProspettoCM.remove({ _id: id });

    let searchTerm = `PROSPETTOCMBY${id}`;
    client.del(searchTerm);
    searchTerm = `PROSPETTOCMALL`;
    client.del(searchTerm);


    res.status(200);
    res.json(prospettoCM);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

module.exports = router;
