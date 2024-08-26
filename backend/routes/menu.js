const { ObjectId } = require("bson");
const express = require("express");
const router = express.Router();
const Menu = require("../models/menu");
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;

router.get("/", async (req, res) => {
    try {
        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");
        const mansioneRole = res.locals.auth.role;

        const getData = () => {
            const query = {
                roles: {
                    $all: [ObjectId(mansioneRole)]
                }
            };

            console.log(query);
            // { roles: { $all: [ObjectId('620d1dbd01df09c08ccd9822')] } }
            return Menu.find(query);
        };

        const eventi = await getData();
        res.status(200).json(eventi);
        return;

    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ Error: err });
    }
});


router.get("/access", async (req, res) => {
    try {
        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        const getData = () => {
            return Menu.find();
        };

        const eventi = await getData();
        res.status(200).json(eventi);
        return;

    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ Error: err });
    }
});


router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    if (id == undefined || id === "undefined") {
      console.log("Error id is not defined ", id);
      res.status(404).json({ Error: "Id not defined" });
      return;
    }

    if (data == undefined || data === "undefined") {
      console.log("Error data is not defined ", id);
      res.status(404).json({ Error: "Data not defined" });
      return;
    }

    const result = await Menu.updateOne(
      { _id: id },
      {
        $set: data,
      },
      { upsert: true }
    );

    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");
    if (redisClient != undefined && !redisDisabled) {
      redisClient.del(`MENU*`);
    }

    res.status(200);
    res.json(result);
  } catch (err) {
    res.status(500);
    res.json({ Error: err });
  }
});
module.exports = router;
