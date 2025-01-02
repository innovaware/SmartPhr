const express = require("express");
const router = express.Router();
const NominaDipendente = require("../models/nominaDipendente");
const Log = require("../models/log");
const Dipendenti = require("../models/dipendenti");


router.get("/", async (req, res) => {
    try {
        const eventi = await NominaDipendente.find();
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

        const eventi = await NominaDipendente.findById(id);

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
        const nominaDipendente = await NominaDipendente.find(
            { dipendenteID: id }
        );
        res.status(200).json(nominaDipendente);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});


router.post("/", async (req, res) => {
    try {
        const nominaDipendente = new NominaDipendente({
            dipendenteID: req.body.dipendenteID,
            nomina: req.body.nomina,
            dataNomina: new Date(),
            attestato: false,
            nominato: false,
        });

        const result = await nominaDipendente.save();

        const user = res.locals.auth;

        const getDipendente = () => {
            return Dipendenti.findById(user.dipendenteID);
        };

        const dipendenti = await getDipendente();

        const log = new Log({
            data: new Date(),
            operatore: dipendenti.nome + " " + dipendenti.cognome,
            operatoreID: user.dipendenteID,
            className: "NominaDipendente",
            operazione: "Inserimento nomina dipendente: " + nominaDipendente.nomina,
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

router.put('/:id', async (req, res) => {
    try {
        const nominaDipendenteId = req.params.id;
        const updateData = req.body;

        // Verifica preliminare dell'ID
        if (!nominaDipendenteId) {
            return res.status(400).send({ message: 'ID non fornito' });
        }

        // Trova la nomina per ID e aggiornala
        const updatedNomina = await NominaDipendente.findByIdAndUpdate(nominaDipendenteId, updateData, { new: true });

        if (!updatedNomina) {
            return res.status(404).send({ message: 'NominaDipendente non trovata' });
        }

        res.send(updatedNomina);
    } catch (error) {
        res.status(500).send({ message: `Errore del server: ${error.message}` });
    }
});

module.exports = router;

