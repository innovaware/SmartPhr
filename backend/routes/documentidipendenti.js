const express = require("express");
const router = express.Router();
const DocDipendente = require("../models/documentidipendenti");
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;

router.get("/dipendente/:id/:type", async (req, res) => {
    try {
        let id = req.params.id;
        let type = req.params.type;

        console.log(`Received request with id: ${id}, type: ${type}`);

        const getData = async () => {
            return await DocDipendente.find({
                dipendente: id,
                type: type,
            });
        };

        // Fetch data from the database directly without using cache
        const documenti = await getData();

        if (!documenti) {
            console.error(`No documents found for dipendente: ${id}, type: ${type}`);
            return res.status(404).json({ error: "No documents found" });
        }

        console.log(`Found documents: ${JSON.stringify(documenti)}`);
        res.status(200).json(documenti);
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ error: err.message });
    }
});


router.get("/type/:type", async (req, res) => {
    try {
        let type = req.params.type;

        const getData = async () => {
            return await DocDipendente.find({
                type: type,                        
            });
        };

        // Fetch data from the database directly without using cache
        const documenti = await getData();
        res.status(200).json(documenti);
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
            return DocDipendente.findById(id);
        };

        if (redisClient == undefined || redisDisabled) {
            const eventi = await getData();
            res.status(200).json(eventi);
            return;
        }

        const searchTerm = `documentiDipendente${id}`;
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
        const doc = new DocDipendente({
            dipendente: id,
            filename: req.body.filename,
            dateupload: Date.now(),
            dataScadenza: req.body.dataScadenza,
            note: req.body.note,
            type: req.body.type,
            descrizione: req.body.descrizione,
            filenameesito: req.body.filenameesito,
        });

        const result = await doc.save();

        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        if (redisClient != undefined && !redisDisabled) {
            redisClient.del(`documentiDipendente${id}`);
        }

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
        const doc = await DocDipendente.updateOne(
            { _id: id },
            {
                $set: {
                    dipendente: req.body.dipendente,
                    filename: req.body.filename,
                    filenameesito: req.body.filenameesito,
                    dataScadenza: req.body.dataScadenza,
                    note: req.body.note,
                    closed: req.body.closed,
                    accettata: req.body.accettata,
                },
            }
        );

        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        if (redisClient != undefined && !redisDisabled) {
            redisClient.del(`documentiDipendenteBY${id}`);
        }

        res.status(200);
        res.json(doc);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

router.delete("/documento/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const item = await DocDipendente.findById(id);
        console.log("item:" + item);
        const idDipendente = item.dipendente;
        const doc = await DocDipendente.remove({ _id: id });

        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        if (redisClient != undefined && !redisDisabled) {
            redisClient.del(`documentiDipendenteBY${id}`);
            redisClient.del(`documentiDipendente${idDipendente}`);
        }

        res.status(200);
        res.json(doc);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

module.exports = router;
