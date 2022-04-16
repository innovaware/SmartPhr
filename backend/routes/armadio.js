const { ObjectId } = require("bson");
const express = require("express");
const router = express.Router();
const Armadio = require("../models/armadio");
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;


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
  try {
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    // new Armadio({
    //   idCamera: new ObjectId("62337ac07ec5d255b8cb19be"),
    //   indumento: {
    //     idPaziente: new ObjectId("6172d8631340fec684deea28"),
    //     nome: "Calzini",
    //     quantita: 1,
    //     note: "",
    //   },
    //   lastChecked: {
    //     idUser: new ObjectId("62262a3e4a682930a8f3ee4e"),
    //     data: new Date(),
    //   }
    // }).save()
    // console.log("Save Armadio");

    const getData = () => {
      const query = [
        {
          '$match': {
            'idCamera': ObjectId(id)
          }
        }, {
          '$lookup': {
            'from': 'pazienti', 
            'localField': 'indumento.idPaziente', 
            'foreignField': '_id', 
            'as': 'indumento.paziente'
          }
        }
      ];

      console.log("Armadi query:", query);
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


// router.post("/", async (req, res) => {
//   try {
//     const elementoArmadio = new ElementiArmadio({
//         paziente: req.body.paziente,
//         pazienteName: req.body.pazienteName,
//         data: req.body.data,
//         elemento: req.body.elemento,
//         note: req.body.note,
//         quantita: req.body.quantita
//     });

//     // Salva i dati sul mongodb
//     const result = await elementoArmadio.save();


//     const attivitaArmadio = new AttivitaArmadio({
//       operator: req.body.operator,
//       operatorName: req.body.operatorName,
//       paziente: req.body.paziente,
//       pazienteName: req.body.pazienteName,
//       data: req.body.data,
//       elemento: req.body.elemento,
//       note: req.body.note,
//       quantita: req.body.quantita
//   });

//   // Salva i dati sul mongodb
//   const resultAtt = await attivitaArmadio.save();



//     redisClient = req.app.get("redis");
//     redisDisabled = req.app.get("redisDisabled");

//     if (redisClient != undefined && !redisDisabled) {
//       redisClient.del(`ELEMENTIARMADIOALL`);
//     }

//     res.status(200);
//     res.json(result);
//   } catch (err) {
//     res.status(500);
//     res.json({ Error: err });
//   }
// });

// // http://[HOST]:[PORT]/api/cambiturno/[ID]
// // Modifica delle cambiturno
// router.put("/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     // Aggiorna il documento su mongodb
//     const cambiturno = await ElementiArmadio.updateOne(
//       { _id: id },
//       {
//         $set: {
//             paziente: req.body.paziente,
//             pazienteName: req.body.pazienteName,
//             data: req.body.data,
//             elemento: req.body.elemento,
//             note: req.body.note,
//             quantita: req.body.quantita
//         },
//       }
//     );


//     const attivitaArmadio = new AttivitaArmadio({
//       operator: req.body.operator,
//       operatorName: req.body.operatorName,
//       paziente: req.body.paziente,
//       pazienteName: req.body.pazienteName,
//       data: req.body.data,
//       elemento: req.body.elemento,
//       note: req.body.note,
//       quantita: req.body.quantita
//   });

//   // Salva i dati sul mongodb
//   const result = await attivitaArmadio.save();



//     redisClient = req.app.get("redis");
//     redisDisabled = req.app.get("redisDisabled");

//     if (redisClient != undefined && !redisDisabled) {
//       redisClient.del(`CAMBITURNOBY${id}`);
//     }

//     res.status(200).json(cambiturno);
//   } catch (err) {
//     res.status(500).json({ Error: err });
//   }
// });

module.exports = router;
