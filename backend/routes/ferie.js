const express = require("express");
const router = express.Router();
const Ferie = require("../models/ferie");
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;
const Log = require("../models/log");
const Dipendenti = require("../models/dipendenti");

router.get("/", async (req, res) => {
    try {
        const eventi = await Ferie.find();
        res.status(200).json(eventi);
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ Error: err });
    }
});


//LISTA FERIE DIPENDENTE
// http://[HOST]:[PORT]/api/ferieDipendente/[ID_DIPENDENTE]
router.get("/dipendente/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const eventi = await Ferie.find({
            $and: [
                {
                    $or: [{ cancellato: { $exists: false } }, { cancellato: false }],
                },
                { user: id },
            ],
        });
        res.status(200).json(eventi);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});


// http://[HOST]:[PORT]/api/ferie/[ID]
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const eventi = await Ferie.findById(id);
        res.status(200).json(eventi);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});


// http://[HOST]:[PORT]/api/ferie (POST)
// INSERT Ferie su DB
router.post("/", async (req, res) => {
    try {
        const ferie = new Ferie({
            dataInizio: req.body.dataInizio,
            dataFine: req.body.dataFine,
            dataRichiesta: req.body.dataRichiesta,
            accettata: false,
            user: req.body.user,
            cognome: req.body.cognome,
            nome: req.body.nome,
            cf: req.body.cf,
            closed: false,
        });

        // Salva i dati sul mongodb
        const result = await ferie.save();


        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        if (redisClient != undefined && !redisDisabled) {
            redisClient.del(`FERIEALL`);
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
            className: "Ferie",
            operazione: "Inserimento ferie del dipendente: " + ferie.cognome + " " + ferie.nome,
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

// http://[HOST]:[PORT]/api/ferie/[ID]
// Modifica delle ferie
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        // Aggiorna il documento su mongodb
        const ferie = await Ferie.updateOne(
            { _id: id },
            {
                $set: {
                    dataInizio: req.body.dataInizio,
                    dataFine: req.body.dataFine,
                    dataRichiesta: req.body.dataRichiesta,
                    accettata: req.body.accettata,
                    user: req.body.user,
                    cognome: req.body.cognome,
                    nome: req.body.nome,
                    cf: req.body.cf,
                    closed: true,
                },
            }
        );

        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        if (redisClient != undefined && !redisDisabled) {
            redisClient.del(`FERIEBY${id}`);
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
            className: "Ferie",
            operazione: "Modifica ferie del dipendente: " + ferie.cognome + " " + ferie.nome,
        });
        console.log("log: ", log);
        const resultLog = await log.save();

        res.status(200).json(ferie);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

/// Eliminare Ferie
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        if (id == undefined || id === "undefined") {
            console.log("Error id is not defined ", id);
            res.status(404).json({ Error: "Id not defined" });
            return;
        }

        if (id == null) {
            res.status(400).json({ error: "id not valid" });
        }

        const richiesta = await Ferie.updateOne(
            { _id: id },
            {
                $set: {
                    cancellato: true,
                    dataCancellazione: new Date(),
                },
            }
        );

        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        if (redisClient != undefined && !redisDisabled) {
            redisClient.del(`FERIEBY${id}`);
            redisClient.del(`FERIEALL`);
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
            className: "Ferie",
            operazione: "Eliminazione ferie del dipendente: " + ferie.cognome + " " + ferie.nome,
        });
        console.log("log: ", log);
        const resultLog = await log.save();

        res.status(200);
        res.json(richiesta);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

module.exports = router;
