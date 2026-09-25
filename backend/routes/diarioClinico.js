const express = require("express");
const router = express.Router();
const DiarioClinico = require("../models/diarioClinico");
const Log = require("../models/log");
const Dipendenti = require("../models/dipendenti");
const Pazienti = require("../models/pazienti");

// GET DiarioClinico by user ID
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const eventi = await DiarioClinico.find({ user: id });
        res.status(200).json(eventi);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

// POST nuovo DiarioClinico
router.post("/", async (req, res) => {
    try {
        const diario = new DiarioClinico({
            data: req.body.data,
            contenuto: req.body.contenuto,
            terapia: req.body.terapia,
            user: req.body.user,
        });

        const result = await diario.save();

        const user = res.locals.auth;

        const dipendente = await Dipendenti.findById(user.dipendenteID);

        const paziente = await Pazienti.findById(req.body.user);

        const log = new Log({
            data: new Date(),
            operatore: dipendente.nome + " " + dipendente.cognome,
            operatoreID: user.dipendenteID,
            className: "DiarioClinico",
            operazione: "Inserimento nota Diario Clinico paziente:\n" + paziente.nome + " " + paziente.cognome,
        });

        await log.save();

        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

// PUT aggiorna DiarioClinico esistente
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const diario = await DiarioClinico.updateOne(
            { _id: id },
            {
                $set: {
                    data: req.body.data,
                    contenuto: req.body.contenuto,
                    terapia: req.body.terapia,
                },
            }
        );

        const user = res.locals.auth;

        const dipendente = await Dipendenti.findById(user.dipendenteID);

        const paziente = await Pazienti.findById(req.body.user);

        const log = new Log({
            data: new Date(),
            operatore: dipendente.nome + " " + dipendente.cognome,
            operatoreID: user.dipendenteID,
            className: "DiarioClinico",
            operazione: "Modifica nota Diario Clinico paziente:\n" + paziente.nome + " " + paziente.cognome,
        });

        await log.save();

        res.status(200).json(diario);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

module.exports = router;
