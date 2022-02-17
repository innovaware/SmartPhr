const express = require("express");
const router = express.Router();
const Bonifici = require("../models/bonifici");
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;

router.get("/", async (req, res) => {
  try {
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    const getData = () => {
      return Bonifici.aggregate([
        {
          $project: {
            identifyUserObj: { $toObjectId: "$identifyUser" },
            filename: 1,
            dateupload: 1,
            note: 1,
          },
        },
        {
          $lookup: {
            localField: "identifyUserObj",
            from: "fornitori",
            foreignField: "_id",
            as: "fromFornitori",
          },
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [
                { $arrayElemAt: ["$fromFornitori", 0] },
                "$$ROOT",
              ],
            },
          },
        },
        {
          $project: {
            dataNascita: 0,
            comuneNascita: 0,
            provinciaNascita: 0,
            indirizzoNascita: 0,
            indirizzoResidenza: 0,
            comuneResidenza: 0,
            provinciaResidenza: 0,
            mansione: 0,
            tipoContratto: 0,
            telefono: 0,
            email: 0,
            fromFornitori: 0,
          },
        },
      ]);
    };

    if (redisClient == undefined || redisDisabled) {
      const eventi = await getData();
      res.status(200).json(eventi);
      return;
    }

    const searchTerm = `BONIFICIFORNITORIALL`;

    redisClient.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data) {
        res.status(200).send(JSON.parse(data));
      } else {
        const bonificiFornitori = await getData();
        redisClient.setex(
          searchTerm,
          redisTimeCache,
          JSON.stringify(bonificiFornitori)
        );
        res.status(200).json(bonificiFornitori);
      }
    });
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

module.exports = router;
