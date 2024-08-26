const express = require("express");
const router = express.Router();
const Fatture = require("../models/fatture");
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Function to get data from the database
        const getData = () => {
            return Fatture.find({
                identifyUser: id,
            });
        };

        // Fetch data from the database
        const fatture = await getData();

        // Send the data in the response
        res.status(200).json(fatture);
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ Error: err.message });
    }
});


/* router.get("/:id", async (req, res) => {
  const { id } = req.params;
  console.error("Fatture get/:id: ", id);
  try {
    const searchTerm = `fattureBY${id}`;
    client.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data && !redisDisabled) {
        res.status(200).send(JSON.parse(data));
      } else {
        const fatture = await Fatture.findById(id);
        console.error("Fatture.findById(id): ", JSON.stringify(fatture));
        client.setex(searchTerm, redisTimeCache, JSON.stringify(fatture));
        res.status(200).json(fatture);
      }
    });
  } catch (err) {
    res.status(500).json({ Error: err });
  }
}); */

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

    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      const searchTerm = `fatture${id}`;
      redisClient.del(searchTerm);
    }

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

    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      const searchTerm = `fattureBY${id}`;
      redisClient.del(searchTerm);
    }

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

    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      redisClient.del(`fattureBY${id}`);
      redisClient.del(`fatture${identifyUser}`);
    }

    res.status(200);
    res.json(fatture);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

module.exports = router;
