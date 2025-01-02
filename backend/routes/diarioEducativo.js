const express = require("express");
const router = express.Router();
const DiarioEducativo = require("../models/diarioEducativo");
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;
const Log = require("../models/log");
const Dipendenti = require("../models/dipendenti");

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        // Ottieni i dati direttamente dal database
        const eventi = await DiarioEducativo.find({
            user: id,
        });

        // Rispondi con i dati ottenuti
        res.status(200).json(eventi);
    } catch (err) {
        // Gestione degli errori
        res.status(500).json({ Error: err });
    }
});


router.post("/", async (req, res) => {
    try {
        const diario = new DiarioEducativo({
            data: req.body.data,
            contenuto: req.body.contenuto,
            firma: req.body.firma,
            user: req.body.user,
        });

        const result = await diario.save();
        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        if (redisClient != undefined && !redisDisabled) {
            redisClient.del(`DIARIOEDUCATIVO*`);
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
            className: "DiarioEducativo",
            operazione: "Inserimento Diario Educativo",
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
        const diario = await DiarioEducativo.updateOne(
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
            redisClient.del(`DIARIOEDUCATIVOBY${id}`);
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
            className: "DiarioEducativo",
            operazione: "Modifica Diario Educativo",
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
