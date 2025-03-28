const express = require("express");
const IndumentiIngresso = require("../models/indumentiIngresso");
const Log = require("../models/log");
const Dipendenti = require("../models/dipendenti");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        // Function to get data from MongoDB
        const getData = () => {
            return IndumentiIngresso.find();
        };

        // Get the data from MongoDB
        const indumenti = await getData();

        // Send the response
        res.status(200).json(indumenti);
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
            return IndumentiIngresso.findById(id);
        };

        // Get the data from MongoDB
        const indumenti = await getData();

        // Send the response
        res.status(200).json(indumenti);
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ Error: err });
    }
});

router.get("/paziente/:id", async (req, res) => {
    const { id } = req.params;
    try {
        // Function to get data from MongoDB by ID
        const getData = () => {
            return IndumentiIngresso.find({ paziente: id });
        };

        // Get the data from MongoDB
        const indumenti = await getData();

        // Send the response
        res.status(200).json(indumenti);
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ Error: err });
    }
});


router.post("/", async (req, res) => {
    try {
        const indumenti = new IndumentiIngresso(req.body);
        console.log(req.body);

        const result = await indumenti.save();

        const user = res.locals.auth;

        const getDipendente = () => {
            return Dipendenti.findById(user.dipendenteID);
        };

        const dipendenti = await getDipendente();

        const log = new Log({
            data: new Date(),
            operatore: dipendenti.nome + " " + dipendenti.cognome,
            operatoreID: user.dipendenteID,
            className: "IndumentiIngresso",
            operazione: "Inserimento indumento: " + indumenti.nome + ". Quantita': " + indumenti.quantita + ". Paziente: " + indumenti.nomePaziente + " (" + indumenti.paziente + ")",
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


module.exports = router;