const express = require("express");
const router = express.Router();
const Bonifici = require("../models/bonifici");
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;

async function get(req, res) {
  try {
    const { id } = req.params;
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    const getData = () => {
      return Bonifici.find({
        identifyUser: id,
      });
    };

    if (redisClient == undefined || redisDisabled) {
      const bonifici = await getData();
      res.status(200).json(bonifici);
      return;
    }

    const searchTerm = `bonifici${id}`;
    redisClient.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data) {
        //console.log(`${searchTerm}: ${data}`);
        res.status(200).send(JSON.parse(data));
      } else {
        const bonifici = await getData();
        redisClient.setex(searchTerm, redisTimeCache, JSON.stringify(bonifici));

        res.status(200).json(bonifici);
      }
    });
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).json({ Error: err });
  }
}

async function insertBonifico(req, res) {
  try {
    const { id } = req.params;
    const bonifici = new Bonifici({
      identifyUser: id,
      filename: req.body.filename,
      dateupload: Date.now(),
      note: req.body.note,
    });

    const result = await bonifici.save();

    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      redisClient.del(`bonifici${id}`);
    }

    res.status(200);
    res.json(result);
  } catch (err) {
    res.status(500);
    res.json({ Error: err });
  }
}

async function modifyBonifico(req, res) {
  try {
    const { id } = req.params;
    const bonifici = await Bonifici.updateOne(
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
      redisClient.del(`bonificiBY${id}`);
    }

    res.status(200);
    res.json(bonifici);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
}

async function deleteBonifico(req, res) {
  try {
    const { id } = req.params;

    const bonifici_item = await Bonifici.findById(id);
    const identifyUser = bonifici_item.identifyUser;

    const bonifici = await Bonifici.remove({ _id: id });

    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      redisClient.del(`bonificiBY${id}`);
      redisClient.del(`bonifici${identifyUser}`);
    }

    res.status(200);
    res.json(bonifici);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
}

router.get("/:id", get);
router.post("/:id", insertBonifico);
router.put("/:id", modifyBonifico);
router.delete("/:id", deleteBonifico);

module.exports = router;
