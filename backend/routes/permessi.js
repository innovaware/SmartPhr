const express = require("express");
const router = express.Router();
const Permessi = require("../models/permessi");
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;
const Log = require("../models/log");
const Dipendenti = require("../models/dipendenti");

router.get("/", async (req, res) => {
    try {
        const eventi = await Permessi.find();
        res.status(200).json(eventi);
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ Error: err });
    }
});


//LISTA PERMESSI DIPENDENTE
// http://[HOST]:[PORT]/api/permessiDipendente/[ID_DIPENDENTE]
router.get("/dipendente/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const eventi = await Permessi.find({
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

// http://[HOST]:[PORT]/api/permessi/[ID]
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const permessi = await Permessi.findById(id);
        res.status(200).json(permessi);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

// http://[HOST]:[PORT]/api/permessi (POST)
// INSERT permessi su DB
router.post("/", async (req, res) => {
    try {
        const permessi = new Permessi({
            dataPermesso: req.body.dataPermesso,
            oraInizio: req.body.oraInizio,
            oraFine: req.body.oraFine,
            dataRichiesta: req.body.dataRichiesta,
            accettata: false,
            user: req.body.user,
            closed: false,
        });

        // Salva i dati sul mongodb
        const result = await permessi.save();
        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        if (redisClient != undefined && !redisDisabled) {
            redisClient.del(`PERMESSIALL`);
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
            className: "Permessi",
            operazione: "Inserimento permesso per il dipendente: " + permessi.cognome + " " + permessi.nome,
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

// http://[HOST]:[PORT]/api/permessi/[ID]
// Modifica delle permessi
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        // Aggiorna il documento su mongodb
        const permessi = await Permessi.updateOne(
            { _id: id },
            {
                $set: {
                    dataPermesso: req.body.dataPermesso,
                    oraInizio: req.body.oraInizio,
                    oraFine: req.body.oraFine,
                    dataRichiesta: req.body.dataRichiesta,
                    accettata: req.body.accettata,
                    user: req.body.user,
                    closed: true,
                },
            }
        );

        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        if (redisClient != undefined && !redisDisabled) {
            redisClient.del(`PERMESSIBY${id}`);
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
            className: "Permessi",
            operazione: "Modifica permesso per il dipendente: " + permessi.cognome + " " + permessi.nome,
        });
        console.log("log: ", log);
        const resultLog = await log.save();

        res.status(200).json(permessi);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

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

        const richiesta = await Permessi.updateOne(
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
            redisClient.del(`PERMESSIBY${id}`);
            redisClient.del(`PERMESSIALL`);
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
            className: "Permessi",
            operazione: "Eliminazione permesso per il dipendente: " + permessi.cognome + " " + permessi.nome,
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
