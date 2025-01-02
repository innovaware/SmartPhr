const express = require("express");
const router = express.Router();
const DocumentiFornitore = require("../models/documentifornitore");
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;
const Log = require("../models/log");
const Dipendenti = require("../models/dipendenti");

async function getDocumentiFornitoreByIdFornitore(req, res) {
    try {
        const { id } = req.params;
        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        const getData = () => {
            return DocumentiFornitore.find({
                fornitore: id,
            });
        };

        if (redisClient == undefined || redisDisabled) {
            const eventi = await getData();
            res.status(200).json(eventi);
            return;
        }

        const searchTerm = `documentiFornitore${id}`;
        redisClient.get(searchTerm, async (err, data) => {
            if (err) throw err;

            if (data) {
                //console.log(`${searchTerm}: ${data}`);
                res.status(200).send(JSON.parse(data));
            } else {
                const documentiFornitore = await getData();
                redisClient.setex(
                    searchTerm,
                    redisTimeCache,
                    JSON.stringify(documentiFornitore)
                );
                console.log("Add caching: ", searchTerm);

                res.status(200).json(documentiFornitore);
            }
        });

        // const bonifici = await bonifici.find();
        // res.status(200).json(bonifici);
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ Error: err });
    }
}

async function getDocumentoFornitoreById(req, res) {
    const { id } = req.params;
    try {
        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        const getData = () => {
            return DocumentiFornitore.findById(id);
        };

        if (redisClient == undefined || redisDisabled) {
            const eventi = await getData();
            res.status(200).json(eventi);
            return;
        }

        const searchTerm = `documentiFornitoreBY${id}`;
        redisClient.get(searchTerm, async (err, data) => {
            if (err) throw err;

            if (data) {
                res.status(200).send(JSON.parse(data));
            } else {
                const documentiFornitore = await getData();
                redisClient.setex(searchTerm, redisTimeCache, JSON.stringify(documentiFornitore));
                console.log("Add caching: ", searchTerm);

                res.status(200).json(documentiFornitore);
            }
        });
    } catch (err) {
        res.status(500).json({ Error: err });
    }
}

async function insertDocumentoFornitoreByFornitoreId(req, res) {
    console.log("Insert documento 2 ");
    try {
        const { id } = req.params;
        const documentiFornitore = new DocumentiFornitore({
            fornitore: id,
            filename: req.body.filename,
            dateupload: Date.now(),
            note: req.body.note,
        });

        console.log("Insert documentiFornitore: ", documentiFornitore);

        const result = await documentiFornitore.save();
        redisclient = req.app.get("redis");
        redisdisabled = req.app.get("redisdisabled");

        if (redisclient != undefined && !redisdisabled) {
            redisclient.del(`documentiFornitore${id}`);
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
            className: "DocumentoFornitore",
            operazione: "Inserimento documento fornitore " + documentiFornitore.filename,
        });
        console.log("log: ", log);
        const resultLog = await log.save();

        res.status(200);
        res.json(result);
    } catch (err) {
        res.status(500);
        res.json({ Error: err });
    }
}

async function modifyDocumentoFornitoreByFornitoreId(req, res) {
    try {
        const { id } = req.params;
        const documentiFornitore = await DocumentiFornitore.updateOne(
            { _id: id },
            {
                $set: {
                    fornitore: req.body.pazienteID,
                    filename: req.body.filename,
                    note: req.body.note,
                },
            }
        );

        redisclient = req.app.get("redis");
        redisdisabled = req.app.get("redisdisabled");

        if (redisclient != undefined && !redisdisabled) {
            redisclient.del(`documentifornitoreby${id}`);
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
            className: "DocumentoFornitore",
            operazione: "Modifica documento fornitore " + documentiFornitore.filename,
        });
        console.log("log: ", log);
        const resultLog = await log.save();

        res.status(200);
        res.json(documentiFornitore);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
}

async function deleteDocumentoFornitore(req, res) {
    try {
        const { id } = req.params;

        const documentiFornitore_item = await DocumentiFornitore.findById(id);
        const idFornitore = documentiFornitore_item.fornitore;

        const documentiFornitore = await DocumentiFornitore.remove({ _id: id });

        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        if (redisClient != undefined && !redisDisabled) {
            redisClient.del(`documentiFornitore*`);
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
            className: "DocumentoFornitore",
            operazione: "Eliminazione documento fornitore " + documentiFornitore.filename,
        });
        console.log("log: ", log);
        const resultLog = await log.save();

        res.status(200);
        res.json(documentiFornitore);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
}

router.get("/fornitore/:id", getDocumentiFornitoreByIdFornitore);
router.get("/:id", getDocumentoFornitoreById);
router.post("/fornitore/:id", insertDocumentoFornitoreByFornitoreId);
router.put("/:id", modifyDocumentoFornitoreByFornitoreId);
router.delete("/:id", deleteDocumentoFornitore);

module.exports = router;
