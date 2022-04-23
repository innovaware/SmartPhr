const { ObjectId } = require("bson");
const express = require("express");
const router = express.Router();
const Armadio = require("../models/armadio");
const Camere = require("../models/camere");
const registroArmadi = require("../models/registroArmadi");
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;



router.get("/registro", async (req, res) => {
  try {
    const getData = () => {
      const query = [
        {
          '$lookup': {
            'from': 'user', 
            'localField': 'firma', 
            'foreignField': '_id', 
            'as': 'userInfo'
          }
        }, {
          '$lookup': {
            'from': 'camera', 
            'localField': 'cameraId', 
            'foreignField': '_id', 
            'as': 'cameraInfo'
          }
        }
      ]
      // console.log("Query by piano: ", query);
      return registroArmadi.aggregate(query);
    };

    const registro = await getData();
    res.status(200).json(registro);
    return;
  
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).json({ Error: err });
  }
});


router.get("/", async (req, res) => {
  try {
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");


    const getData = () => {
      return Armadio.find();
    };

    if (redisClient == undefined || redisDisabled) {
      const armadio = await getData();
      res.status(200).json(armadio);
      return;
    }

    const searchTerm = `ARMADIOALL`;
    // Ricerca su Redis Cache
    redisClient.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data) {
        // Dato trovato in cache - ritorna il json
        res.status(200).send(JSON.parse(data));
      } else {
        // Recupero informazioni dal mongodb
        const armadio = await getData();

        // Aggiorno la cache con i dati recuperati da mongodb
        redisClient.setex(searchTerm, redisTimeCache, JSON.stringify(armadio));

        // Ritorna il json
        res.status(200).json(armadio);
      }
    });
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).json({ Error: err });
  }
});


router.get("/camera/:id", async (req, res) => {
  const { id } = req.params;
  let dateRif = req.query.date;

  try {
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    //new Armadio({
    //  idCamera: new ObjectId("6233776e7ec5d255b8cb1919"),
    //  contenuto: [
    //    {
    //      idPaziente: new ObjectId("6172d8631340fec684deea28"),
    //      items: [
    //        {
    //          nome: "Calzini",
    //          quantita: 1,
    //          note: "Calzini di notte",
    //        }
    //      ]
    //    },
    //    {
    //      idPaziente: new ObjectId("61815ef594bb265624eddb78"),
    //      items: [
    //        {
    //          nome: "Pantaloni",
    //          quantita: 1,
    //          note: "Pantaloni neri",
    //        }
    //      ]
    //    }
    //  ],
    //  lastChecked: {
    //    idUser: new ObjectId("62262a3e4a682930a8f3ee4e"),
    //    data: new Date(),
    //  }
    //}).save()
    //console.log("Save Armadio");

    const getData = () => {
      const query = [
        {
          '$match': {
            'idCamera': ObjectId(id),
            'dateStartRif': {$lte: new Date(dateRif.toString())},
            'dateEndRif': {$gte: new Date(dateRif.toString())}
          }
        }, {
          '$lookup': {
            'from': 'pazienti', 
            'localField': 'contenuto.idPaziente', 
            'foreignField': '_id', 
            'as': 'pazienti'
          }
        }
      ];

      // console.log("Armadi query:", query);
      // console.log("Armadi dateRif:", dateRif);
      return Armadio.aggregate(query);
    };

    const armadio = await getData();
      res.status(200).json(armadio);
      return;

    if (redisClient == undefined || redisDisabled) {
      const armadio = await getData();
      res.status(200).json(armadio);
      return;
    }

    const searchTerm = `ARMADIO${id}`;
    redisClient.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data) {
        res.status(200).send(JSON.parse(data));
      } else {
        const armadio = await getData();

        redisClient.setex(searchTerm, redisTimeCache, JSON.stringify(armadio));
        res.status(200).json(armadio);
      }
    });
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});


router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    const getData = () => {
      return Armadio.findById(id);
    };

    if (redisClient == undefined || redisDisabled) {
      const armadio = await getData();
      res.status(200).json(armadio);
      return;
    }

    const searchTerm = `ARMADIO${id}`;
    redisClient.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data) {
        res.status(200).send(JSON.parse(data));
      } else {
        const armadio = await getData();

        redisClient.setex(searchTerm, redisTimeCache, JSON.stringify(armadio));
        res.status(200).json(armadio);
      }
    });
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});


router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;   
    
    const armadio = await Armadio.updateOne(
      { _id: id },
      {
        $set: req.body.armadio,
      }
    );

    // const idCamera = req.body.armadio.idCamera;
    var checked = 0;
    switch(req.body.armadio.rateVerifica) {
      case 0: 
        checked = 0;
        break;
      case 100: 
        checked = 2;
        break;
      default:
        checked = 1;
    } 

    await Camere.updateOne(
      { _id: req.body.armadio.idCamera },
      {
        $set: {
          armadioCheck: checked,
          dataArmadioCheck: req.body.armadio.lastChecked.data,
          firmaArmadio: req.body.armadio.lastChecked.idUser,
        },
      }
    );

    const registro = new registroArmadi({
      cameraId: req.body.armadio.idCamera,
      stato: checked,
      data: req.body.armadio.lastChecked.data,
      note: req.body.note,
      firma: req.body.armadio.lastChecked.idUser
    });

    const result = await registro.save();
  

    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      const searchTerm = `ARMADIO${id}`;
      redisClient.del(searchTerm);
    }

    res.status(200);
    res.json(armadio);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});


router.post("/", async (req, res) => {
  try {
    const armadio = new Armadio(req.body.armadio);

    const resultArmadio = await armadio.save();
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    const registro = new registroArmadi({
      cameraId: req.body.armadio.idCamera,
      stato: false,
      data: new Date(),
      note: req.body.note,
      firma: req.body.armadio.lastChecked.idUser
    });

    const resultRegistro = await registro.save();

    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    const searchTerm = "ARMADIOALL";
    if (redisClient != undefined && !redisDisabled) {
      redisClient.del(searchTerm);
    }

    res.status(200);
    res.json(armadio);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

module.exports = router;
