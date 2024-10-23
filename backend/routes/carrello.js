const express = require("express");
const Cart = require("../models/carrello");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const carrello = await Cart.find(); // Assumendo che "Cart" sia il modello corretto
        res.status(200).json(carrello);
    } catch (err) {
        console.error("Error: ", err.stack); // Miglior logging
        res.status(500).json({ error: err.message });
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
        const carrello = await Cart.find({ type }).lean(); // .lean() migliora le performance se non serve il documento Mongoose

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




router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const getData = () => {
            return Cart.findById(id);
        };

        const carrello = await getData();

        if (!carrello) {
          return  res.status(404).json({ Error: "Cart is not found" });
        }
        res.status(200).json(carrello);

    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        console.log("Chiamato PUT con ID:", id);
        console.log("Dati ricevuti per l'aggiornamento:", req.body);

        // Verifica se l'ID ha un formato valido (MongoDB ObjectId)
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ error: "ID non valido" });
        }

        // Esegui l'aggiornamento nel database
        const carrelloAggiornato = await Cart.updateOne(
            { _id: id },
            { $set: req.body }
        );





        // Verifica se è stato trovato e aggiornato almeno un documento
        if (carrelloAggiornato.matchedCount === 0) {
            return res.status(404).json({ message: "Nessun carrello trovato con questo ID" });
        }

        if (carrelloAggiornato.modifiedCount === 0) {
            return res.status(200).json({ message: "Nessun cambiamento apportato ai dati esistenti" });
        }

        console.log("Aggiornamento completato:", carrelloAggiornato);
        res.status(200).json({ message: "Aggiornamento riuscito", data: carrelloAggiornato });
    } catch (err) {
        console.error("Errore durante l'aggiornamento del carrello:", err);
        res.status(500).json({ error: err.message });
    }
});



module.exports = router;
