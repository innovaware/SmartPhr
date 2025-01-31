const express = require("express");
const router = express.Router();
const DocPaziente = require("../models/documentiPazienti");
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;
const Log = require("../models/log");
const Dipendenti = require("../models/dipendenti");

router.get("/paziente/:id/:type", async (req, res) => {
    try {
        let id = req.params.id;
        let type = req.params.type;

        console.log('GET DOCS(id): ' + id);
        console.log('GET DOCS(type): ' + type);

        const getData = () => {
            return DocPaziente.find({
                $and: [
                    { paziente: id },
                    { type: type },
                    {
                        $or: [{ cancellato: { $exists: false } }, { cancellato: false }],
                    },
                ],
            });
        };

        const documenti = await getData();
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

        const getData = () => {
            return DocPaziente.find({
                paziente: id,
                type: "ingresso",
            });
        };

        const eventi = await getData();
        res.status(200).json(eventi);
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ Error: err });
    }
});




router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const getData = () => {
            return DocPaziente.findById(id);
        };

        const eventi = await getData();
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

        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        if (redisClient != undefined && !redisDisabled) {
            redisClient.del(`DOCUMENTIPAZIENTEBY${id}`);
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
            className: "DocumentiPazienti",
            operazione: "Inserimento documento paziente: " + doc.filename,
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

        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        if (redisClient != undefined && !redisDisabled) {
            redisClient.del(`DOCUMENTIPAZIENTEBY${id}`);
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
            className: "DocumentiPazienti",
            operazione: "Modifica documento paziente: " + doc.filename,
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

        const item = await DocPaziente.findById(id);
        console.log("item:" + item);
        const idPaziente = item.paziente;
        const doc = await DocPaziente.remove({ _id: id });

        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        if (redisClient != undefined && !redisDisabled) {
            redisClient.del(`DOCUMENTIPAZIENTE*`);
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
            className: "DocumentiPazienti",
            operazione: "Eliminazione documento paziente: " + doc.filename,
        });
        console.log("log: ", log);
        const resultLog = await log.save();

        res.status(200);
        res.json(doc);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

// AUTORIZZAZIONE USCITA

router.get("/autorizzazioneUscita/all", async (req, res) => {
    try {
        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        const getData = () => {
            return DocPaziente.find({
                $and: [
                    { type: "AutorizzazioneUscita" },
                    {
                        $or: [{ cancellato: { $exists: false } }, { cancellato: false }],
                    },
                ],
            });
        };

        if (redisClient == undefined || redisDisabled) {
            const eventi = await getData();
            res.status(200).json(eventi);
            return;
        }

        const searchTerm = `AUTORIZZAZIONE_USCITA`;
        redisClient.get(searchTerm, async (err, data) => {
            if (err) throw err;

            if (data) {
                res.status(200).send(JSON.parse(data));
            } else {
                const pazienti = await getData();
                redisClient.setex(searchTerm, redisTimeCache, JSON.stringify(pazienti));
                if (pazienti != null) res.status(200).json(pazienti);
                else res.status(404).json({ error: "No patient found" });
            }
        });
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

        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        const getData = () => {
            return DocPaziente.find({
                $and: [
                    { paziente: id },
                    { type: "AutorizzazioneUscita" },
                    {
                        $or: [{ cancellato: { $exists: false } }, { cancellato: false }],
                    },
                ],
            });
        };

        if (redisClient == undefined || redisDisabled) {
            const eventi = await getData();
            res.status(200).json(eventi);
            return;
        }

        const searchTerm = `AUTORIZZAZIONE_USCITA_BY${id}`;
        redisClient.get(searchTerm, async (err, data) => {
            if (err) throw err;

            if (data && !redisDisabled) {
                res.status(200).send(JSON.parse(data));
            } else {
                const pazienti = await getData();
                redisClient.setex(searchTerm, redisTimeCache, JSON.stringify(pazienti));
                if (pazienti != null) res.status(200).json(pazienti);
                else res.status(404).json({ error: "No patient found" });
            }
        });
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

router.post("/autorizzazioneUscita/:id", async (req, res) => {
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
    const result = await doc.save();
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
        redisClient.del(`AUTORIZZAZIONE_USCITA_BY${id}`);
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
        className: "DocumentiAutorizzazioneUscitaPazienti",
        operazione: "Inserimento documento Autorizzazione Uscita: " + doc.filename,
    });
    console.log("log: ", log);
    const resultLog = await log.save();

    res.status(200);
    res.json(doc);
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
        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        if (redisClient != undefined && !redisDisabled) {
            redisClient.del(`AUTORIZZAZIONE_USCITA*`);
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
            className: "DocumentiAutorizzazioneUscitaPazienti",
            operazione: "Eliminazione documento Autorizzazione Uscita: " + doc.filename,
        });
        console.log("log: ", log);
        const resultLog = await log.save();

        res.status(200);
        res.json(pazienti);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

/// ESITO STRUMENTALE
router.get("/esitoStrumentale/all", async (req, res) => {
    try {
        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        const getData = (query) => {
            return DocPaziente.find(query);
        };

        if (redisClient == undefined || redisDisabled) {
            const eventi = await getData();
            res.status(200).json(eventi);
            return;
        }

        const searchTerm = `ESITO_STRUMENTALE`;
        redisClient.get(searchTerm, async (err, data) => {
            if (err) throw err;

            if (data) {
                res.status(200).send(JSON.parse(data));
            } else {
                const query = {
                    $and: [
                        { type: "EsitoStrumentale" },
                        {
                            $or: [{ cancellato: { $exists: false } }, { cancellato: false }],
                        },
                    ],
                };

                const pazienti = await getData(query);
                redisClient.setex(searchTerm, redisTimeCache, JSON.stringify(pazienti));
                if (pazienti != null) res.status(200).json(pazienti);
                else res.status(404).json({ error: "No patient found" });
            }
        });
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
        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        const getData = (query) => {
            return DocPaziente.find(query);
        };

        if (redisClient == undefined || redisDisabled) {
            const eventi = await getData();
            res.status(200).json(eventi);
            return;
        }

        const searchTerm = `ESITO_STRUMENTALE_BY${id}`;
        redisClient.get(searchTerm, async (err, data) => {
            if (err) throw err;

            if (data && !redisDisabled) {
                res.status(200).send(JSON.parse(data));
            } else {
                const query = {
                    $and: [
                        { paziente: id },
                        { type: "EsitoStrumentale" },
                        {
                            $or: [{ cancellato: { $exists: false } }, { cancellato: false }],
                        },
                    ],
                };

                const pazienti = await getData(query);
                redisClient.setex(searchTerm, redisTimeCache, JSON.stringify(pazienti));
                if (pazienti != null) res.status(200).json(pazienti);
                else res.status(404).json({ error: "No patient found" });
            }
        });
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

router.post("/esitoStrumentale/:id", async (req, res) => {
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

    const result = await doc.save();

    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
        redisClient.del(`ESITO_STRUMENTALE_BY${id}`);
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
        className: "DocumentiEsitoStrumentalePazienti",
        operazione: "Inserimento documento Esito Strumentale: " + doc.filename,
    });
    console.log("log: ", log);
    const resultLog = await log.save();

    res.status(200);
    res.json(doc);
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
        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        if (redisClient != undefined && !redisDisabled) {
            redisClient.del(`ESITO_STRUMENTALE*`);
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
            className: "DocumentiEsitoStrumentalePazienti",
            operazione: "Eliminazione documento Esito Strumentale: " + doc.filename,
        });
        console.log("log: ", log);
        const resultLog = await log.save();

        res.status(200);
        res.json(pazienti);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

// REFERTO EMATOCHIMICO

router.get("/refertoEmatochimico/all", async (req, res) => {
    try {
        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        const getData = () => {
            return DocPaziente.find({
                $and: [
                    { type: "RefertoEsameEmatochimico" },
                    {
                        $or: [{ cancellato: { $exists: false } }, { cancellato: false }],
                    },
                ],
            });
        };

        if (redisClient == undefined || redisDisabled) {
            const eventi = await getData();
            res.status(200).json(eventi);
            return;
        }

        const searchTerm = `REFERTO_EMATOCHIMICO`;
        redisClient.get(searchTerm, async (err, data) => {
            if (err) throw err;

            if (data) {
                res.status(200).send(JSON.parse(data));
            } else {
                const pazienti = await getData();
                redisClient.setex(searchTerm, redisTimeCache, JSON.stringify(pazienti));
                if (pazienti != null) res.status(200).json(pazienti);
                else res.status(404).json({ error: "No patient found" });
            }
        });
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

// Filtro

router.get("/documentoType/:type", async (req, res) => {
    const { type } = req.params;
    try {
        const getData = (query) => {
            return DocPaziente.find(query);
        };

        const query = {
            $and: [
                { type: type },
                {
                    $or: [{ cancellato: { $exists: false } }, { cancellato: false }],
                },
            ],
        };

        const pazienti = await getData(query);

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
