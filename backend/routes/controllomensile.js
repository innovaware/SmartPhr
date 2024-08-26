const express = require("express");
const ControlloMensile = require("../models/controllomensile");


const router = express.Router();

router.get("/", async (req, res) => {
    try {
        // Function to get data from MongoDB
        const getData = () => {
            return ControlloMensile.find();
        };

        // Get the data from MongoDB
        const ControlliMensili = await getData();

        // Send the response
        res.status(200).json(ControlliMensili);
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ Error: err });
    }
});

router.get("/type/:type", async (req, res) => {
    try {
        let type = req.params.type;

        const getData = async () => {
            return await ControlloMensile.find({
                tipologia: type,
            });
        };
        const controlloMensile = await getData();
        res.status(200).json(controlloMensile);
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
            return ControlloMensile.findById(id);
        };

        // Get the data from MongoDB
        const ControlliMensili = await getData();

        // Send the response
        res.status(200).json(ControlliMensili);
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ Error: err });
    }
});

router.post("/", async (req, res) => {
    try {
        console.log("Dentro il route handler POST /");
        console.log("Body della richiesta:", req.body);

        const controlloMensile = new ControlloMensile({
            utenteNome: req.body.utenteNome,
            utente: req.body.utente,
            tipologia: req.body.tipologia,
            dataControllo: req.body.dataControllo,
            esitoPositivo: req.body.esitoPositivo,
            note: req.body.note
        });

        console.log("Dati della controlloMensile:", controlloMensile);

        const result = await controlloMensile.save();

        res.status(200).json(result);

    } catch (err) {
        console.error("Errore durante il salvataggio della segnalazione:", err);
        res.status(500).json({ "Error": err.message });
    }
});


module.exports = router;