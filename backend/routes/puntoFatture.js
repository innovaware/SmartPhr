const express = require("express");
const router = express.Router();
const PuntoFatture = require("../models/puntoFatture");
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;

router.get("/", async (req, res) => {
  try {
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    const getData = (query) => {
      return PuntoFatture.find(query);
    };

    if (redisClient == undefined || redisDisabled) {
      const query = {
        $or: [{ cancellato: { $exists: false } }, { cancellato: false }],
      };
      const eventi = await getData(query);
      res.status(200).json(eventi);
      return;
    }

    const searchTerm = `PUNTOFATTUREALL`;
    const showOnlyCancellati = req.query.show == "deleted";
    const showAll = req.query.show == "all";

    if (showOnlyCancellati || showAll) {
      console.log("Show all or deleted");
      let query = {};
      if (showOnlyCancellati) {
        query = { cancellato: true };
      }
      const puntoFatture = await getData(query);
      res.status(200).json(puntoFatture);
    } else {
      redisClient.get(searchTerm, async (err, data) => {
        if (err) throw err;

        if (data) {
          res.status(200).send(JSON.parse(data));
        } else {
          const query = {
            $or: [{ cancellato: { $exists: false } }, { cancellato: false }],
          };
          const puntoFatture = await getData(query);

          res.status(200).json(puntoFatture);
          redisClient.setex(
            searchTerm,
            redisTimeCache,
            JSON.stringify(puntoFatture)
          );
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

    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    const getData = () => {
      return PuntoFatture.find({
        identifyUser: id,
      });
    };

    if (redisClient == undefined || redisDisabled) {
      const eventi = await getData();
      res.status(200).json(eventi);
      return;
    }

    const searchTerm = `PUNTOFATTURE${id}`;
    redisClient.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data) {
        res.status(200).send(JSON.parse(data));
      } else {
        const puntoFatture = await getData();
        redisClient.setex(
          searchTerm,
          redisTimeCache,
          JSON.stringify(puntoFatture)
        );
        res.status(200).json(puntoFatture);
      }
    });

    // const puntoFatture = await puntoFatture.find();
    // res.status(200).json(puntoFatture);
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).json({ Error: err });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    const getData = () => {
      return PuntoFatture.findById(id);
    };

    if (redisClient == undefined || redisDisabled) {
      const eventi = await getData();
      res.status(200).json(eventi);
      return;
    }

    const searchTerm = `PUNTOFATTUREBY${id}`;
    redisClient.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data) {
        res.status(200).send(JSON.parse(data));
      } else {
        const puntoFatture = await getData();
        redisClient.setex(
          searchTerm,
          redisTimeCache,
          JSON.stringify(puntoFatture)
        );
        res.status(200).json(puntoFatture);
      }
    });
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

router.post("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const puntoFatture = new PuntoFatture({
      identifyUser: id,
      filename: req.body.filename,
      dateupload: Date.now(),
      note: req.body.note,
    });

    const result = await puntoFatture.save();

    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      redisClient.del(`PUNTOFATTURE${id}`);
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
    const puntoFatture = await PuntoFatture.updateOne(
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
      redisClient.del(`PUNTOFATTUREBY${id}`);
    }

    res.status(200);
    res.json(puntoFatture);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const item = await PuntoFatture.findById(id);
    const identifyUser = item.identifyUser;
    const puntoFatture = await PuntoFatture.remove({ _id: id });

    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      redisClient.del(`PUNTOFATTURE*`);
    }

    res.status(200);
    res.json(puntoFatture);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

module.exports = router;
