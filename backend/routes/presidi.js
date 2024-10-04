const express = require("express");
const router = express.Router();
const Presidi = require("../models/presidi");
const AttivitaFarmaciPresidi = require("../models/attivitaFarmaciPresidi");
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;



router.get("/", async (req, res) => {
    try {
        const presidi = await Presidi.find({ $or: [{ "paziente": null }, { "paziente": "" }] });
        res.status(200).json(presidi);
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ "Error": err });
    }
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const presidio = await Presidi.findById(id);
        res.status(200).json(presidio);
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
            return Presidi.find({
                paziente: id,
            });
        };

        if (redisClient == undefined || redisDisabled) {
            const presidi = await getData();
            res.status(200).json(presidi);
            return;
        }

        const searchTerm = `PRESIDIBY${id}`;
        redisClient.get(searchTerm, async (err, data) => {
            if (err) throw err;

            if (data) {
                res.status(200).send(JSON.parse(data));
            } else {
                const presidi = await getData();

                redisClient.setex(searchTerm, redisTimeCache, JSON.stringify(presidi));
                res.status(200).json(presidi);
            }
        });
    } catch (err) {
        res.status(500).json({ "Error": err });
    }
});

router.post("/", async (req, res) => {
    try {
        const presidi = new Presidi({
            nome: req.body.nome,
            rif_id: req.body.rif_id,
            descrizione: req.body.descrizione,
            note: req.body.note,
            taglia: req.body.taglia,
            giacenza: req.body.giacenza,
            scadenza: req.body.scadenza,
            qty: req.body.qty,
            qtyTot: req.body.qtyTot,
            quantitaDisponibile: req.body.quantitaDisponibile,
            quantitaOccupata: req.body.quantitaOccupata,
            paziente: req.body.paziente,
            pazienteName: req.body.pazienteName,
        });

        const result = await presidi.save();


        if (req.body._id != "" && req.body._id != null) {
            console.log('req.body._id: ' + req.body._id);
            const getData = () => {
                return Presidi.findById(req.body._id);
            };
            const presidio = await getData();
            //console.log('farmaco.qty: ' + farmaco.qty);
            const presidi = await Presidi.updateOne(
                { _id: req.body._id },
                {
                    $set: {
                        qty: presidio.qty != null ? presidio.qty - req.body.qty : null,
                        giacenza: presidio.giacenza != null ? presidio.giacenza - req.body.giacenza : null,
                    },
                }
            );
        }



        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        if (redisClient != undefined && !redisDisabled) {
            const searchTerm = `PRESIDIALL`;
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
        console.log('PUT id: ' + id);


        const presidi = await Presidi.updateOne(
            { _id: id },
            {
                $set: req.body,
            }
        );



        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        if (redisClient != undefined && !redisDisabled) {
            const searchTerm = `PRESIDIBY${id}`;
            redisClient.del(searchTerm);
        }

        res.status(200);
        res.json(presidi);

    } catch (err) {
        res.status(500).json({ error: err })
    }
});

module.exports = router;
