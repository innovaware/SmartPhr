const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");  // Added mongoose for objectId validation
const SchedaTer = require("../models/schedaTerapeutica");

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

        res.status(200).json(scheda);
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ Error: err.message });
    }
});


module.exports = router;
