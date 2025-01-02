const express = require("express");
const router = express.Router();
const DocFarmaci = require("../models/documentiFarmaci");
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;
const Log = require("../models/log");
const Dipendenti = require("../models/dipendenti");

router.get("/", async (req, res) => {
    try {

        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        const getData = () => {
            return DocFarmaci.find();
        };

        if (redisClient == undefined || redisDisabled) {
            const documenti = await getData();
            res.status(200).json(documenti);
            return;
        }

        const searchTerm = `DOCUMENTI`;
        redisClient.get(searchTerm, async (err, asps) => {
            if (err) throw err;

            if (asps) {
                res.status(200).send(JSON.parse(asps));
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
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ Error: err });
    }
});


router.get("/paziente/:id", async (req, res) => {
    try {
        let id = req.params.id;
        let type = req.params.type;

        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        const getData = () => {
            return DocFarmaci.find({
                paziente_id: id
            });
        };

        if (redisClient == undefined || redisDisabled) {
            const eventi = await getData();
            res.status(200).json(eventi);
            return;
        }

        const searchTerm = `DOCUMENTIPAZIENTEBY${id}`;
        redisClient.get(searchTerm, async (err, asps) => {
            if (err) throw err;

            if (asps) {
                res.status(200).send(JSON.parse(asps));
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
            return DocFarmaci.find({
                paziente_id: id
            });

        };

        if (redisClient == undefined || redisDisabled) {
            const eventi = await getData();
            res.status(200).json(eventi);
            return;
        }

        const searchTerm = `DOCUMENTIPAZIENTEBY${id}`;
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
        const doc = new DocFarmaci({
            paziente_id: req.body.paziente_id,
            paziente: req.body.paziente,
            filename: req.body.filename,
            dateupload: Date.now(),
            note: req.body.note,
            type: req.body.type,
            descrizione: req.body.descrizione,
            operator_id: req.body.operator_id,
            operator: req.body.operator
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
            className: "DocumentiFarmaci",
            operazione: "Inserimento documento farmaci" + doc.filename,
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


router.post("/", async (req, res) => {
    try {
        const doc = new DocFarmaci({
            filename: req.body.filename,
            dateupload: Date.now(),
            note: req.body.note,
            type: req.body.type,
            descrizione: req.body.descrizione,
            operator_id: req.body.operator_id,
            operator: req.body.operator
        });

        const result = await doc.save();

        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        if (redisClient != undefined && !redisDisabled) {
            redisClient.del(`DOCUMENTI`);
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
            className: "DocumentiFarmaci",
            operazione: "Inserimento documento farmaci" + doc.filename,
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
        const doc = await DocFarmaci.updateOne(
            { _id: id },
            {
                $set: {
                    paziente: req.body.paziente,
                    filename: req.body.filename,
                    note: req.body.note,
                    operator_id: req.body.operator_id,
                    operator: req.body.operator
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
            className: "DocumentiFarmaci",
            operazione: "Modifica documento farmaci" + doc.filename,
        });
        console.log("log: ", log);
        const resultLog = await log.save();

        res.status(200);
        res.json(doc);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const item = await DocFarmaci.findById(id);
        console.log("item:" + item);
        const idPaziente = item.paziente;
        const doc = await DocFarmaci.remove({ _id: id });

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
            className: "DocumentiFarmaci",
            operazione: "Eliminazione documento farmaci" + doc.filename,
        });
        console.log("log: ", log);
        const resultLog = await log.save();

        res.status(200);
        res.json(doc);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});


module.exports = router;
