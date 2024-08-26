const express = require("express");
const TestRiabilitativo = require("../models/testRiabilitativo");


const router = express.Router();

router.get("/", async (req, res) => {
    try {
        // Function to get data from MongoDB
        const getData = () => {
            return TestRiabilitativo.find();
        };

        // Get the data from MongoDB
        const segnalazioni = await getData();

        // Send the response
        res.status(200).json(segnalazioni);
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ Error: err });
    }
});


router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        // Function to get data from MongoDB by ID
        const getData = () => {
            return TestRiabilitativo.findById(id);
        };

        // Get the data from MongoDB
        const testRiabilitativo = await getData();

        // Send the response
        res.status(200).json(testRiabilitativo);
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ Error: err });
    }
});

router.get("/paziente/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const getData = () => {
            return TestRiabilitativo.find({ paziente: id });
        };
        const testRiabilitativo = await getData();
        res.status(200).json(testRiabilitativo);
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ Error: err.message });
    }
});


router.post("/", async (req, res) => {
    try {
        const test = new TestRiabilitativo({
            data: new Date(),
            fim: req.body.fim,
            tinetti: req.body.tinetti,
            barthel: req.body.barthel,
            paziente: req.body.paziente,
        });

        const result = await test.save();

        res.status(200).json(result);

    } catch (err) {
        console.error("Errore durante il salvataggio della segnalazione:", err);
        res.status(500).json({ "Error": err.message });
    }
});

module.exports = router;