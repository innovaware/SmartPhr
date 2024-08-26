const express = require("express");
const router = express.Router();
const AnticipoFatture = require("../models/anticipoFatture");
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;

router.get("/", async (req, res) => {
    try {
        // Get the redisDisabled flag from the app settings
        redisDisabled = req.app.get("redisDisabled");

        const getData = (query) => {
            return AnticipoFatture.find(query);
        };

        // Define the query for retrieving data
        const defaultQuery = {
            $or: [{ cancellato: { $exists: false } }, { cancellato: false }],
        };

        // Handle the request based on the query parameters
        const showOnlyCancellati = req.query.show == "deleted";
        const showAll = req.query.show == "all";

        if (showOnlyCancellati || showAll) {
            console.log("Show all or deleted");
            let query = {};
            if (showOnlyCancellati) {
                query = { cancellato: true };
            }
            const anticipoFatture = await getData(query);
            res.status(200).json(anticipoFatture);
        } else {
            // Retrieve data without caching
            const anticipoFatture = await getData(defaultQuery);
            res.status(200).json(anticipoFatture);
        }
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ Error: err });
    }
});


router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    const getData = () => {
      return AnticipoFatture.find({
        identifyUser: id,
      });
    };

    if (redisClient == undefined || redisDisabled) {
      const eventi = await getData();
      res.status(200).json(eventi);
      return;
    }

    const searchTerm = `anticipoFatture${id}`;
    redisClient.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data) {
        console.log(`${searchTerm}: ${data}`);
        res.status(200).send(JSON.parse(data));
      } else {
        const anticipoFatture = await getData();
        redisClient.setex(
          searchTerm,
          redisTimeCache,
          JSON.stringify(anticipoFatture)
        );
        res.status(200).json(anticipoFatture);
      }
    });

    // const anticipoFatture = await anticipoFatture.find();
    // res.status(200).json(anticipoFatture);
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).json({ Error: err });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  console.error("AnticipoFatture get/:id: ", id);
  try {
    const { id } = req.params;
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    const getData = () => {
      return AnticipoFatture.findById(id);
    };

    if (redisClient == undefined || redisDisabled) {
      const eventi = await getData();
      res.status(200).json(eventi);
      return;
    }

    const searchTerm = `anticipoFattureBY${id}`;
    redisClient.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data) {
        res.status(200).send(JSON.parse(data));
      } else {
        const anticipoFatture = await getData();
        redisClient.setex(
          searchTerm,
          redisTimeCache,
          JSON.stringify(anticipoFatture)
        );
        res.status(200).json(anticipoFatture);
      }
    });
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

router.post("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const anticipoFatture = new AnticipoFatture({
      identifyUser: id,
      filename: req.body.filename,
      dateupload: Date.now(),
      note: req.body.note,
    });

    const result = await anticipoFatture.save();

    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      redisClient.del(`anticipoFatture${id}`);
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
    const anticipoFatture = await AnticipoFatture.updateOne(
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
      redisClient.del(`anticipoFattureBY${id}`);
    }

    res.status(200);
    res.json(anticipoFatture);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const anticipoFatture = await AnticipoFatture.remove({ _id: id });

    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      redisClient.del(`anticipoFattureBY${id}`);
      redisClient.del(`ANTICIPOFATTUREALL`);
    }

    res.status(200);
    res.json(anticipoFatture);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

module.exports = router;
