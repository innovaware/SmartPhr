const express = require("express");
const Segnalazione = require("../models/segnalazione");
const Log = require("../models/log");
const Dipendenti = require("../models/dipendenti");


const router = express.Router();

router.get("/", async (req, res) => {
    try {
        // Function to get data from MongoDB
        const getData = () => {
            return Segnalazione.find();
        };

        // Get the data from MongoDB
        const segnalazioni = await getData();

        // Send the response
        res.status(200).json(segnalazioni);
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ Error: err });
    }
});


router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        // Function to get data from MongoDB by ID
        const getData = () => {
            return Segnalazione.findById(id);
        };

        // Get the data from MongoDB
        const segnalazioni = await getData();

        // Send the response
        res.status(200).json(segnalazioni);
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ Error: err });
    }
});

router.post("/", async (req, res) => {
    try {
        console.log("Dentro il route handler POST /");
        console.log("Body della richiesta:", req.body);

        const segnalazione = new Segnalazione({
            utenteNome: req.body.utenteNome,
            utente: req.body.utente,
            numTicket: req.body.numTicket,
            segnalato: true,
            status: "Segnalato",
            descrizione: req.body.descrizione,
            presoincarico: false,
            risolto: false,
            dataSegnalazione: new Date(),
        });

        console.log("Dati della segnalazione:", segnalazione);

        const result = await segnalazione.save();

        const user = res.locals.auth;

        const getDipendente = () => {
            return Dipendenti.findById(user.dipendenteID);
        };

        const dipendenti = await getDipendente();

        const log = new Log({
            data: new Date(),
            operatore: dipendenti.nome + " " + dipendenti.cognome,
            operatoreID: user.dipendenteID,
            className: "Segnalazione",
            operazione: "Inserimento segnalazione: " + segnalazione.numTicket + ". Data: " + segnalazione.dataSegnalazione,
        });
        console.log("log: ", log);
        const resultLog = await log.save();

        res.status(200).json(result);

    } catch (err) {
        console.error("Errore durante il salvataggio della segnalazione:", err);
        res.status(500).json({ "Error": err.message });
    }
});


router.put('/:id', async (req, res) => {
    try {
        const segnalazioneId = req.params.id;
        const updateData = req.body;

        // Trova la segnalazione per ID e aggiornala
        const updatedSegnalazione = await Segnalazione.findByIdAndUpdate(segnalazioneId, updateData, { new: true });

        if (!updatedSegnalazione) {
            return res.status(404).send({ message: 'Segnalazione non trovata' });
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
            className: "Segnalazione",
            operazione: "Modifica segnalazione: " + segnalazione.numTicket + ". Data: " + segnalazione.dataSegnalazione,
        });
        console.log("log: ", log);
        const resultLog = await log.save();

        res.send(updatedSegnalazione);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

module.exports = router;