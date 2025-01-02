const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");  // Added mongoose for objectId validation
const SchedaTer = require("../models/schedaTerapeutica");
const Log = require("../models/log");
const Dipendenti = require("../models/dipendenti");


// Get all schede terapeutiche
router.get("/", async (req, res) => {
    try {
        const scheda = await SchedaTer.find();
        res.status(200).json(scheda);
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ Error: err.message });
    }
});

// Get scheda terapeutica by patient ID
// http://[HOST]:[PORT]/api/schedaTerapeutica/paziente/[ID]
router.get("/paziente/:id", async (req, res) => {
    const { id } = req.params;
    console.log(id);
    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ Error: "Invalid patient ID format" });
    }

    try {
        const scheda = await SchedaTer.findOne({ idPaziente: id });
        if (scheda.length === 0) {
            return res.status(404).json({ Error: "No schede found for the patient" });
        }
        const response = {
            ...scheda.toObject(),
            Orale: scheda.Orale || [],
            IMEVSC: scheda.IMEVSC || [],
            Estemporanea: scheda.Estemporanea || []
        };

        // Risposta con status 200 e i dati corretti
        res.status(200).json(response);
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ Error: err.message });
    }
});

// Get a scheda terapeutica by ID
// http://[HOST]:[PORT]/api/schedaTerapeutica/[ID]
router.get("/:id", async (req, res) => {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ Error: "Invalid ID format" });
    }

    try {
        const scheda = await SchedaTer.findById(id);
        if (!scheda) {
            return res.status(404).json({ Error: "Scheda not found" });
        }
        res.status(200).json(scheda);
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ Error: err.message });
    }
});

// Insert a new scheda terapeutica into the database
// http://[HOST]:[PORT]/api/schedaTerapeutica (POST)
router.post("/", async (req, res) => {
    try {
        const scheda = new SchedaTer(req.body);
        const result = await scheda.save();

        const user = res.locals.auth;

        const getDipendente = () => {
            return Dipendenti.findById(user.dipendenteID);
        };

        const dipendenti = await getDipendente();

        const log = new Log({
            data: new Date(),
            operatore: dipendenti.nome + " " + dipendenti.cognome,
            operatoreID: user.dipendenteID,
            className: "SchedaTerapeutica",
            operazione: "Inserimento nuova scheda terapeutica",
        });
        console.log("log: ", log);
        const resultLog = await log.save();

        res.status(201).json(result);
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ Error: err.message });
    }
});


// Update an existing scheda terapeutica by ID
// http://[HOST]:[PORT]/api/schedaTerapeutica/[ID]
router.put("/:id", async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ Error: "Invalid ID format" });
    }

    if (!Object.keys(req.body).length) {
        return res.status(400).json({ Error: "No data provided for update" });
    }

    try {
        const scheda = await SchedaTer.updateOne(
            { _id: id },
            { $set: req.body }
        );

        if (scheda.matchedCount === 0) {
            return res.status(404).json({ Error: "Scheda not found or no changes made" });
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
            className: "SchedaTerapeutica",
            operazione: "Modifica scheda terapeutica",
        });
        console.log("log: ", log);
        const resultLog = await log.save();

        res.status(200).json(scheda);
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ Error: err.message });
    }
});

// Add a new firma to a scheda
router.post("/:id/firme", async (req, res) => {
    const { id } = req.params;
    const { data, firmaMattina, firmaPomeriggio, firmaNotte, attivaFirma } = req.body;

    // Validazione ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ Error: "Invalid scheda ID format" });
    }

    // Validazione dati firma
    if (!data) {
        return res.status(400).json({ Error: "Missing required field: data" });
    }

    try {
        const scheda = await SchedaTer.findById(id);
        if (!scheda) {
            return res.status(404).json({ Error: "Scheda not found" });
        }

        // Aggiungere una nuova firma
        const nuovaFirma = {
            data,
            firmaMattina: firmaMattina || null,
            firmaPomeriggio: firmaPomeriggio || null,
            firmaNotte: firmaNotte || null,
            attivaFirma: attivaFirma !== undefined ? attivaFirma : true,
        };

        scheda.firme.push(nuovaFirma);
        await scheda.save();

        const user = res.locals.auth;

        const getDipendente = () => {
            return Dipendenti.findById(user.dipendenteID);
        };

        const dipendenti = await getDipendente();

        const log = new Log({
            data: new Date(),
            operatore: dipendenti.nome + " " + dipendenti.cognome,
            operatoreID: user.dipendenteID,
            className: "SchedaTerapeutica",
            operazione: "Inserimento firma scheda terapeutica",
        });
        console.log("log: ", log);
        const resultLog = await log.save();

        res.status(201).json({ message: "Firma added successfully", firma: nuovaFirma });
    } catch (err) {
        console.error("Error adding firma: ", err);
        res.status(500).json({ Error: err.message });
    }
});


// Get all firme for a specific scheda
router.get("/:id/firme", async (req, res) => {
    const { id } = req.params;

    // Validazione ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ Error: "Invalid scheda ID format" });
    }

    try {
        const scheda = await SchedaTer.findById(id, "firme");
        if (!scheda) {
            return res.status(404).json({ Error: "Scheda not found" });
        }

        res.status(200).json(scheda.firme);
    } catch (err) {
        console.error("Error fetching firme: ", err);
        res.status(500).json({ Error: err.message });
    }
});

module.exports = router;
