const express = require("express");
const router = express.Router();
const Fornitori = require("../models/fornitori");
const Log = require("../models/log");
const Dipendenti = require("../models/dipendenti");

// GET all
router.get("/", async (req, res) => {
    try {
        const showOnlyCancellati = req.query.show === "deleted";
        const showAll = req.query.show === "all";

        let query = {
            $or: [{ cancellato: { $exists: false } }, { cancellato: false }],
        };

        if (showOnlyCancellati) {
            query = { cancellato: true };
        } else if (showAll) {
            query = {};
        }

        const data = await Fornitori.find(query);

        if (data && data.length > 0) {
            res.status(200).json(data);
        } else {
            res.status(404).json({ error: "No supplier found" });
        }
    } catch (err) {
        console.error("Error GET fornitori: ", err);
        res.status(500).json({ Error: err });
    }
});

// GET by ID
router.get("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        if (!id || id === "undefined") {
            console.log("Error id is not defined ", id);
            return res.status(404).json({ Error: "Id not defined" });
        }

        const query = {
            $and: [
                {
                    $or: [{ cancellato: { $exists: false } }, { cancellato: false }],
                },
                { _id: id },
            ],
        };

        const fornitoridata = await Fornitori.find(query);

        if (fornitoridata && fornitoridata.length > 0) {
            res.status(200).json(fornitoridata);
        } else {
            res.status(404).json({ error: "No supplier found" });
        }
    } catch (err) {
        console.error("Error GET fornitore by id: ", err);
        res.status(500).json({ Error: err });
    }
});

// POST
router.post("/", async (req, res) => {
    try {
        const fornitore = new Fornitori({
            cognome: req.body.cognome,
            nome: req.body.nome,
            codiceFiscale: req.body.codiceFiscale,
            dataNascita: req.body.dataNascita,
            comuneNascita: req.body.comuneNascita,
            provinciaNascita: req.body.provinciaNascita,
            indirizzoNascita: req.body.indirizzoNascita,
            sesso: req.body.sesso,
            indirizzoResidenza: req.body.indirizzoResidenza,
            comuneResidenza: req.body.comuneResidenza,
            provinciaResidenza: req.body.provinciaResidenza,
            mansione: req.body.mansione,
            tipoContratto: req.body.tipoContratto,
            telefono: req.body.telefono,
            email: req.body.email,
            dataCreazione: new Date()
        });

        const result = await fornitore.save();

        const user = res.locals.auth;
        const dipendenti = await Dipendenti.findById(user.dipendenteID);

        const log = new Log({
            data: new Date(),
            operatore: dipendenti.nome + " " + dipendenti.cognome,
            operatoreID: user.dipendenteID,
            className: "Fornitori",
            operazione: "Inserimento fornitore: " + fornitore.cognome + " " + fornitore.nome,
        });

        await log.save();

        res.status(200).json(result);

    } catch (err) {
        console.error("Error POST fornitore: ", err);
        res.status(500).json({ Error: err });
    }
});

// PUT
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || id === "undefined") {
            console.log("Error id is not defined ", id);
            return res.status(404).json({ Error: "Id not defined" });
        }

        const data = await Fornitori.updateOne(
            { _id: id },
            {
                $set: {
                    cognome: req.body.cognome,
                    nome: req.body.nome,
                    codiceFiscale: req.body.codiceFiscale,
                    dataNascita: req.body.dataNascita,
                    comuneNascita: req.body.comuneNascita,
                    provinciaNascita: req.body.provinciaNascita,
                    indirizzoNascita: req.body.indirizzoNascita,
                    indirizzoResidenza: req.body.indirizzoResidenza,
                    sesso: req.body.sesso,
                    comuneResidenza: req.body.comuneResidenza,
                    provinciaResidenza: req.body.provinciaResidenza,
                    mansione: req.body.mansione,
                    tipoContratto: req.body.tipoContratto,
                    telefono: req.body.telefono,
                    email: req.body.email,
                    dataUltimaModifica: new Date()
                },
            }
        );

        const user = res.locals.auth;
        const dipendenti = await Dipendenti.findById(user.dipendenteID);

        const log = new Log({
            data: new Date(),
            operatore: dipendenti.nome + " " + dipendenti.cognome,
            operatoreID: user.dipendenteID,
            className: "Fornitori",
            operazione: "Modifica fornitore: " + (req.body.cognome || '') + " " + (req.body.nome || ''),
        });

        await log.save();

        res.status(200).json(data);
    } catch (err) {
        console.error("Error PUT fornitore: ", err);
        res.status(500).json({ Error: err });
    }
});

// DELETE
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || id === "undefined") {
            console.log("Error id is not defined ", id);
            return res.status(404).json({ Error: "Id not defined" });
        }

        const data = await Fornitori.updateOne(
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
            className: "Fornitori",
            operazione: "Eliminazione fornitore ID: " + id,
        });

        await log.save();

        res.status(200).json(data);
    } catch (err) {
        console.error("Error DELETE fornitore: ", err);
        res.status(500).json({ Error: err });
    }
});

module.exports = router;