const express = require("express");
const router = express.Router();
const PuliziaAmbiente = require("../models/puliziaAmbiente");
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;
const Log = require("../models/log");
const Dipendenti = require("../models/dipendenti");

/**
 * Ritorna tutti gli elementi della collection 
*/
router.get("/", async (req, res) => {
    const { id } = req.params;
    try {
        const getData = () => {
            return PuliziaAmbiente.find();
        };

        const puliziaAmbiente = await getData();
        res.status(200).json(puliziaAmbiente);

    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

/**
 * Ricerca un elemento per identificativo
*/
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const getData = () => {
            return PuliziaAmbiente.findById(id);
        };

        const puliziaAmbiente = await getData();
        res.status(200).json(puliziaAmbiente);

    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

/**
 * Modifica un elemento usando id per identificarlo
*/
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const puliziaAmbiente = await PuliziaAmbiente.updateOne(
            { _id: id },
            {
                $set: {
                    idCamera: req.body.idCamera,
                    statoPulizia: req.body.statoPulizia,
                    data: req.body.data,
                    idUser: req.body.idUser,
                    descrizione: req.body.descrizione
                },
            }
        );

        console.log("Update pulizia Ambiente:", puliziaAmbiente);

        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        if (redisClient != undefined && !redisDisabled) {
            const searchTerm = "PULIZIAAMBIENTEALL*";
            redisClient.del(searchTerm);
        }

        const user = res.locals.auth;

        const getDipendente = () => {
            return Dipendenti.findById(user.dipendenteID);
        };

        const dipendenti = await getDipendente();

        const log = new Log({
            data: new Date(),
            operatore: dipendenti.nome + " " + dipendenti.cognome,
            operatoreID: user.dipendenteID,
            className: "PuliziaAmbiente",
            operazione: "Modifica pulizia ambiente ",
        });
        console.log("log: ", log);
        const resultLog = await log.save();

        res.status(200);
        res.json(camera);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

/**
 * Inserimento elemento
 */
router.post("/", async (req, res) => {
    try {
        const puliziaAmbiente = new PuliziaAmbiente({
            idCamera: req.body.idCamera,
            statoPulizia: req.body.statoPulizia,
            data: req.body.data,
            idUser: req.body.idUser,
            descrizione: req.body.descrizione
        });

        // Salva i dati sul mongodb
        const result = await puliziaAmbiente.save();

        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        if (redisClient != undefined && !redisDisabled) {
            redisClient.del(`PULIZIAAMBIENTE*`);
        }

        const user = res.locals.auth;

        const getDipendente = () => {
            return Dipendenti.findById(user.dipendenteID);
        };

        const dipendenti = await getDipendente();

        const log = new Log({
            data: new Date(),
            operatore: dipendenti.nome + " " + dipendenti.cognome,
            operatoreID: user.dipendenteID,
            className: "PuliziaAmbiente",
            operazione: "Inserimento pulizia ambiente ",
        });
        console.log("log: ", log);
        const resultLog = await log.save();

        res.status(200);
        res.json(result);
    } catch (err) {
        res.status(500);
        res.json({ Error: err });
    }
});

/**
 * Elimina un elemento
*/
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const puliziaAmbiente = await PuliziaAmbiente.remove({ _id: id });

        if (redisClient != undefined && !redisDisabled) {
            redisClient.del(`PULIZIAAMBIENTE*`);
        }

        const user = res.locals.auth;

        const getDipendente = () => {
            return Dipendenti.findById(user.dipendenteID);
        };

        const dipendenti = await getDipendente();

        const log = new Log({
            data: new Date(),
            operatore: dipendenti.nome + " " + dipendenti.cognome,
            operatoreID: user.dipendenteID,
            className: "PuliziaAmbiente",
            operazione: "Eliminazione pulizia ambiente ",
        });
        console.log("log: ", log);
        const resultLog = await log.save();

        res.status(200);
        res.json(puliziaAmbiente);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

/** */
module.exports = router;
