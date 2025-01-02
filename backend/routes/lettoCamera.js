const express = require("express");
const attivitaRifacimentoLetti = require("../models/attivitaRifacimentoLetti");
const router = express.Router();
const LettoCamera = require("../models/lettoCamera");
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;
const Log = require("../models/log");
const Dipendenti = require("../models/dipendenti");

router.get("/", async (req, res) => {
    try {
        const getData = () => {
            return LettoCamera.find({});
        };

        const letti = await getData();
        res.status(200).json(letti);
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ Error: err });
    }
});

router.get("/attivita", async (req, res) => {
    try {
        const getData = () => {
            return attivitaRifacimentoLetti.find();
        };

        const attivita = await getData();
        res.status(200).json(attivita);
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ Error: err });
    }
});


router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const rec = await LettoCamera.updateOne(
            { _id: id },
            {
                $set: {
                    tipo: req.body.tipo,
                    giacenza: req.body.giacenza,
                    dataUltimaModifica: new Date(),
                    firma: req.body.firma,
                    operatore: req.body.operatore
                },
            }
        );
        var ora = (new Date()).getHours();
        var turno = "";
        if (ora >= 6 && ora < 14) turno = "mattina";
        else {
            if (ora >= 14 && ora < 22) turno = "pomeriggio";
            else {
                turno = "notturno";
            }
        }
        const reg = new attivitaRifacimentoLetti({
            tipo: req.body.tipo,
            carico: req.body.carico,
            scarico: req.body.scarico,
            laceratiNum: req.body.laceratiNum,
            dataUltimaModifica: new Date(),
            isInternal: req.body.isInternal,
            firma: req.body.firma,
            operatore: req.body.operatore,
            turno: turno,
        })
        const resultRegistro = await reg.save();

        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        if (redisClient != undefined && !redisDisabled) {
            redisClient.del(`LETTOBY${id}`);
        }

        const Log = require("../models/log");
        const Dipendenti = require("../models/dipendenti");

        const user = res.locals.auth;

        const getDipendente = () => {
            return Dipendenti.findById(user.dipendenteID);
        };

        const dipendenti = await getDipendente();

        const log = new Log({
            data: new Date(),
            operatore: dipendenti.nome + " " + dipendenti.cognome,
            operatoreID: user.dipendenteID,
            className: "LettoCamera",
            operazione: "Modifica letto camera ",
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
