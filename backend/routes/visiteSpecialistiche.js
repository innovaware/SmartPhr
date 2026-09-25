const express = require("express");
const router = express.Router();
const VisiteSpecialistiche = require("../models/visiteSpecialistiche");
const Log = require("../models/log");
const Dipendenti = require("../models/dipendenti");

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const eventi = await VisiteSpecialistiche.find({
            user: id,
        });
        res.status(200).json(eventi);
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

        const user = res.locals.auth;
        const dipendenti = await Dipendenti.findById(user.dipendenteID);

        const log = new Log({
            data: new Date(),
            operatore: dipendenti.nome + " " + dipendenti.cognome,
            operatoreID: user.dipendenteID,
            className: "VisiteSpecialistiche",
            operazione: "Inserimento visita specialistica ",
        });
        console.log("log: ", log);
        await log.save();

        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ Error: err });
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

        const user = res.locals.auth;
        const dipendenti = await Dipendenti.findById(user.dipendenteID);

        const log = new Log({
            data: new Date(),
            operatore: dipendenti.nome + " " + dipendenti.cognome,
            operatoreID: user.dipendenteID,
            className: "VisiteSpecialistiche",
            operazione: "Modifica visita specialistica ",
        });
        console.log("log: ", log);
        await log.save();

        res.status(200).json(visita);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

router.get("/", async (req, res) => {
    try {
        const eventi = await VisiteSpecialistiche.find();
        res.status(200).json(eventi);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

module.exports = router;