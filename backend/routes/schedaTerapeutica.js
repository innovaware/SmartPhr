const express = require("express");
const router = express.Router();
const SchedaTer = require("../models/schedaTerapeutica");

router.get("/", async (req, res) => {
    try {
        const scheda = await SchedaTer.find();
        res.status(200).json(scheda);
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ Error: err });
    }
});



// http://[HOST]:[PORT]/api/schedaTerapeutica/[ID]
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const scheda = await SchedaTer.findById(id);
        if (!scheda) {
            res.status(404).json({ Error: "Id not defined" });;
        }
        res.status(200).json(scheda);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});


// http://[HOST]:[PORT]/api/schedaTerapeutica/[ID]
router.get("/paziente/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const scheda = await SchedaTer.find({ idPaziente : id });
        if (!scheda) {
            res.status(404).json({ Error: "Paziente is not found " });;
        }
        res.status(200).json(scheda);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

// http://[HOST]:[PORT]/api/schedaTerapeutica (POST)
// INSERT schedaTerapeutica su DB
router.post("/", async (req, res) => {
    try {
        const scheda = new SchedaTer(req.body);

        // Salva i dati sul mongodb
        const result = await scheda.save();
        
        res.status(200);
        res.json(result);
    } catch (err) {
        res.status(500);
        res.json({ Error: err });
    }
});

// http://[HOST]:[PORT]/api/SchedaTerapeutica/[ID]
// Modifica della SchedaTerapeutica
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        // Aggiorna il documento su mongodb
        const scheda = await SchedaTer.updateOne(
            { _id: id }, { $set: req.body }
        );

        res.status(200).json(scheda);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});


module.exports = router;
