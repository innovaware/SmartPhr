const express = require("express");
const router = express.Router();
const DocPaziente = require("../models/documentiPazienti");
const Log = require("../models/log");
const Dipendenti = require("../models/dipendenti");

router.get("/paziente/:id/:type", async (req, res) => {
    try {
        let id = req.params.id;
        let type = req.params.type;

        console.log('GET DOCS(id): ' + id);
        console.log('GET DOCS(type): ' + type);

        const documenti = await DocPaziente.find({
            $and: [
                { paziente: id },
                { type: type },
                {
                    $or: [{ cancellato: { $exists: false } }, { cancellato: false }],
                },
            ],
        });

        console.log("documenti: ", documenti);
        res.status(200).json(documenti);
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ Error: err });
    }
});

router.get("/pazienteingresso/:id", async (req, res) => {
    try {
        let id = req.params.id;

        const eventi = await DocPaziente.find({
            paziente: id,
            type: "ingresso",
        });

        res.status(200).json(eventi);
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ Error: err });
    }
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const eventi = await DocPaziente.findById(id);
        res.status(200).json(eventi);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

router.post("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const doc = new DocPaziente({
            paziente: id,
            filename: req.body.filename,
            dateupload: Date.now(),
            note: req.body.note,
            type: req.body.type,
            typeDocument: req.body.typeDocument,
            descrizione: req.body.descrizione,
            filenameesito: req.body.filenameesito,
        });

        const result = await doc.save();
        const user = res.locals.auth;

        const dipendenti = await Dipendenti.findById(user.dipendenteID);

        const log = new Log({
            data: new Date(),
            operatore: dipendenti.nome + " " + dipendenti.cognome,
            operatoreID: user.dipendenteID,
            className: "DocumentiPazienti",
            operazione: "Inserimento documento paziente: " + doc.filename,
        });
        console.log("log: ", log);
        await log.save();

        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const doc = await DocPaziente.updateOne(
            { _id: id },
            {
                $set: {
                    paziente: req.body.paziente,
                    filename: req.body.filename,
                    filenameesito: req.body.filenameesito,
                    note: req.body.note,
                },
            }
        );

        const user = res.locals.auth;

        const dipendenti = await Dipendenti.findById(user.dipendenteID);

        const log = new Log({
            data: new Date(),
            operatore: dipendenti.nome + " " + dipendenti.cognome,
            operatoreID: user.dipendenteID,
            className: "DocumentiPazienti",
            operazione: "Modifica documento paziente: " + doc.filename,
        });
        console.log("log: ", log);
        await log.save();

        res.status(200).json(doc);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

