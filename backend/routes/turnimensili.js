const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Turnimensili = require("../models/turnimensili");
const Dipendenti = require("../models/dipendenti");
const Log = require("../models/log");
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;

router.get("/", async (req, res) => {
    try {
        const turni = await Turnimensili.find();
        res.status(200).json(turni);
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ Error: err });
    }
});


//LISTA TURNIMENSILI DIPENDENTE
// http://[HOST]:[PORT]/api/turnimensiliDipendente/[ID_DIPENDENTE]
router.get("/dipendente/:id", async (req, res) => {
    const { id } = req.params;
    try {
        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        const getData = () => {
            return Dipendenti.aggregate([
                { $match: { _id: mongoose.Types.ObjectId(id) } },
                {
                    $lookup: {
                        from: "turnimensili",
                        localField: "idUser",
                        foreignField: "user",
                        as: "turni",
                    },
                },
            ]);
        };

        if (redisClient == undefined || redisDisabled) {
            const eventi = await getData();
            res.status(200).json(eventi);
            return;
        }

        const searchTerm = `TURNIMENSILIBY${id}`;
        redisClient.get(searchTerm, async (err, data) => {
            if (err) throw err;

            if (data) {
                res.status(200).send(JSON.parse(data));
            } else {
                //const turnimensili = await Turnimensili.find({ user: id });
                const turnimensili = await getData();
                redisClient.setex(searchTerm, redisTimeCache, JSON.stringify(turnimensili));
                res.status(200).json(turnimensili);
            }
        });
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

// http://[HOST]:[PORT]/api/turnimensili/[ID]
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        const getData = () => {
            return Turnimensili.findById(id);
        };

        if (redisClient == undefined || redisDisabled) {
            const eventi = await getData();
            res.status(200).json(eventi);
            return;
        }

        const searchTerm = `TURNIMENSILIBY${id}`;
        redisClient.get(searchTerm, async (err, data) => {
            if (err) throw err;

            if (data) {
                res.status(200).send(JSON.parse(data));
            } else {
                const turnimensili = await getData();

                redisClient.setex(searchTerm, redisTimeCache, JSON.stringify(turnimensili));
                res.status(200).json(turnimensili);
            }
        });
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

///Ricerca turni per intervalli di date

router.get("/searchInterval/:dataStart/:dataEnd", async (req, res) => {
    const { dataStart, dataEnd } = req.params;

    try {
        const searchTerm = `TURNIMENSILISEARCH${dataStart}${dataEnd}`;

        if (dataStart == undefined || dataEnd == undefined) {
            res.status(400);
            res.json({ Error: "dataStart or dataEnd not defined" });
            return;
        }


        const yearStart = dataStart.substring(0, 4);
        const monthStart = dataStart.substring(4, 6);
        const dayStart = dataStart.substring(6, 8);

        const yearEnd = dataEnd.substring(0, 4);
        const monthEnd = dataEnd.substring(4, 6);
        const dayEnd = dataEnd.substring(6, 8);

        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        const query = {
            dataRifInizio: {
                $gte: new Date(yearStart, monthStart - 1, dayStart, "00", "00", "00"),
                $lt: new Date(yearEnd, monthEnd - 1, dayEnd, "23", "59", "59"),
            }
        };


        const getData = () => {
            return Turnimensili.find(query);
        };

        if (redisClient == undefined || redisDisabled) {
            const turni = await getData();
            console.log(turni);
            res.status(200).json(turni);
            return;
        }


        const turni = await getData();
        console.log(turni);
        res.status(200).json(turni);

    } catch (err) {
        res.status(500);
        res.json({ Error: err });
    }
});



// http://[HOST]:[PORT]/api/turnimensili (POST)
// INSERT turnimensili su DB
router.post("/", async (req, res) => {
    try {
        const turnimensili = new Turnimensili({
            dataRifInizio: new Date(req.body.dataRifInizio),
            dataRifFine: new Date(req.body.dataRifFine),
            turnoInizio: Number.parseInt(req.body.turnoInizio),
            turnoFine: Number.parseInt(req.body.turnoFine),
            user: mongoose.Types.ObjectId(req.body.user),
            mansione: req.body.mansione,
            utente: req.body.utente,
            tipoTurno: req.body.tipoTurno,
        });

        // Salva i dati sul mongodb
        const result = await turnimensili.save();

        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        if (redisClient != undefined && !redisDisabled) {
            redisClient.del(`TURNIMENSILIALL`);
        }

        const usr = res.locals.auth;

        const getDipendente = () => {
            return Dipendenti.findById(usr.dipendenteID);
        };

        const dip = await getDipendente();

        const log = new Log({
            data: new Date(),
            operatore: dip.nome + " " + dip.cognome,
            operatoreID: usr.dipendenteID,
            className: "TurniMensili",
            operazione: "Inserimento turno mensile ",
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

// http://[HOST]:[PORT]/api/turnimensili/[ID]
// Modifica delle turnimensili
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        // Aggiorna il documento su mongodb
        const turnimensili = await Turnimensili.updateOne(
            { _id: id },
            {
                $set: {
                    dataRifInizio: new Date(req.body.dataRifInizio),
                    dataRifFine: new Date(req.body.dataRifFine),
                    turnoInizio: Number.parseInt(req.body.turnoInizio),
                    turnoFine: Number.parseInt(req.body.turnoFine),
                    user: mongoose.Types.ObjectId(req.body.user),
                    mansione: req.body.mansione,
                    utente: req.body.utente,
                    tipoTurno: req.body.tipoTurno,
                },
            }
        );

        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        if (redisClient != undefined && !redisDisabled) {
            redisClient.del(`TURNIMENSILIBY${id}`);
        }

        const usr = res.locals.auth;

        const getDipendente = () => {
            return Dipendenti.findById(usr.dipendenteID);
        };

        const dip = await getDipendente();

        const log = new Log({
            data: new Date(),
            operatore: dip.nome + " " + dip.cognome,
            operatoreID: usr.dipendenteID,
            className: "TurniMensili",
            operazione: "Modifica turno mensile ",
        });
        console.log("log: ", log);
        const resultLog = await log.save();

        res.status(200).json(turnimensili);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

module.exports = router;
