const express = require("express");
const router = express.Router();
const RecordChiavi = require("../models/gestChiavi");
const Log = require("../models/log");
const Dipendenti = require("../models/dipendenti");

router.get("/", async (req, res) => {
    try {
        const chiavi = await RecordChiavi.find({});
        res.status(200).json(chiavi);
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