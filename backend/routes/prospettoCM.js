const express = require("express");
const router = express.Router();
const ProspettoCM = require("../models/prospettoCM");
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;

router.get("/", async (req, res) => {
  try {
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    const getData = (query) => {
      return ProspettoCM.find(query);
    };

    if (redisClient == undefined || redisDisabled) {
      const query = {
        $or: [{ cancellato: { $exists: false } }, { cancellato: false }],
      };
      const eventi = await getData(query);
      res.status(200).json(eventi);
      return;
    }

    const searchTerm = `PROSPETTOCMALL`;
    const showOnlyCancellati = req.query.show == "deleted";
    const showAll = req.query.show == "all";

    if (showOnlyCancellati || showAll) {
      console.log("Show all or deleted");
      let query = {};
      if (showOnlyCancellati) {
        query = { cancellato: true };
      }
      const prospettoCM = await getData(query);
      res.status(200).json(prospettoCM);
    } else {
      redisClient.get(searchTerm, async (err, data) => {
        if (err) throw err;

        if (data) {
          res.status(200).send(JSON.parse(data));
        } else {
          const query = {
            $or: [{ cancellato: { $exists: false } }, { cancellato: false }],
          };
          const prospettoCM = await getData(query);

          res.status(200).json(prospettoCM);
          redisClient.setex(searchTerm, redisTimeCache, JSON.stringify(prospettoCM));
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
      return ProspettoCM.find({
        identifyUser: id,
      });
    };

    if (redisClient == undefined || redisDisabled) {
      const eventi = await getData();
      res.status(200).json(eventi);
      return;
    }

    const searchTerm = `PROSPETTOCM${id}`;
    redisClient.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data) {
        console.log(`${searchTerm}: ${data}`);
        res.status(200).send(JSON.parse(data));
      } else {
        const prospettoCM = await getData();
        redisClient.setex(searchTerm, redisTimeCache, JSON.stringify(prospettoCM));
        res.status(200).json(prospettoCM);
      }
    });
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).json({ Error: err });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  console.error("ProspettoCM get/:id: ", id);
  try {
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    const getData = () => {
      return ProspettoCM.findById(id);
    };

    if (redisClient == undefined || redisDisabled) {
      const eventi = await getData();
      res.status(200).json(eventi);
      return;
    }

    const searchTerm = `PROSPETTOCMBY${id}`;
    redisClient.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data) {
        res.status(200).send(JSON.parse(data));
      } else {
        const prospettoCM = await getData();
        redisClient.setex(searchTerm, redisTimeCache, JSON.stringify(prospettoCM));
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

    const result = await prospettoCM.save();

    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      redisClient.del(`PROSPETTOCM${id}`);
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

    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      redisClient.del(`PROSPETTOCMBY${id}`);
    }

    res.status(200);
    res.json(prospettoCM);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const prospettoCM = await ProspettoCM.remove({ _id: id });

    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      redisClient.del(`PROSPETTOCM*`);
    }

    res.status(200);
    res.json(prospettoCM);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

module.exports = router;
