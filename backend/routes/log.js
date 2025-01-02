const express = require("express");
const router = express.Router();
const Log = require("../models/log");

// GET: Ottieni tutti i log
router.get("/", async (req, res) => {
    try {
        // Recupera tutti i documenti dalla collezione "Log"
        const anni = await Log.find();

        // Verifica se ci sono dati
        if (!anni || anni.length === 0) {
            return res.status(404).json({
                message: "Nessun dato trovato."
            });
        }

        // Invia la risposta con i dati recuperati
        res.status(200).json(anni);
    } catch (error) {
        console.error("Errore durante il recupero degli anni:", error.message);

        // Risposta in caso di errore
        res.status(500).json({
            message: "Errore durante il recupero degli anni.",
            error: error.message, // Mostra solo il messaggio dell'errore
        });
    }
});

// POST: Aggiungi un nuovo elemento
router.post("/", async (req, res) => {
    try {

        // Verifica che i dati obbligatori siano presenti
        if (!req.body) {
            return res.status(400).json({
                message: "Dati mancanti."
            });
        }

        // Crea un nuovo documento Log
        const nuovoLog = new Log({
            data: new Date(),
            operatore: req.body.operatore,
            operatoreID: req.body.operatoreID,
            className: req.body.className,
            operazione: req.body.operazione,
        });

        // Salva il documento nel database
        const risultato = await nuovoLog.save();

        // Risposta con il nuovo elemento creato
        res.status(201).json({
            message: "Elemento creato con successo.",
            data: risultato,
        });
    } catch (error) {
        console.error("Errore durante la creazione del nuovo elemento:", error.message);

        // Risposta in caso di errore
        res.status(500).json({
            message: "Errore durante la creazione del nuovo elemento.",
            error: error.message,
        });
    }
});


module.exports = router;
