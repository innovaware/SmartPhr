const express = require("express");
const router = express.Router();
const RichiestePresidi = require("../models/richiestePresidi");


router.get("/", async (req, res) => {
    try {
        const getData = () => {
            return RichiestePresidi.find();
        };

        const richiestePresidi = await getData();
        res.status(200).json(richiestePresidi);

    } catch (err) {
        console.log(err);
        res.status(500).json({ Error: err });
    }
});


router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const getData = () => {
            return RichiestePresidi.findById(id);
        };

        const richiestePresidi = await getData();
        res.status(200).json(richiestePresidi);

    } catch (err) {
        console.log(err);
        res.status(500).json({ Error: err });
    }
});

router.get("/type/:type", async (req, res) => {
    try {
        let type = req.params.type;

        const getData = async () => {
            return await RichiestePresidi.find({
                type: type,
            });
        };

        // Fetch data from the database directly without using cache
        const richiestePresidi = await getData();
        res.status(200).json(richiestePresidi);
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ Error: err });
    }
});

router.post("/", async (req, res) => {
    try {

        const richieste = new RichiestePresidi({
            materiale: req.body.materiale,
            type: req.body.type,
            dataRichiesta: new Date(),
            status: "Richiesto",
            dipendente: req.body.dipendente,
            dipendenteName: req.body.dipendenteName,
            quantita: req.body.quantita,
            note: req.body.note,
        });

        console.log(req.body);

        const result = await richieste.save();
        
        res.status(200);
        res.json(result);

    } catch (err) {
        res.status(500);
        res.json({ "Error": err });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const requisitiId = req.params.id;
        const updateData = req.body;

        // Trova la segnalazione per ID e aggiornala
        const updatedRichiestePresidi = await RichiestePresidi.findByIdAndUpdate(requisitiId, updateData, { new: true });

        if (!updatedRichiestePresidi) {
            return res.status(404).send({ message: 'Segnalazione non trovata' });
        }

        res.send(updatedRichiestePresidi);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

module.exports = router;
