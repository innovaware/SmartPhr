const express = require("express");
const router = express.Router();
const Farmaci = require("../models/farmaci");
const AttivitaFarmaciPresidi = require("../models/attivitaFarmaciPresidi");
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;


router.get("/", async (req, res) => {
    try {
        const getData = () => {
            return Farmaci.find({ $or: [{ "paziente": null }, { "paziente": "" }] });
        };

        const farmaci = await getData();
        res.status(200).json(farmaci);

    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ "Error": err });
    }
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const farmaci = await Farmaci.findById(id);
        res.status(200).json(farmaci);
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ "Error": err });
    }
});



router.get("/paziente/:id", async (req, res) => {
    const { id } = req.params;
    try {
        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        const getData = () => {
            return Farmaci.find({
                paziente: id,
            });
        };

        if (redisClient == undefined || redisDisabled) {
            const farmaci = await getData();
            res.status(200).json(farmaci);
            return;
        }

        const searchTerm = `FARMACIBY${id}`;
        redisClient.get(searchTerm, async (err, data) => {
            if (err) throw err;

            if (data) {
                res.status(200).send(JSON.parse(data));
            } else {
                const farmaci = await getData();

                redisClient.setex(searchTerm, redisTimeCache, JSON.stringify(farmaci));
                res.status(200).json(farmaci);
            }
        });
    } catch (err) {
        res.status(500).json({ "Error": err });
    }
});

router.post("/", async (req, res) => {
    try {
        const farmaci = new Farmaci({
            nome: req.body.nome,
            rif_id: req.body.rif_id,
            descrizione: req.body.descrizione,
            formulazione: req.body.formulazione,
            lotto: req.body.lotto,
            scadenza: req.body.scadenza,
            classe: req.body.classe,
            formato: req.body.formato,
            dose: req.body.dose,
            qty: req.body.qty,
            qtyTot: req.body.qtyTot,
            quantitaDisponibile: req.body.quantitaDisponibile,
            quantitaOccupata: 0,
            note: req.body.note,
            giacenza: req.body.giacenza,
            codice_interno: req.body.codice_interno,
        });


        const result = await farmaci.save();

        /*if(req.body._id != "" && req.body._id != null){
          console.log('req.body._id: ' + req.body._id);
          const getData = () => {
            return Farmaci.findById(req.body._id);
          };
          const farmaco = await getData();
          console.log('farmaco.qty: ' + farmaco.qty);
          const farmaci = await Farmaci.updateOne(
            { _id: req.body._id },
            {
              $set: {
                qty: farmaco.qty != null ?  farmaco.qty - req.body.qty : null,
                giacenza : farmaco.giacenza != null ? farmaco.giacenza - req.body.giacenza : null,
              },
            }
            );
          }*/


        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        if (redisClient != undefined && !redisDisabled) {
            const searchTerm = `FARMACIALL`;
            redisClient.del(searchTerm);
        }

        res.status(200);
        res.json(result);

    } catch (err) {
        res.status(500).json({ error: err })
    }
});

router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;


        const presidi = await Farmaci.updateOne(
            { _id: id },
            {
                $set: req.body,
            }
        );



        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        if (redisClient != undefined && !redisDisabled) {
            const searchTerm = `FARMACIBY${id}`;
            redisClient.del(searchTerm);
        }

        res.status(200);
        res.json(presidi);

    } catch (err) {
        res.status(500).json({ error: err })
    }
});


module.exports = router;
