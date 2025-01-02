const express = require("express");
const router = express.Router();
const VisiteSpecialistiche = require("../models/visiteSpecialistiche");
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;
const Log = require("../models/log");
const Dipendenti = require("../models/dipendenti");

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        const getData = () => {
            return VisiteSpecialistiche.find({
                user: id,
            });
        };

        if (redisClient == undefined || redisDisabled) {
            const eventi = await getData();
            res.status(200).json(eventi);
            return;
        }

        const searchTerm = `VISITEBY${id}`;
        redisClient.get(searchTerm, async (err, asps) => {
            if (err) throw err;

            if (asps) {
                res.status(200).send(JSON.parse(asps));
            } else {
                const visita = await getData();
                redisClient.setex(searchTerm, redisTimeCache, JSON.stringify(visita));
                res.status(200).json(visita);
            }
        });
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

router.post("/", async (req, res) => {
    try {
        const visita = new VisiteSpecialistiche({
            dataReq: req.body.dataReq,
            contenuto: req.body.contenuto,
            dataEsec: req.body.dataEsec,
            user: req.body.user,
        });

        const result = await visita.save();
        res.status(200);
        res.json(result);

        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        if (redisClient != undefined && !redisDisabled) {
            redisClient.del(`VISITA*`);
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
            className: "VisiteSpecialistiche",
            operazione: "Inserimento visita specialistica ",
        });
        console.log("log: ", log);
        const resultLog = await log.save();

    } catch (err) {
        res.status(500);
        res.json({ Error: err });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const visita = await VisiteSpecialistiche.updateOne(
            { _id: id },
            {
                $set: {
                    dataReq: req.body.dataReq,
                    contenuto: req.body.contenuto,
                    dataEsec: req.body.dataEsec,
                },
            }
        );

        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        if (redisClient != undefined && !redisDisabled) {
            redisClient.del(`VISITABY${id}`);
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
            className: "VisiteSpecialistiche",
            operazione: "Modifica visita specialistica ",
        });
        console.log("log: ", log);
        const resultLog = await log.save();

        res.status(200);
        res.json(visita);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

router.get("/", async (req, res) => {
    const { id } = req.params;
    try {
        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        const getData = () => {
            return VisiteSpecialistiche.find();
        };

        if (redisClient == undefined || redisDisabled) {
            const eventi = await getData();
            res.status(200).json(eventi);
            return;
        }

        const searchTerm = `VISITE${id}`;
        redisClient.get(searchTerm, async (err, asps) => {
            if (err) throw err;

            if (asps) {
                res.status(200).send(JSON.parse(asps));
            } else {
                const visita = await getData();
                redisClient.setex(searchTerm, redisTimeCache, JSON.stringify(visita));
                res.status(200).json(visita);
            }
        });
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

module.exports = router;