router.delete("/documento/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const item = await DocPaziente.findById(id);
        console.log("item:" + item);
        const doc = await DocPaziente.remove({ _id: id });

        const user = res.locals.auth;

        const dipendenti = await Dipendenti.findById(user.dipendenteID);

        const log = new Log({
            data: new Date(),
            operatore: dipendenti.nome + " " + dipendenti.cognome,
            operatoreID: user.dipendenteID,
            className: "DocumentiPazienti",
            operazione: "Eliminazione documento paziente: " + doc.filename,
        });
        console.log("log: ", log);
        await log.save();

        res.status(200).json(doc);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

// AUTORIZZAZIONE USCITA

router.get("/autorizzazioneUscita/all", async (req, res) => {
    try {
        const eventi = await DocPaziente.find({
            $and: [
                { type: "AutorizzazioneUscita" },
                {
                    $or: [{ cancellato: { $exists: false } }, { cancellato: false }],
                },
            ],
        });

        res.status(200).json(eventi);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

router.get("/autorizzazioneUscita/:id", async (req, res) => {
    const { id } = req.params;
    try {
        if (id == undefined || id === "undefined") {
            console.log("Error id is not defined ", id);
            res.status(404).json({ Error: "Id not defined" });
            return;
        }

        const eventi = await DocPaziente.find({
            $and: [
                { paziente: id },
                { type: "AutorizzazioneUscita" },
                {
                    $or: [{ cancellato: { $exists: false } }, { cancellato: false }],
                },
            ],
        });

        res.status(200).json(eventi);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

router.post("/autorizzazioneUscita/:id", async (req, res) => {
    try {
        console.log("Autorizzazione uscita insert");
        const { id } = req.params;
        const doc = new DocPaziente({
            paziente: id,
            filename: req.body.filename,
            dateupload: Date.now(),
            note: req.body.note,
            type: "AutorizzazioneUscita",
            cancellato: false,
            dataCancellazione: undefined,
            descrizione: undefined,
        });

        console.log("Insert doc: ", doc);
        await doc.save();

        const user = res.locals.auth;

        const dipendenti = await Dipendenti.findById(user.dipendenteID);

        const log = new Log({
            data: new Date(),
            operatore: dipendenti.nome + " " + dipendenti.cognome,
            operatoreID: user.dipendenteID,
            className: "DocumentiAutorizzazioneUscitaPazienti",
            operazione: "Inserimento documento Autorizzazione Uscita: " + doc.filename,
        });
        console.log("log: ", log);
        await log.save();

        res.status(200).json(doc);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

router.delete("/autorizzazioneUscita/:id", async (req, res) => {
    try {
        console.log("Delete Autorizzazione Uscita");
        const { id } = req.params;
        if (id == undefined || id === "undefined") {
            console.log("Error id is not defined ", id);
            res.status(404).json({ Error: "Id not defined" });
            return;
        }

        if (id == null) {
            res.status(400).json({ error: "id not valid" });
            return;
        }

        const pazienti = await DocPaziente.updateOne(
            { _id: id },
            {
                $set: {
                    cancellato: true,
                    dataCancellazione: new Date(),
                },
            }
        );

        const user = res.locals.auth;

        const dipendenti = await Dipendenti.findById(user.dipendenteID);

        const log = new Log({
            data: new Date(),
            operatore: dipendenti.nome + " " + dipendenti.cognome,
            operatoreID: user.dipendenteID,
            className: "DocumentiAutorizzazioneUscitaPazienti",
            operazione: "Eliminazione documento Autorizzazione Uscita",
        });
        console.log("log: ", log);
        await log.save();

        res.status(200).json(pazienti);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

/// ESITO STRUMENTALE
router.get("/esitoStrumentale/all", async (req, res) => {
    try {
        const query = {
            $and: [
                { type: "EsitoStrumentale" },
                {
                    $or: [{ cancellato: { $exists: false } }, { cancellato: false }],
                },
            ],
        };

        const pazienti = await DocPaziente.find(query);
        res.status(200).json(pazienti);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

router.get("/esitoStrumentale/:id", async (req, res) => {
    const { id } = req.params;
    try {
        if (id == undefined || id === "undefined") {
            console.log("Error id is not defined ", id);
            res.status(404).json({ Error: "Id not defined" });
            return;
        }

        console.log("GET Esito Strumentale. Id: ", id);

        const query = {
            $and: [
                { paziente: id },
                { type: "EsitoStrumentale" },
                {
                    $or: [{ cancellato: { $exists: false } }, { cancellato: false }],
                },
            ],
        };

        const pazienti = await DocPaziente.find(query);
        res.status(200).json(pazienti);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

router.post("/esitoStrumentale/:id", async (req, res) => {
    try {
        console.log("Esito strumentale insert");
        const { id } = req.params;
        const doc = new DocPaziente({
            paziente: id,
            filename: req.body.filename,
            dateupload: Date.now(),
            note: req.body.note,
            type: "EsitoStrumentale",
            typeDocument: req.body.typeDocument,
            cancellato: false,
            dataCancellazione: undefined,
            descrizione: undefined,
        });

        await doc.save();

        const user = res.locals.auth;

        const dipendenti = await Dipendenti.findById(user.dipendenteID);

        const log = new Log({
            data: new Date(),
            operatore: dipendenti.nome + " " + dipendenti.cognome,
            operatoreID: user.dipendenteID,
            className: "DocumentiEsitoStrumentalePazienti",
            operazione: "Inserimento documento Esito Strumentale: " + doc.filename,
        });
        console.log("log: ", log);
        await log.save();

        res.status(200).json(doc);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

router.delete("/esitoStrumentale/:id", async (req, res) => {
    try {
        console.log("Delete Esito strumentale Uscita");
        const { id } = req.params;
        if (id == undefined || id === "undefined") {
            console.log("Error id is not defined ", id);
            res.status(404).json({ Error: "Id not defined" });
            return;
        }

        if (id == null) {
            res.status(400).json({ error: "id not valid" });
            return;
        }

        const pazienti = await DocPaziente.updateOne(
            { _id: id },
            {
                $set: {
                    cancellato: true,
                    dataCancellazione: new Date(),
                },
            }
        );

        const user = res.locals.auth;

        const dipendenti = await Dipendenti.findById(user.dipendenteID);

        const log = new Log({
            data: new Date(),
            operatore: dipendenti.nome + " " + dipendenti.cognome,
            operatoreID: user.dipendenteID,
            className: "DocumentiEsitoStrumentalePazienti",
            operazione: "Eliminazione documento Esito Strumentale",
        });
        console.log("log: ", log);
        await log.save();

        res.status(200).json(pazienti);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

// REFERTO EMATOCHIMICO

router.get("/refertoEmatochimico/all", async (req, res) => {
    try {
        const pazienti = await DocPaziente.find({
            $and: [
                { type: "RefertoEsameEmatochimico" },
                {
                    $or: [{ cancellato: { $exists: false } }, { cancellato: false }],
                },
            ],
        });

        res.status(200).json(pazienti);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

// Filtro

router.get("/documentoType/:type", async (req, res) => {
    const { type } = req.params;
    try {
        const query = {
            $and: [
                { type: type },
                {
                    $or: [{ cancellato: { $exists: false } }, { cancellato: false }],
                },
            ],
        };

        const pazienti = await DocPaziente.find(query);

        if (pazienti != null) {
            res.status(200).json(pazienti);
        } else {
            res.status(404).json({ error: "No patient found" });
        }
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

module.exports = router;