const express = require("express");
const router = express.Router();
const Eventi = require("../models/eventi");
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;

router.get("/", async (req, res) => {
    try {

        const getData = () => {
            return Eventi.find();
        };
        
        const eventi = await getData();
        res.status(200).json(eventi);

    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ Error: err });
    }
});


router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const getData = () => {
            return Eventi.findById(id);
        };

        const eventi = await getData();
        res.status(200).json(eventi);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

router.get("/tipo/:tipo", async (req, res) => {
    const { tipo } = req.params;
    try {
        const eventi = await Eventi.find({ tipo: tipo });
        res.status(200).json(eventi);
    } catch (err) {
        console.error("Errore durante il recupero degli eventi:", err); // Log dell'errore
        res.status(500).json({ error: err.message || "Errore del server" }); // Risposta più chiara
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

    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    const getData = () => {
      return Eventi.findById(query);
    };

    if (redisClient == undefined || redisDisabled) {
      const eventi = await getData();
      res.status(200).json(eventi);
      return;
    }

    redisClient.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data) {
        //console.log(`Event Buffered - ${searchTerm}`);
        res.status(200).send(JSON.parse(data));
      } else {
        const eventi = await getData();

        client.setex(searchTerm, redisTimeCache, JSON.stringify(eventi));
        res.status(200).json(eventi);
      }
    });
  } catch (err) {
    res.status(500);
    res.json({ Error: err });
  }
});

router.get("/searchIntervaltype/:dataStart/:dataEnd/:type", async (req, res) => {
    const { dataStart, dataEnd, type } = req.params;

    if (!dataStart || !dataEnd) {
        return res.status(400).json({ Error: "dataStart or dataEnd not defined" });
    }
    console.log(type);
    if (!type) {
        return res.status(400).json({ Error: "type not defined" });
    }
    try {
        const yearStart = dataStart.substring(0, 4);
        const monthStart = dataStart.substring(4, 6);
        const dayStart = dataStart.substring(6, 8);

        const yearEnd = dataEnd.substring(0, 4);
        const monthEnd = dataEnd.substring(4, 6);
        const dayEnd = dataEnd.substring(6, 8);

        const query = {
            $and: [
                {
                    data: {
                        $gte: new Date(yearStart, monthStart - 1, dayStart, 0, 0, 0),
                        $lt: new Date(yearEnd, monthEnd - 1, dayEnd, 23, 59, 59),
                    },
                },
                {
                    tipo: type
                }
            ]
        };

        const eventi = await Eventi.find(query);
        console.log(eventi);
        res.status(200).json(eventi);

    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});
router.get("/searchInterval/:dataStart/:dataEnd", async (req, res) => {
    const { dataStart, dataEnd } = req.params;
    const { user } = req.query;

    if (!dataStart || !dataEnd) {
        return res.status(400).json({ Error: "dataStart or dataEnd not defined" });
    }

    if (!user) {
        return res.status(400).json({ Error: "user not defined" });
    }

    try {
        const yearStart = dataStart.substring(0, 4);
        const monthStart = dataStart.substring(4, 6);
        const dayStart = dataStart.substring(6, 8);

        const yearEnd = dataEnd.substring(0, 4);
        const monthEnd = dataEnd.substring(4, 6);
        const dayEnd = dataEnd.substring(6, 8);

        const query = {
            $and: [
                {
                    data: {
                        $gte: new Date(yearStart, monthStart - 1, dayStart, 0, 0, 0),
                        $lt: new Date(yearEnd, monthEnd - 1, dayEnd, 23, 59, 59),
                    },
                },
                {
                    $or: [
                        { utente: user },
                        { visibile: true }
                    ]
                }
            ]
        };

        const eventi = await Eventi.find(query);
        res.status(200).json(eventi);

    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});

router.post("/", async (req, res) => {
  try {
    const eventi = new Eventi({
      data: req.body.data,
      descrizione: req.body.descrizione,
      tipo: req.body.tipo,
        utente: req.body.utente,
        visibile: req.body.visibile,
        effettuato: false,
        dataCreazione: new Date(),
    });

    const result = await eventi.save();

    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      const searchTerm = `EVENTIALL`;
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
    const eventi = await Eventi.updateOne(
      { _id: id },
      {
        $set: {
          data: req.body.data,
          descrizione: req.body.descrizione,
          tipo: req.body.tipo,
              utente: req.body.utente,
              visibile: req.body.visibile,
              finito: req.body.finito,
              dataCompletato: new Date(),
        },
      }
    );

    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      const searchTerm = `EVENTIBY${id}`;
      redisClient.del(searchTerm);
    }

    res.status(200);
    res.json(eventi);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

module.exports = router;
