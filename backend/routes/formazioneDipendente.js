const express = require("express");
const router = express.Router();
const FormazioneDipendente = require("../models/formazioneDipendente");



router.get("/", async (req, res) => {
    try {
        const eventi = await FormazioneDipendente.find();
        res.status(200).json(eventi);
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ Error: err });
    }
});


router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Verifica che l'ID sia valido
        if (!id) {
            return res.status(400).json({ Error: "ID mancante" });
        }

        const eventi = await FormazioneDipendente.findById(id);

        // Gestione del caso in cui l'ID non esiste nel database
        if (!eventi) {
            return res.status(404).json({ Error: "Evento non trovato" });
        }

        res.status(200).json(eventi);
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ Error: "Errore del server" });
    }
});



router.get("/dipendente/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const formazioneDipendente = await FormazioneDipendente.find(
            { dipendenteID: id }
        );
        res.status(200).json(formazioneDipendente);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});


router.post("/", async (req, res) => {
    try {
        console.log("esito: ", req.body);
        const formazioneDipendente = new FormazioneDipendente({
            dipendenteID: req.body.dipendenteID,
            esito: req.body.esito,
            dataCorso: new Date(),
            attestato: false,
        });

        const result = await formazioneDipendente.save();
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const formazioneDipendente = req.params.id;
        const updateData = req.body;

        // Verifica preliminare dell'ID
        if (!formazioneDipendente) {
            return res.status(400).send({ message: 'ID non fornito' });
        }

        // Trova la nomina per ID e aggiornala
        const updatedNomina = await FormazioneDipendente.findByIdAndUpdate(formazioneDipendente, updateData, { new: true });

        if (!updatedNomina) {
            return res.status(404).send({ message: 'NominaDipendente non trovata' });
        }

        res.send(updatedNomina);
    } catch (error) {
        res.status(500).send({ message: `Errore del server: ${error.message}` });
    }
});

module.exports = router;

