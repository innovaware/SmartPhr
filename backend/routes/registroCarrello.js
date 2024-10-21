const express = require("express");
const router = express.Router();
const RegistroCarrello = require("../models/registroCarrello");

router.get("/", async (req, res) => {
    try {
        const getData = () => {
            return RegistroCarrello.find();
        };

        // Fetch data directly if Redis is disabled or undefined
        const attivita = await getData();
        res.status(200).json(attivita);
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ Error: err });
    }
});

router.get("/type/:type", async (req, res) => {
    try {
        const type = req.params.type;

        // Validazione del parametro
        if (!type) {
            return res.status(400).json({ Error: "Type parameter is required." });
        }

        // Recupero dei dati
        const carrello = await RegistroCarrello.find({ type }).lean(); // .lean() migliora le performance se non serve il documento Mongoose

        // Verifica se carrello è vuoto
        if (!carrello.length) {
            return res.status(404).json({ Message: "No items found for this type." });
        }

        res.status(200).json(carrello);
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ Error: "Internal Server Error" });
    }
});

router.post("/", async (req, res) => {
    try {
        console.log("Dati ricevuti per la creazione:", req.body);

        // Crea una nuova istanza di `RegistroCarrello` con i dati ricevuti
        const nuovaAttivita = new RegistroCarrello(req.body);

        // Salva il nuovo documento nel database
        const attivitaSalvata = await nuovaAttivita.save();

        // Restituisce la risorsa appena creata con stato 201
        res.status(201).json(attivitaSalvata);
    } catch (err) {
        console.error("Errore durante la creazione del registro:", err.message);
        res.status(500).json({ Error: err.message });
    }
});


module.exports = router;
