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

router.get("/armadiofarmaci", async (req, res) => {
    try {

        // Function to fetch data from MongoDB
        const getData = () => {
            return AttivitaFarmaciPresidi.find({ type: "ArmadioFarmaci" });
        };

        // Fetch data directly if Redis is disabled or undefined
        const attivita = await getData();
        res.status(200).json(attivita);
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ Error: err });
    }
});

router.get("/armadiofarmaci/paziente/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Function to fetch data from MongoDB
        const getData = () => {
            return AttivitaFarmaciPresidi.find({ $and: [{ type: "ArmadioFarmaci" }, { paziente: id }] });
        };

        // Fetch data directly
        const attivita = await getData();
        res.status(200).json(attivita);
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ Error: err.message });
    }
});


router.post("/armadiofarmaci", async (req, res) => {
    try {

        const attivitaF = new AttivitaFarmaciPresidi({
            operator: req.body.operator,
            operatorName: req.body.operatorName,
            elemento: req.body.elemento,
            elementotype: req.body.elementotype,
            elemento_id: req.body.elemento_id,
            operation: req.body.operation,
            type: "ArmadioFarmaci",
            qtyRes: req.body.qtyRes,
            dataOP: new Date(),
            qty: req.body.qty,
            paziente: req.body.paziente,
            pazienteName: req.body.pazienteName,
        });
        await attivitaF.save();
        res.status(200).json(attivitaF);
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ Error: err });
    }
});

router.post("/farmaci", async (req, res) => {
    try {

        const attivitaF = new AttivitaFarmaciPresidi({
            operator: req.body.operator,
            operatorName: req.body.operatorName,
            operation: req.body.operation,
            elemento: req.body.elemento,
            elemento_id: req.body.elemento_id,
            type: "Farmaci",
            dataOP: new Date(),
            qty: req.body.qty,
            qtyRes: req.body.qtyRes,
            paziente: req.body.paziente,
            pazienteName: req.body.pazienteName,
        });
        await attivitaF.save();
        res.status(200).json(attivitaF);
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ Error: err });
    }
});

router.post("/presidi", async (req, res) => {
    try {

        const attivitaF = new AttivitaFarmaciPresidi({
            operator: req.body.operator,
            operatorName: req.body.operatorName,
            operation: req.body.operation,
            elemento: req.body.elemento,
            elemento_id: req.body.elemento_id,
            type: "Presidi",
            dataOP: new Date(),
            qtyRes: req.body.qtyRes,
            qty: req.body.qty,
            paziente: req.body.paziente,
            pazienteName: req.body.pazienteName,
        });
        await attivitaF.save();
        res.status(200).json(attivitaF);
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ Error: err });
    }
});


module.exports = router;
