const express = require("express");
const router = express.Router();
const DiarioAssSociale = require("../models/diarioAssSociale");
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;
const Log = require("../models/log");
const Dipendenti = require("../models/dipendenti");

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const getData = () => {
            return DiarioAssSociale.find({
                user: id,
            });
        };

        const eventi = await getData();
        res.status(200).json(eventi);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});


router.post("/", async (req, res) => {
    try {
        const diario = new DiarioAssSociale({
            data: req.body.data,
            contenuto: req.body.contenuto,
            firma: req.body.firma,
            user: req.body.user,
        });

        const result = await diario.save();

        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        if (redisClient != undefined && !redisDisabled) {
            redisClient.del(`DIARIOASSSOCIALE*`);
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
            className: "DiarioAssSociale",
            operazione: "Inserimento Diario Sociale",
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
        const diario = await DiarioAssSociale.updateOne(
            { _id: id },
            {
                $set: {
                    data: req.body.data,
                    contenuto: req.body.contenuto,
                    firma: req.body.firma,
                },
            }
        );

        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        if (redisClient != undefined && !redisDisabled) {
            redisClient.del(`DIARIOASSSOCIALEBY${id}`);
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
            className: "DiarioAssSociale",
            operazione: "Modifica Diario Sociale",
        });
        console.log("log: ", log);
        const resultLog = await log.save();

        res.status(200);
        res.json(diario);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

module.exports = router;
