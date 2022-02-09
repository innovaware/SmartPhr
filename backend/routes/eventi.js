const express = require("express");
const router = express.Router();
const Eventi = require("../models/eventi");
const redis = require("redis");
const redisPort = process.env.REDISPORT || 6379;
const redisHost = process.env.REDISHOST || "redis";
const redisDisabled = process.env.REDISDISABLE === "true" || false;
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;

const client = redis.createClient(redisPort, redisHost);

router.get("/", async (req, res) => {
  try {
    const searchTerm = `EVENTIALL`;
    client.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data && !redisDisabled) {
        res.status(200).send(JSON.parse(data));
      } else {
        const eventi = await Eventi.find();

        client.setex(searchTerm, redisTimeCache, JSON.stringify(eventi));
        res.status(200).json(eventi);
      }
    });
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).json({ Error: err });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const searchTerm = `EVENTIBY${id}`;
    client.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data && !redisDisabled) {
        res.status(200).send(JSON.parse(data));
      } else {
        const eventi = await Eventi.findById(id);

        client.setex(searchTerm, redisTimeCache, JSON.stringify(eventi));
        res.status(200).json(eventi);
      }
    });
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

//YYYYMMDD
router.get("/search/:data", async (req, res) => {
  const { data } = req.params;
  const { user } = req.query;

  try {
    const searchTerm = `EVENTISEARCH${data}${user}`;

    if (data == undefined) {
      res.status(400);
      res.json({ Error: "data not defined" });
      return;
    }

    if (user == undefined) {
      res.status(400);
      res.json({ Error: "user not defined" });
      return;
    }

    const year = data.substring(0, 4);
    const month = data.substring(4, 6);
    const day = data.substring(6, 8);

    client.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data && !redisDisabled) {
        //console.log(`Event Buffered - ${searchTerm}`);
        res.status(200).send(JSON.parse(data));
      } else {
        const query = {
          $and: [
            {
              data: {
                $gte: new Date(year, month - 1, day, "00", "00", "00"),
                $lt: new Date(year, month - 1, day, "23", "59", "59"),
              },
              utente: user,
            },
          ],
        };
        const eventi = await Eventi.find(query);

        client.setex(searchTerm, redisTimeCache, JSON.stringify(eventi));
        res.status(200).json(eventi);
      }
    });
  } catch (err) {
    res.status(500);
    res.json({ Error: err });
  }
});

router.post("/", async (req, res) => {
  try {
    const eventi = new Eventi({
      data: req.body.data,
      descrizione: req.body.descrizione,
      tipo: req.body.tipo,
      utente: req.body.utente,
    });

    const result = await eventi.save();

    const searchTerm = `EVENTIBY${id}`;
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
    const eventi = await Eventi.updateOne(
      { _id: id },
      {
        $set: {
          data: req.body.data,
          descrizione: req.body.descrizione,
          tipo: req.body.tipo,
          utente: req.body.utente,
        },
      }
    );

    const searchTerm = `EVENTIBY${id}`;
    client.del(searchTerm);
    res.status(200);
    res.json(eventi);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

module.exports = router;
