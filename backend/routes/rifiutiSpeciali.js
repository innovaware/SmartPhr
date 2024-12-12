const express = require("express");
const router = express.Router();
const RifiutiSpeciali = require("../models/rifiutiSpeciali");

// POST: Crea un nuovo anno con i dati iniziali
router.post("/", async (req, res) => {
    const { anno, mesi } = req.body;

    try {
        const nuovoAnno = new RifiutiSpeciali({ anno, mesi });
        await nuovoAnno.save();
        res.status(201).json({ message: "Anno creato con successo!", nuovoAnno });
    } catch (error) {
        res.status(500).json({ message: "Errore durante la creazione dell'anno.", error });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;


        const rifiuti = await RifiutiSpeciali.updateOne(
            { _id: id },
            {
                $set: req.body,
            }
        );

        res.status(200);
        res.json(rifiuti);

    } catch (err) {
        res.status(500).json({ error: err })
    }
});

// GET: Ottieni tutti gli anni
router.get("/", async (req, res) => {
    try {
        // Recupero degli anni dalla collezione
        const anni = await RifiutiSpeciali.find();

        // Risposta JSON con i dati recuperati
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


// GET: Ottieni un anno specifico
router.get("/:anno", async (req, res) => {
    const { anno } = req.params; // Cambia a in anno per chiarezza
    const annoN = Number(anno); // Converti anno in numero

    if (isNaN(annoN)) {
        return res.status(400).json({ message: "Parametro 'anno' non valido. Deve essere un numero." });
    }

    try {
        const annoTrovato = await RifiutiSpeciali.find({ anno: annoN }); // Usa annoN per la query
        if (annoTrovato.length === 0) { // Controlla se l'array è vuoto
            return res.status(404).json({ message: "Anno non trovato." });
        }

        res.json(annoTrovato);
    } catch (error) {
        res.status(500).json({ message: "Errore durante il recupero dell'anno.", error });
    }
});


module.exports = router;
