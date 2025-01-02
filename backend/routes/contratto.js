const express = require("express");
const router = express.Router();
const Contratto = require("../models/contratto");
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;
const Log = require("../models/log");
const Dipendenti = require("../models/dipendenti");

router.get("/consulente/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Function to get data from the database
        const getData = () => {
            return Contratto.find({
                idConsulente: id,
            });
        };

        // Fetch data from the database
        const contratti = await getData();

        // Send the data in the response
        res.status(200).json(contratti);
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ Error: err.message });
    }
});



router.get("/", async (req, res) => {
    try {
        const getData = () => {
            return Contratto.find();
        };

        const contratti = await getData();
        res.status(200).json(contratti);
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
            return Contratto.findById(id);
        };

        if (redisClient == undefined || redisDisabled) {
            const eventi = await getData();
            res.status(200).json(eventi);
            return;
        }

        const searchTerm = `CONTRATTOBY${id}`;
        redisClient.get(searchTerm, async (err, data) => {
            if (err) throw err;

            if (data) {
                res.status(200).send(JSON.parse(data));
            } else {
                const contratto = await getData();
                redisClient.setex(searchTerm, redisTimeCache, JSON.stringify(contratto));
                res.status(200).json(contratto);
            }
        });
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

router.post("/consulente/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const contratto = new Contratto({
            idConsulente: id,
            consulenteNome: req.body.consulenteNome,
            filename: req.body.filename,
            dateupload: Date.now(),
            dataScadenza: req.body.dataScadenza,
            note: req.body.note,
        });

        console.log("Insert contratto: ", contratto);

        const result = await contratto.save();

        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");
        if (redisClient != undefined && !redisDisabled) {
            redisClient.del(`CONTRATTOCONSULENTE${id}`);
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
            className: "Contratto",
            operazione: "Inserimento contratto del consulente: " + contratto.consulenteNome,
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
        const contratto = await Contratto.updateOne(
            { _id: id },
            {
                $set: {
                    idConsulente: req.body.pazienteID,
                    filename: req.body.filename,
                    consulenteNome: req.body.consulenteNome,
                    note: req.body.note,
                    dataScadenza: req.body.dataScadenza,
                },
            }
        );

        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");
        if (redisClient != undefined && !redisDisabled) {
            redisClient.del(`CONTRATTOBY${id}`);
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
            className: "Contratto",
            operazione: "Modifica contratto del consulente: " + contratto.consulenteNome,
        });
        console.log("log: ", log);
        const resultLog = await log.save();

        res.status(200).json(contratto);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const item = await Contratto.findById(id);
        const idConsulente = item.idConsulente;
        const contratto = await Contratto.remove({ _id: id });

        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");
        if (redisClient != undefined && !redisDisabled) {
            redisClient.del(`CONTRATTOBY${id}`);
            redisClient.del(`CONTRATTOCONSULENTE${idConsulente}`);
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
            className: "Contratto",
            operazione: "Eliminazione contratto del consulente: " + contratto.consulenteNome,
        });
        console.log("log: ", log);
        const resultLog = await log.save();

        res.status(200).json(contratto);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

module.exports = router;
