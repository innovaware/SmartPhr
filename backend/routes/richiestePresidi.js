const express = require("express");
const router = express.Router();
const RichiestePresidi = require("../models/richiestePresidi");
const Log = require("../models/log");
const Dipendenti = require("../models/dipendenti");


router.get("/", async (req, res) => {
    try {
        const getData = () => {
            return RichiestePresidi.find();
        };

        const richiestePresidi = await getData();
        res.status(200).json(richiestePresidi);

    } catch (err) {
        console.log(err);
        res.status(500).json({ Error: err });
    }
});


router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const getData = () => {
            return RichiestePresidi.findById(id);
        };

        const richiestePresidi = await getData();
        res.status(200).json(richiestePresidi);

    } catch (err) {
        console.log(err);
        res.status(500).json({ Error: err });
    }
});

router.get("/type/:type", async (req, res) => {
    try {
        let type = req.params.type;

        const getData = async () => {
            return await RichiestePresidi.find({
                type: type,
            });
        };

        // Fetch data from the database directly without using cache
        const richiestePresidi = await getData();
        res.status(200).json(richiestePresidi);
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ Error: err });
    }
});

router.post("/", async (req, res) => {
    try {

        const richieste = new RichiestePresidi({
            materiale: req.body.materiale,
            type: req.body.type,
            dataRichiesta: new Date(),
            status: "Richiesto",
            dipendente: req.body.dipendente,
            dipendenteName: req.body.dipendenteName,
            quantita: req.body.quantita,
            note: req.body.note,
        });

        console.log(req.body);

        const result = await richieste.save();

        const user = res.locals.auth;

        const getDipendente = () => {
            return Dipendenti.findById(user.dipendenteID);
        };

        const dipendenti = await getDipendente();

        const log = new Log({
            data: new Date(),
            operatore: dipendenti.nome + " " + dipendenti.cognome,
            operatoreID: user.dipendenteID,
            className: "RichiestePresidi",
            operazione: "Inserimento richieste presidi: " + richieste.materiale + ", Quantita': " + richieste.quantita,
        });
        console.log("log: ", log);
        const resultLog = await log.save();
        
        res.status(200);
        res.json(result);

    } catch (err) {
        res.status(500);
        res.json({ "Error": err });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const requisitiId = req.params.id;
        const updateData = req.body;

        // Trova la segnalazione per ID e aggiornala
        const updatedRichiestePresidi = await RichiestePresidi.findByIdAndUpdate(requisitiId, updateData, { new: true });

        if (!updatedRichiestePresidi) {
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
            className: "RichiestePresidi",
            operazione: "Modifica richieste presidi: " + richieste.materiale + ", Quantita': " + richieste.quantita,
        });
        console.log("log: ", log);
        const resultLog = await log.save();

        res.send(updatedRichiestePresidi);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

module.exports = router;
