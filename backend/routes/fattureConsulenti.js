const express = require("express");
const router = express.Router();
const Fatture = require("../models/fatture");
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;

router.get("/", async (req, res) => {
  try {
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    const getData = () => {
      return Fatture.aggregate([
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
              from: "consulenti",
              foreignField: "_id",
              as: "fromConsulenti",
            },
          },
          {
            $replaceRoot: {
              newRoot: {
                $mergeObjects: [
                  { $arrayElemAt: ["$fromConsulenti", 0] },
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
              fromConsulenti: 0,
            },
          },
        ]);
;
    };

    if (redisClient == undefined || redisDisabled) {
      const eventi = await getData();
      res.status(200).json(eventi);
      return;
    }

    const searchTerm = `FATTURECONSULENTIALL`;

    redisClient.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data) {
        res.status(200).send(JSON.parse(data));
      } else {
        const fattureConsulenti = await getData();
        redisClient.setex(
          searchTerm,
          redisTimeCache,
          JSON.stringify(fattureConsulenti)
        );
        res.status(200).json(fattureConsulenti);
      }
    });
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

module.exports = router;
