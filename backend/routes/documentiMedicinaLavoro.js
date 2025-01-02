const express = require("express");
const router = express.Router();
const DocMedicinaLavoro = require("../models/documentiMedicinaLavoro");
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;
const Log = require("../models/log");
const Dipendenti = require("../models/dipendenti");

router.get("/dipendente/:id", async (req, res) => {
    try {
        let id = req.params.id;
        let type = req.params.type;

        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        const query = { dipendente: id };

        const getData = () => {
            return DocMedicinaLavoro.find(query);
        };

        if (redisClient == undefined || redisDisabled) {
            const eventi = await getData();
            res.status(200).json(eventi);
            return;
        }

        const searchTerm = `documentiMedicinaLavoro${id}`;
        redisClient.get(searchTerm, async (err, data) => {
            if (err) throw err;

            if (data) {
                res.status(200).send(JSON.parse(data));
            } else {
                const documenti = await getData();
                redisClient.setex(
                    searchTerm,
                    redisTimeCache,
                    JSON.stringify(documenti)
                );
                res.status(200).json(documenti);
            }
        });

        // const fatture = await fatture.find();
        // res.status(200).json(fatture);
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ Error: err });
    }
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        const getData = () => {
            return DocMedicinaLavoro.findById(id);
        };

        if (redisClient == undefined || redisDisabled) {
            const eventi = await getData();
            res.status(200).json(eventi);
            return;
        }

        const searchTerm = `documentiMedicinaLavoro${id}`;
        redisClient.get(searchTerm, async (err, data) => {
            if (err) throw err;

            if (data) {
                res.status(200).send(JSON.parse(data));
            } else {
                const doc = await getData();
                redisClient.setex(searchTerm, redisTimeCache, JSON.stringify(doc));
                res.status(200).json(doc);
            }
        });
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

router.post("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const doc = new DocMedicinaLavoro({
            dipendente: id,
            filenameRichiesta: req.body.filenameRichiesta,
            dateuploadRichiesta: new Date(),
            noteRichiesta: req.body.noteRichiesta,
        });

        const result = await doc.save();

        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        if (redisClient != undefined && !redisDisabled) {
            redisClient.del(`documentiMedicinaLavoro${id}`);
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
            className: "DocumentiMedicinaLavoro",
            operazione: "Inserimento documento richiesta medicina del lavoro: " + doc.filenameRichiesta,
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

router.put("/documento/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const doc = await DocMedicinaLavoro.updateOne(
            { _id: id },
            {
                $set: {
                    filenameCertificato: req.body.filenameCertificato,
                    dateuploadCertificato: new Date(),
                    noteCertificato: req.body.noteCertificato,
                },
            }
        );

        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        if (redisClient != undefined && !redisDisabled) {
            redisClient.del(`documentiMedicinaLavoro${id}`);
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
            className: "DocumentiMedicinaLavoro",
            operazione: "Modifica documento richiesta medicina del lavoro: " + doc.filenameRichiesta,
        });
        console.log("log: ", log);
        const resultLog = await log.save();

        res.status(200);
        res.json(doc);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

router.delete("/documento/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const item = await DocMedicinaLavoro.findById(id);
        const idDipendente = item.dipendente;
        const doc = await DocMedicinaLavoro.remove({ _id: id });

        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        if (redisClient != undefined && !redisDisabled) {
            redisClient.del(`documentiMedicinaLavoro${id}`);
            redisClient.del(`documentiMedicinaLavoro${idDipendente}`);
        }

        res.status(200);
        res.json(doc);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

module.exports = router;
