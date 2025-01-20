const express = require("express");
const NuovoMessaggio = require("../models/newMessage");
const Log = require("../models/log");
const Dipendenti = require("../models/dipendenti");


const router = express.Router();

router.get("/", async (req, res) => {
    try {
        // Function to get data from MongoDB
        const getData = () => {
            return NuovoMessaggio.find();
        };

        // Get the data from MongoDB
        const nM = await getData();

        // Send the response
        res.status(200).json(nM);
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ Error: err });
    }
});


// Route to get all messages for a specific recipient
router.get('/messages/:destinatarioId', async (req, res) => {
    const { destinatarioId } = req.params;
    try {
        const messages = await NuovoMessaggio.find({ destinatarioId: destinatarioId });
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json({ error: 'Errore nel recupero dei messaggi', details: err.message });
    }
});

// Route to get a single message for a specific recipient by message ID
router.get('/message/:destinatarioId/:messageId', async (req, res) => {
    const { destinatarioId, messageId } = req.params;
    try {
        const message = await NuovoMessaggio.findOne({ _id: messageId, destinatarioId: destinatarioId });
        if (!message) {
            return res.status(404).json({ error: 'Messaggio non trovato' });
        }
        res.status(200).json(message);
    } catch (err) {
        res.status(500).json({ error: 'Errore nel recupero del messaggio', details: err.message });
    }
});


router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        // Function to get data from MongoDB by ID
        const getData = () => {
            return NuovoMessaggio.findById(id);
        };

        // Get the data from MongoDB
        const NM = await getData();

        // Send the response
        res.status(200).json(NM);
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ Error: err });
    }
});

router.post("/", async (req, res) => {
    try {
        console.log('Body ricevuto:', req.body);

        const newMessage = new NuovoMessaggio({
            ...req.body,
            letto: false,
            data: new Date()
        });

        console.log('Modello creato:', newMessage);
        const savedMessage = await newMessage.save();
        console.log('Messaggio salvato:', savedMessage);

        res.status(201).json(savedMessage);
    } catch (err) {
        console.error('Stack trace completo:', err.stack);
        console.error('Dettagli errore:', {
            name: err.name,
            message: err.message,
            code: err.code
        });
        res.status(500).json({
            error: "Errore nel creare il messaggio",
            details: err.message
        });
    }
});
// PUT: Aggiornare un messaggio esistente
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Trovare e aggiornare il messaggio
        const updatedMessage = await NuovoMessaggio.findByIdAndUpdate(id, updates, {
            new: true, // Restituisce il documento aggiornato
            runValidators: true, // Esegue i validatori definiti nello schema
        });

        if (!updatedMessage) {
            return res.status(404).json({ error: "Messaggio non trovato" });
        }

        res.status(200).json(updatedMessage);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Errore nell'aggiornare il messaggio" });
    }
});

module.exports = router;