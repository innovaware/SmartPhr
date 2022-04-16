const express = require("express");
const Camere = require("../models/camere");
const registroSanificazione = require("../models/registroSanificazione");

const router = express.Router();
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;

router.get("/piano/:p", async (req, res) => {
  const { p } = req.params;
  try {
    const getData = () => {
      const query = {piano: p}
      // console.log("Query by piano: ", query);
      return Camere.find(query);
    };

    const camere = await getData();
    res.status(200).json(camere);
    return;
  
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).json({ Error: err });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const getData = () => {
      return Camere.findById(id);
    };

    const camere = await getData();
    res.status(200).json(camere);
  
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const camera = await Camere.updateOne(
      { _id: id },
      {
        $set: {
          camera: req.body.camera,
          piano: req.body.piano,
          geometry: req.body.geometry,
          forPatient: req.body.forPatient,
          order: req.body.order,
          numPostiLiberi: req.body.numPostiLiberi,
          numMaxPosti: req.body.numMaxPosti,
          sanificata: req.body.sanificata,
          dataSanificazione: req.body.dataSanificazione,
          firmaSanificazione: req.body.firmaSanificazione,

          armadioCheck: req.body.armadioCheck,
          dataArmadioCheck: req.body.dataArmadioCheck,
          firmaArmadio: req.body.firmaArmadio,
        },
      }
    );

    //console.log("Update Camera req.body:", req.body);
    // console.log("Update Camera:", camera);
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      const searchTerm = "CAMEREALL*";
      redisClient.del(searchTerm);
    }
    

    res.status(200);
    res.json(camera);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

router.post("/", async (req, res) => {
  try {
    const camera = new Camere({
      camera: req.body.camera,
      piano: req.body.piano,
      geometry: req.body.geometry,
      forPatient: req.body.forPatient,
      order: req.body.order,
      numPostiLiberi: req.body.numPostiLiberi,
      numMaxPosti: req.body.numPostiLiberi,
      sanificata: req.body.sanificata,
      dataSanificazione: req.body.dataSanificazione,
      firmaSanificazione: req.body.firmaSanificazione,

      armadioCheck: req.body.armadioCheck,
      dataArmadioCheck: req.body.dataArmadioCheck,
      firmaArmadio: req.body.firmaArmadio,
    });

    // Salva i dati sul mongodb
    const result = await camera.save();

    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      redisClient.del(`CAMERE*`);
    }

    res.status(200);
    res.json(result);
  } catch (err) {
    res.status(500);
    res.json({ Error: err });
  }
});


router.put("/sanifica/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Sanificazione CAMERA", id);
    const camera = await Camere.updateOne(
      { _id: id },
      {
        $set: {
          camera: req.body.camera,
          piano: req.body.piano,
          geometry: req.body.geometry,
          forPatient: req.body.forPatient,
          order: req.body.order,
          numPostiLiberi: req.body.numPostiLiberi,
          numMaxPosti: req.body.numMaxPosti,

          sanificata: req.body.sanificata,
          dataSanificazione: req.body.dataSanificazione,
          firmaSanificazione: req.body.firmaSanificazione,

          armadioCheck: req.body.armadioCheck,
          dataArmadioCheck: req.body.dataArmadioCheck,
          firmaArmadio: req.body.firmaArmadio
        },
      }
    );

    new registroSanificazione({
      cameraId: id,
      stato: req.body.sanificata,
      data: req.body.dataSanificazione,
      note: req.body.note,
      firma: req.body.firmaSanificazione
    }).save();

    //console.log("Update Camera req.body:", req.body);
    // console.log("Update Camera:", camera);
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      const searchTerm = "CAMEREALL*";
      redisClient.del(searchTerm);
    }
    

    res.status(200);
    res.json(camera);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const camera = await Camere.remove({ _id: id });

    if (redisClient != undefined && !redisDisabled) {
      redisClient.del(`CAMERE*`);
    }

    res.status(200);
    res.json(camera);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});
module.exports = router;
