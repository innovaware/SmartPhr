const express = require("express");
const router = express.Router();
const Agenda = require("../models/agendaClinica");
const Log = require("../models/log");
const Dipendenti = require("../models/dipendenti");

router.get("/", async (req, res) => {
    try {

        const getData = () => {
            return Agenda.find();
        };

        const agenda = await getData();
        res.status(200).json(agenda);

    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ Error: err });
    }
});


router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const getData = () => {
            return Agenda.findById(id);
        };

        const agenda = await getData();
        res.status(200).json(agenda);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

router.get("/tipo/:tipo", async (req, res) => {
    const { tipo } = req.params;
    try {
        const agenda = await Agenda.find({ tipo: tipo });
        res.status(200).json(agenda);
    } catch (err) {
        console.error("Errore durante il recupero degli eventi:", err); // Log dell'errore
        res.status(500).json({ error: err.message || "Errore del server" }); // Risposta più chiara
    }
});

router.post("/", async (req, res) => {
    try {
        const agenda = new Agenda({
            dataEvento: req.body.dataEvento,
            evento: req.body.evento,
            tipo: req.body.tipo,
            pazienteName: req.body.pazienteName,
            paziente: req.body.paziente,
            note: req.body.note,
            status: req.body.status,
            dataRequest: new Date(),
        });

        const result = await agenda.save();

        const user = res.locals.auth;

        const getDipendente = () => {
            return Dipendenti.findById(user.dipendenteID);
        };

        const dipendenti = await getDipendente();

        const log = new Log({
            data: new Date(),
            operatore: dipendenti.nome + " " + dipendenti.cognome,
            operatoreID: user.dipendenteID,
            className: "AgendaClinica",
            operazione: "Inserimento evento: " + agenda.evento + " per il paziente " + agenda.pazienteName + " di tipo " + agenda.tipo,
        });
        console.log("log: ", log);
        const resultLog = await log.save();

        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});


router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const agenda = await Agenda.updateOne(
            { _id: id },
            {
                $set: {
                    dataEvento: req.body.dataEvento,
                    evento: req.body.evento,
                    tipo: req.body.tipo,
                    pazienteName: req.body.pazienteName,
                    paziente: req.body.paziente,
                    note: req.body.note,
                    status: req.body.status,
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
            className: "AgendaClinica",
            operazione: "Modifica evento: " + agenda.evento + " per il paziente " + agenda.pazienteName + " Status: " + agenda.status,
        });
        console.log("log: ", log);
        const resultLog = await log.save();


        res.status(200);
        res.json(agenda);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

module.exports = router;
