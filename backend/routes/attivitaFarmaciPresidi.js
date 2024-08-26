const express = require("express");
const router = express.Router();
const AttivitaFarmaciPresidi = require("../models/attivitaFarmaciPresidi");
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;

router.get("/farmaci", async (req, res) => {
    try {
        // Get the redisDisabled flag from the app settings
        const redisDisabled = req.app.get("redisDisabled");

        // Function to fetch data from MongoDB
        const getData = () => {
            return AttivitaFarmaciPresidi.find({ type: "Farmaci" });
        };

        // Fetch data directly if Redis is disabled or undefined
        const attivita = await getData();
        res.status(200).json(attivita);
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ Error: err });
    }
});


router.get("/presidi", async (req, res) => {
    try {
        // Get the redisDisabled flag from the app settings
        const redisDisabled = req.app.get("redisDisabled");

        // Function to fetch data from MongoDB
        const getData = () => {
            return AttivitaFarmaciPresidi.find({ type: "Presidi" });
        };

        // Fetch data directly if Redis is disabled or undefined
        const attivita = await getData();
        res.status(200).json(attivita);
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ Error: err });
    }
});




//LISTA ATTIVITA PAZIENTE
router.get("/farmacipaziente/:id", async (req, res) => {
    const { id } = req.params;
    try {
        // Get the redisDisabled flag from the app settings
        const redisDisabled = req.app.get("redisDisabled");

        // Function to fetch data from MongoDB
        const getData = () => {
            // Query to find activities for a specific patient (paziente) and type "Farmaci"
            return Attivita.find({
                paziente: id,
                type: "Farmaci",
                createdAt: { $gte: new Date().setHours(0, 0, 0, 0), $lte: new Date().setHours(23, 59, 59, 999) }
            });
        };

        // Fetch data directly if Redis is disabled or undefined
        const attivita = await getData();
        res.status(200).json(attivita);
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ Error: err.message });
    }
});



router.get("/presidipaziente/:id", async (req, res) => {
    const { id } = req.params;
    try {
        // Get the redisDisabled flag from the app settings
        const redisDisabled = req.app.get("redisDisabled");

        // Function to fetch data from MongoDB
        const getData = () => {
            // Query to find activities for a specific patient (paziente) and type "Presidi"
            return Attivita.find({
                paziente: id,
                type: "Presidi",
                createdAt: { $gte: new Date().setHours(0, 0, 0, 0), $lte: new Date().setHours(23, 59, 59, 999) }
            });
        };

        // Fetch data directly if Redis is disabled or undefined
        const attivita = await getData();
        res.status(200).json(attivita);
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ Error: err.message });
    }
});




module.exports = router;
