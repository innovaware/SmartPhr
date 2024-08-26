const express = require("express");
const router = express.Router();
const Attivita = require("../models/attivita");
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;

router.get("/", async (req, res) => {
    try {
        // Retrieve the Attivita data from MongoDB
        const getData = () => {
            return Attivita.find();
        };

        // Fetch the data
        const attivita = await getData();

        // Return the data as JSON response
        res.status(200).json(attivita);
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ Error: err });
    }
});

//LISTA ATTIVITA PAZIENTE
// http://[HOST]:[PORT]/api/attivita/[ID_PAZIENTE]
router.get("/paziente/:id", async (req, res) => {
    const { id } = req.params;
    try {
        var start = new Date();
        start.setHours(0, 0, 0, 0);

        var end = new Date();
        end.setHours(23, 59, 59, 999);

        console.log('PAZIENTE: ' + id);
        console.log('start: ' + start);
        console.log('end: ' + end);

        const getData = () => {
            return Attivita.find({
                paziente: id,
                data: { $gte: start, $lt: end }
            });
        };

        // Fetch the data
        const attivita = await getData();

        // Return the data as JSON response
        res.status(200).json(attivita);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});




// http://[HOST]:[PORT]/api/cambiturno (POST)
// INSERT permessi su DB
router.post("/", async (req, res) => {
  try {
    const attivita = new Attivita({
        operator: req.body.operator,
        operatorName: req.body.operatorName,
        paziente: req.body.paziente,
        pazienteName: req.body.pazienteName,
        data: req.body.data,
        turno: req.body.turno,
        //description: req.body.description,
        //completato: req.body.completato,
        descrizione: req.body.descrizione,
        note: req.body.note,
        letto: req.body.letto,
        diuresi: req.body.diuresi,
        evacuazione: req.body.evacuazione,
        igiene: req.body.igiene,
        doccia: req.body.doccia,
        barba: req.body.barba,
        tagliocapelli: req.body.tagliocapelli,
        tagliounghie: req.body.tagliounghie,
        lenzuola: req.body.lenzuola

    });

    // Salva i dati sul mongodb
    const result = await attivita.save();

    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      redisClient.del(`ATTIVITAALL`);
    }

    res.status(200);
    res.json(result);
  } catch (err) {
    res.status(500);
    res.json({ Error: err });
  }
});


module.exports = router;
