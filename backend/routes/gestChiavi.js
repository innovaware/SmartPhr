const express = require("express");
const router = express.Router();
const RecordChiavi = require("../models/gestChiavi");
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;
const Log = require("../models/log");
const Dipendenti = require("../models/dipendenti");

router.get("/", async (req, res) => {
    try {

        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        const getData = () => {
            return RecordChiavi.find({});
        };

        if (redisClient == undefined || redisDisabled) {
            const chiavi = await getData();
            res.status(200).json(chiavi);
            return;
        }

        const searchTerm = `GETALL CHIAVI`;
        redisClient.get(searchTerm, async (err, asps) => {
            if (err) throw err;

            if (asps) {
                res.status(200).send(JSON.parse(asps));
            } else {
                const chiavi = await getData();
                redisClient.setex(
                    searchTerm,
                    redisTimeCache,
                    JSON.stringify(chiavi)
                );
                res.status(200).json(chiavi);
            }
        });
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ Error: err });
    }
});



router.post("/", async (req, res) => {
    try {
        const { id } = req.params;
        const rec = new RecordChiavi({
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

        const user = res.locals.auth;

        const getDipendente = () => {
            return Dipendenti.findById(user.dipendenteID);
        };

        const dipendenti = await getDipendente();

        const log = new Log({
            data: new Date(),
            operatore: dipendenti.nome + " " + dipendenti.cognome,
            operatoreID: user.dipendenteID,
            className: "GestioneChiavi",
            operazione: "Inserimento gestione chiavi ",
        });
        console.log("log: ", log);
        const resultLog = await log.save();

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
        const rec = await RecordChiavi.updateOne(
            { _id: id },
            {
                $set: {
                    dataRiconsegna: Date.now(),
                    operatorRiconsegna: req.body.operatorRiconsegna,
                    operatorRiconsegnaName: req.body.operatorRiconsegnaName,
                },
            }
        );

        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        if (redisClient != undefined && !redisDisabled) {
            redisClient.del(`CHIAVEBY${id}`);
        }

        const user = res.locals.auth;

        const getDipendente = () => {
            return Dipendenti.findById(user.dipendenteID);
        };

        const dipendenti = await getDipendente();

        const log = new Log({
            data: new Date(),
            operatore: dipendenti.nome + " " + dipendenti.cognome,
            operatoreID: user.dipendenteID,
            className: "GestioneChiavi",
            operazione: "Modifica gestione chiavi ",
        });
        console.log("log: ", log);
        const resultLog = await log.save();

        res.status(200);
        res.json(rec);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});




module.exports = router;
