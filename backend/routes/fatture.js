const express = require("express");
const router = express.Router();
const Fatture = require("../models/fatture");
const Log = require("../models/log");
const Dipendenti = require("../models/dipendenti");

// GET fatture per ID utente/fornitore
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const fatture = await Fatture.find({
            identifyUser: id,
        });

        res.status(200).json(fatture);
    } catch (err) {
        console.error("Error GET fatture: ", err);
        res.status(500).json({ Error: err.message || err });
    }
});

// POST inserimento fattura
router.post("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || id === "undefined") {
            return res.status(400).json({ Error: "ID utente/fornitore non valido" });
        }

        const fattura = new Fatture({
            identifyUser: id,
            filename: req.body.filename,
            typology: req.body.typology,
            dateupload: Date.now(),
            note: req.body.note,
        });

        console.log("Insert fattura: ", fattura);

        const result = await fattura.save();

        // Gestione Cache Redis
        const redisClient = req.app.get("redis");
        const redisDisabled = req.app.get("redisDisabled");

        if (redisClient && !redisDisabled) {
            const searchTerm = `fatture${id}`;
            redisClient.del(searchTerm);
        }

        // Gestione sicura Log Operatore
        const user = res.locals ? res.locals.auth : null;
        let operatoreNome = "Sistema";
        let operatoreID = null;

        if (user && user.dipendenteID) {
            const dipendenti = await Dipendenti.findById(user.dipendenteID);
            if (dipendenti) {
                operatoreNome = `${dipendenti.nome} ${dipendenti.cognome}`;
                operatoreID = user.dipendenteID;
            }
        }

        const log = new Log({
            data: new Date(),
            operatore: operatoreNome,
            operatoreID: operatoreID,
            className: "Fatture",
            operazione: "Inserimento fattura: " + (fattura.filename || ""),
        });

        await log.save();

        res.status(200).json(result);
    } catch (err) {
        console.error("Error POST fattura: ", err);
        res.status(500).json({ Error: err.message || err });
    }
});

// PUT modifica fattura
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const fatturaAggiornata = await Fatture.updateOne(
            { _id: id },
            {
                $set: {
                    identifyUser: req.body.identifyUser,
                    filename: req.body.filename,
                    typology: req.body.typology,
                    note: req.body.note,
                },
            }
        );

        const redisClient = req.app.get("redis");
        const redisDisabled = req.app.get("redisDisabled");

        if (redisClient && !redisDisabled) {
            const searchTerm = `fattureBY${id}`;
            redisClient.del(searchTerm);
        }

        // Gestione sicura Log Operatore
        const user = res.locals ? res.locals.auth : null;
        let operatoreNome = "Sistema";
        let operatoreID = null;

        if (user && user.dipendenteID) {
            const dipendenti = await Dipendenti.findById(user.dipendenteID);
            if (dipendenti) {
                operatoreNome = `${dipendenti.nome} ${dipendenti.cognome}`;
                operatoreID = user.dipendenteID;
            }
        }

        const log = new Log({
            data: new Date(),
            operatore: operatoreNome,
            operatoreID: operatoreID,
            className: "Fatture",
            operazione: "Modifica fattura: " + (req.body.filename || ""),
        });

        await log.save();

        res.status(200).json(fatturaAggiornata);
    } catch (err) {
        console.error("Error PUT fattura: ", err);
        res.status(500).json({ Error: err.message || err });
    }
});

// DELETE eliminazione fattura
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const item = await Fatture.findById(id);
        if (!item) {
            return res.status(404).json({ Error: "Fattura non trovata" });
        }

        const identifyUser = item.identifyUser;
        const filename = item.filename;

        const resultDelete = await Fatture.deleteOne({ _id: id });

        const redisClient = req.app.get("redis");
        const redisDisabled = req.app.get("redisDisabled");

        if (redisClient && !redisDisabled) {
            redisClient.del(`fattureBY${id}`);
            redisClient.del(`fatture${identifyUser}`);
        }

        // Gestione sicura Log Operatore
        const user = res.locals ? res.locals.auth : null;
        let operatoreNome = "Sistema";
        let operatoreID = null;

        if (user && user.dipendenteID) {
            const dipendenti = await Dipendenti.findById(user.dipendenteID);
            if (dipendenti) {
                operatoreNome = `${dipendenti.nome} ${dipendenti.cognome}`;
                operatoreID = user.dipendenteID;
            }
        }

        const log = new Log({
            data: new Date(),
            operatore: operatoreNome,
            operatoreID: operatoreID,
            className: "Fatture",
            operazione: "Eliminazione fattura: " + (filename || ""),
        });

        await log.save();

        res.status(200).json(resultDelete);
    } catch (err) {
        console.error("Error DELETE fattura: ", err);
        res.status(500).json({ Error: err.message || err });
    }
});

module.exports = router;