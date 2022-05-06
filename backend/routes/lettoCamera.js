const express = require("express");
const attivitaRifacimentoLetti = require("../models/attivitaRifacimentoLetti");
const router = express.Router();
const LettoCamera = require("../models/lettoCamera");
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;

router.get("/", async (req, res) => {
  try {

    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    const getData = () => {
      return LettoCamera.find({});
    };

    if (redisClient == undefined || redisDisabled) {
      const letti = await getData();
      res.status(200).json(letti);
      return;
    }

    const searchTerm = `GETALL Letti`;
    redisClient.get(searchTerm, async (err, asps) => {
      if (err) throw err;

      if (asps) {
        res.status(200).send(JSON.parse(asps));
      } else {
        const letti = await getData();
        redisClient.setex(
          searchTerm,
          redisTimeCache,
          JSON.stringify(letti)
        );
        res.status(200).json(letti);
      }
    });
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).json({ Error: err });
  }
});


router.get("/attivita", async (req, res) => {
  try {

    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    const getData = () => {
      return attivitaRifacimentoLetti.find({});
    };

    if (redisClient == undefined || redisDisabled) {
      const attivita = await getData();
      res.status(200).json(attivita);
      return;
    }

    const searchTerm = `GETALL attivitaRifacimentoLetti`;
    redisClient.get(searchTerm, async (err, asps) => {
      if (err) throw err;

      if (asps) {
        res.status(200).send(JSON.parse(asps));
      } else {
        const attivita = await getData();
        redisClient.setex(
          searchTerm,
          redisTimeCache,
          JSON.stringify(attivita)
        );
        res.status(200).json(attivita);
      }
    });
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).json({ Error: err });
  }
});



/*router.post("/", async (req, res) => {
  try {
    const { id } = req.params;
    const rec = new LettoCamera({
      dataPrelievo: Date.now(),
      operatorPrelievo: req.body.operatorPrelievo,
      operatorPrelievoName: req.body.operatorPrelievoName,
      chiave: req.body.chiave
    });

    const result = await rec.save();

    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      redisClient.del(`CHIAVE`);
    }

    res.status(200);
    res.json(result);
  } catch (err) {
    res.status(500);
    res.json({ Error: err });
  }
});
*/

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const getData = () => {
      return LettoCamera.findById(id);
    };
    const letto = await getData();


    const rec = await LettoCamera.updateOne(
      { _id: id },
      {
        $set: {
            camera:req.body.camera,
            lenzuola: req.body.lenzuola,
            lenzuola_lacerati: req.body.lenzuola_lacerati,

            traverse: req.body.traverse,
            traverse_lacerati: req.body.traverse_lacerati,
            cuscini: req.body.cuscini,
            cuscini_lacerati: req.body.cuscini_lacerati,
            coprimaterassi: req.body.coprimaterassi,
            coprimaterassi_lacerati: req.body.coprimaterassi_lacerati,
            copriletti: req.body.copriletti,
            copriletti_lacerati: req.body.copriletti_lacerati,
            coperte: req.body.coperte,
            coperte_lacerati: req.body.coperte_lacerati,
            federe: req.body.federe,
            federe_lacerati: req.body.federe_lacerati

        },
      }
    );
    console.log(' req.body.lenzuola: ' +  req.body.lenzuola);
    console.log('letto.lenzuola: ' + JSON.stringify(letto));

    const recAtt = new attivitaRifacimentoLetti({
      data: Date.now(),
      camera: req.body.camera,
      carico_lenzuola: req.body.lenzuola - letto.lenzuola,
      carico_lenzuola_lacerati: req.body.lenzuola_lacerati - letto.lenzuola_lacerati,
      carico_traverse: req.body.traverse - letto.traverse,
      carico_traverse_lacerati: req.body.traverse_lacerati - letto.traverse_lacerati,
      carico_cuscini: req.body.cuscini - letto.cuscini,
      carico_cuscini_lacerati: req.body.cuscini_lacerati - letto.cuscini_lacerati,
      carico_coprimaterassi: req.body.coprimaterassi - letto.coprimaterassi,
      carico_coprimaterassi_lacerati: req.body.coprimaterassi_lacerati - letto.coprimaterassi_lacerati,
      carico_copriletti: req.body.copriletti - letto.copriletti,

      carico_copriletti_lacerati: req.body.copriletti_lacerati - letto.copriletti_lacerati,
      carico_coperte: req.body.coperte - letto.coperte,
      carico_coperte_lacerati: req.body.coperte_lacerati - letto.coperte_lacerati,
      carico_federe: req.body.federe - letto.federe,
      carico_federe_lacerati: req.body.federe_lacerati - letto.federe_lacerati,
      isInternal: req.body.isInternal,
      operator: req.body.operator,
      operatorName: req.body.operatorName
    });

    const result = await recAtt.save();



    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      redisClient.del(`LETTOBY${id}`);
    }

    res.status(200);
    res.json(rec);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});




module.exports = router;
