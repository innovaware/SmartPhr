const express = require("express");
const router = express.Router();
const ControlliOSS = require("../models/controlliOSS");
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;


//ELEMENTI
router.get("/", async (req, res) => {
  try {
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    const getData = () => {
      return ControlliOSS.find();
    };

    if (redisClient == undefined || redisDisabled) {
      const controlliOSS = await getData();
      res.status(200).json(controlliOSS);
      return;
    }

    const searchTerm = `CONTROLLIOSSALL`;
    // Ricerca su Redis Cache
    redisClient.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data) {
        // Dato trovato in cache - ritorna il json
        res.status(200).send(JSON.parse(data));
      } else {
        // Recupero informazioni dal mongodb
        const controlliOSS = await getData();

        // Aggiorno la cache con i dati recuperati da mongodb
        redisClient.setex(searchTerm, redisTimeCache, JSON.stringify(controlliOSS));

        // Ritorna il json
        res.status(200).json(controlliOSS);
      }
    });
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).json({ Error: err });
  }
});

//LISTA CONTROLLIOSS PAZIENTE
// http://[HOST]:[PORT]/api/armadiocontrolli/[PAZIENTE]
router.get("/paziente/:id", async (req, res) => {
  const { id } = req.params;
  try {
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    const getData = () => {
      return ControlliOSS.find({ paziente: id });
    };

    if (redisClient == undefined || redisDisabled) {
      const controlliOSS = await getData();
      res.status(200).json(controlliOSS);
      return;
    }

    const searchTerm = `CONTROLLIOSSBYPAZIENTE-${id}`;
    redisClient.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data) {
        res.status(200).send(JSON.parse(data));
      } else {
        const controlliOSS = await getData();

        redisClient.setex(searchTerm, redisTimeCache, JSON.stringify(controlliOSS));
        res.status(200).json(controlliOSS);
      }
    });
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

// http://[HOST]:[PORT]/api/armadiocontrolli/[ID]
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    const getData = () => {
      return ControlliOSS.findById(id);
    };

    if (redisClient == undefined || redisDisabled) {
      const controlliOSS = await getData();
      res.status(200).json(controlliOSS);
      return;
    }

    const searchTerm = `CONTROLLIOSSBY${id}`;
    redisClient.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data) {
        res.status(200).send(JSON.parse(data));
      } else {
        const controlliOSS = await getData();

        redisClient.setex(searchTerm, redisTimeCache, JSON.stringify(controlliOSS));
        res.status(200).json(controlliOSS);
      }
    });
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});







// http://[HOST]:[PORT]/api/armadiocontrolli (POST)
// INSERT armadiocontrolli su DB
router.post("/", async (req, res) => {
  try {
    const controlliOSS = new ControlliOSS({
        operatorNamePrimavera: req.body.operatorNamePrimavera,
        operatorNameEstate: req.body.operatorNameEstate,
        operatorNameAutunno: req.body.operatorNameAutunno,
        operatorNameInverno: req.body.operatorNameInverno,
        
        operatorNameGennaio: req.body.operatorNameGennaio,
        operatorNameFebbraio: req.body.operatorNameFebbraio,
        operatorNameMarzo: req.body.operatorNameMarzo,
        operatorNameAprile: req.body.operatorNameAprile,
        operatorNameMaggio: req.body.operatorNameMaggio,
        operatorNameGiugno: req.body.operatorNameGiugno,
        operatorNameLuglio: req.body.operatorNameLuglio,
        operatorNameAgosto: req.body.operatorNameAgosto,
        operatorNameSettembre: req.body.operatorNameSettembre,
        operatorNameOttobre: req.body.operatorNameOttobre,
        operatorNameNovembre: req.body.operatorNameNovembre,
        operatorNameDicembre: req.body.operatorNameDicembre,


        primavera: req.body.primavera,
        estate: req.body.estate,
        autunno: req.body.autunno,
        inverno: req.body.inverno,

        gennaio: req.body.gennaio,
        febbraio: req.body.febbraio,
        marzo: req.body.marzo,
        aprile: req.body.aprile,
        maggio: req.body.maggio,
        giugno: req.body.giugno,
        luglio: req.body.luglio,
        agosto: req.body.v,
        settembre: req.body.settembre,
        ottobre: req.body.ottobre,
        novembre: req.body.novembre,
        dicembre: req.body.dicembre,


        paziente: req.body.paziente,
        pazienteName: req.body.pazienteName,
        anno: req.body.anno,
    });

    // Salva i dati sul mongodb
    const result = await controlliOSS.save();


    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      redisClient.del(`CONTROLLIOSSALL`);
    }

    res.status(200);
    res.json(result);
  } catch (err) {
    res.status(500);
    res.json({ Error: err });
  }
});

// http://[HOST]:[PORT]/api/armadiocontrolli/[ID]
// Modifica delle armadiocontrolli
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // Aggiorna il documento su mongodb
    const controlliOSS = await ControlliOSS.updateOne(
      { _id: id },
      {
        $set: {
            operatorNamePrimavera: req.body.operatorNamePrimavera,
        operatorNameEstate: req.body.operatorNameEstate,
        operatorNameAutunno: req.body.operatorNameAutunno,
        operatorNameInverno: req.body.operatorNameInverno,
        
        operatorNameGennaio: req.body.operatorNameGennaio,
        operatorNameFebbraio: req.body.operatorNameFebbraio,
        operatorNameMarzo: req.body.operatorNameMarzo,
        operatorNameAprile: req.body.operatorNameAprile,
        operatorNameMaggio: req.body.operatorNameMaggio,
        operatorNameGiugno: req.body.operatorNameGiugno,
        operatorNameLuglio: req.body.operatorNameLuglio,
        operatorNameAgosto: req.body.operatorNameAgosto,
        operatorNameSettembre: req.body.operatorNameSettembre,
        operatorNameOttobre: req.body.operatorNameOttobre,
        operatorNameNovembre: req.body.operatorNameNovembre,
        operatorNameDicembre: req.body.operatorNameDicembre,


        primavera: req.body.primavera,
        estate: req.body.estate,
        autunno: req.body.autunno,
        inverno: req.body.inverno,

        gennaio: req.body.gennaio,
        febbraio: req.body.febbraio,
        marzo: req.body.marzo,
        aprile: req.body.aprile,
        maggio: req.body.maggio,
        giugno: req.body.giugno,
        luglio: req.body.luglio,
        agosto: req.body.v,
        settembre: req.body.settembre,
        ottobre: req.body.ottobre,
        novembre: req.body.novembre,
        dicembre: req.body.dicembre,

        },
      }
    );


    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      redisClient.del(`CONTROLLIOSSBY${id}`);
    }

    res.status(200).json(controlliOSS);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

module.exports = router;
