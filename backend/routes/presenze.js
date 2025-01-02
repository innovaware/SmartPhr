const express = require("express");
var mongoose = require("mongoose");
const router = express.Router();
const Presenze = require("../models/presenze");
const Dipendenti = require("../models/dipendenti");
const Turnimensili = require("../models/turnimensili");
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;
const Log = require("../models/log");

router.get("/", async (req, res) => {
    try {
        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        const getData = () => {
            return Dipendenti.aggregate([
                {
                    $lookup: {
                        from: "presenze",
                        localField: "idUser",
                        foreignField: "user",
                        as: "presenze",
                    },
                },
                {
                    $unwind: {
                        path: "$codiceFiscale",
                    },
                },
            ]);
        };

        if (redisClient == undefined || redisDisabled) {
            const eventi = await getData();
            res.status(200).json(eventi);
            return;
        }

        const searchTerm = `PRESENZEALL`;
        // Ricerca su Redis Cache
        redisClient.get(searchTerm, async (err, data) => {
            if (err) throw err;

            if (data) {
                // Dato trovato in cache - ritorna il json
                res.status(200).send(JSON.parse(data));
            } else {
                // Recupero informazioni dal mongodb
                //const presenze = await Presenze.find();
                const presenze = await getData();

                // Aggiorno la cache con i dati recuperati da mongodb
                redisClient.setex(searchTerm, redisTimeCache, JSON.stringify(presenze));

                // Ritorna il json
                res.status(200).json(presenze);
            }
        });
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ Error: err });
    }
});

router.get("/dipendente/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const eventi = await Presenze.find({ user: id });
        res.status(200).json(eventi);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

// http://[HOST]:[PORT]/api/presenze/[ID]
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        const getData = () => {
            return Presenze.findById(id);
        };

        if (redisClient == undefined || redisDisabled) {
            const eventi = await getData();
            res.status(200).json(eventi);
            return;
        }
        const searchTerm = `PRESENZEBY${id}`;
        redisClient.get(searchTerm, async (err, data) => {
            if (err) throw err;

            if (data) {
                res.status(200).send(JSON.parse(data));
            } else {
                const presenze = await getData();

                redisClient.setex(searchTerm, redisTimeCache, JSON.stringify(presenze));
                res.status(200).json(presenze);
            }
        });
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

// http://[HOST]:[PORT]/api/presenze (POST)
router.post("/", async (req, res) => {
    try {
        const presenze = new Presenze({
            data: req.body.data,
            oraInizio: req.body.oraInizio,
            oraFine: "",
            turno: req.body.turno,
            mansione: req.body.mansione,
            user: req.body.user,
            note: ""
        });
        // Salva i dati sul mongodb
        const result = await presenze.save();

        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        if (redisClient != undefined && !redisDisabled) {
            redisClient.del(`PRESENZEALL`);
        }

        const usr = res.locals.auth;

        const getDipendente = () => {
            return Dipendenti.findById(usr.dipendenteID);
        };

        const dipendenti = await getDipendente();

        const log = new Log({
            data: new Date(),
            operatore: dipendenti.nome + " " + dipendenti.cognome,
            operatoreID: usr.dipendenteID,
            className: "Presenze",
            operazione: "Inserimento presenza in data: " + presenze.data,
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

// http://[HOST]:[PORT]/api/presenze/[ID]
// Modifica delle presenze
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        // Aggiorna il documento su mongodb
        const presenze = await Presenze.updateOne(
            { _id: id },
            {
                $set: {
                    oraFine: req.body.oraFine,
                    note: req.body.note
                },
            }
        );

        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        if (redisClient != undefined && !redisDisabled) {
            redisClient.del(`PRESENZEBY${id}`);
        }

        const usr = res.locals.auth;

        const getDipendente = () => {
            return Dipendenti.findById(usr.dipendenteID);
        };

        const dipendenti = await getDipendente();

        const log = new Log({
            data: new Date(),
            operatore: dipendenti.nome + " " + dipendenti.cognome,
            operatoreID: usr.dipendenteID,
            className: "Presenze",
            operazione: "Modifica presenza in data: " + presenze.data,
        });
        console.log("log: ", log);
        const resultLog = await log.save();


        res.status(200).json(presenze);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

module.exports = router;
