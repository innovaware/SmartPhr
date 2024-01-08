const express = require("express");
const router = express.Router();
const Fornitori = require("../models/fornitori");
//const redis = require("redis");
//const redisPort = process.env.REDISPORT || 6379;
//const redisHost = process.env.REDISHOST || 'redis';
//const redisDisabled = process.env.REDISDISABLE === "true" || false;
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;
//const client = redis.createClient(redisPort, redisHost);

router.get("/", async (req, res) => {
    try {
        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        const getData = (query) => {
            return Fornitori.find(query);
        };

        const showOnlyCancellati = req.query.show == "deleted";
        const showAll = req.query.show == "all";

        if (showOnlyCancellati || showAll) {
            console.log("Show all or deleted");
            let query = {};
            if (showOnlyCancellati) {
                query = { cancellato: true };
            }
            const fornitori = await getData(query);
            res.status(200).json(fornitori);
        } else {

            if (redisClient == undefined || redisDisabled) {
                const fornitori = await getData({
                    $or: [{ cancellato: { $exists: false } }, { cancellato: false }],
                })

                if (fornitori.length > 0) res.status(200).json(fornitori);
                else res.status(404).json({ error: "No patients found" });

                return;
            }

            const searchTerm = `FORNITORIALL`;
            redisClient.get(searchTerm, async (err, data) => {
                if (err) throw err;

                if (data) {
                    res.status(200).send(JSON.parse(data));
                } else {
                    const fornitori = await getData({
                        $or: [{ cancellato: { $exists: false } }, { cancellato: false }],
                    });

                    if (fornitori.length > 0) res.status(200).json(fornitori);
                    else res.status(404).json({ error: "No patients found" });

                    redisClient.setex(searchTerm, redisTimeCache, JSON.stringify(fornitori));
                }
            });
        }
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

        if (id == undefined || id === "undefined") {
            console.log("Error id is not defined ", id);
            res.status(404).json({ Error: "Id not defined" });
            return;
        }

        const getData = () => {
            return Fornitori.find({
                $and: [
                    {
                        $or: [{ cancellato: { $exists: false } }, { cancellato: false }],
                    },
                    { _id: id },
                ],
            });
        };

        if (redisClient == undefined || redisDisabled) {
            const fornitori = await getData();

            if (fornitori != null) res.status(200).json(fornitori);
            else res.status(404).json({ error: "No patient found" });
            return;
        }

        const searchTerm = `FORNITORIBY${id}`;
        redisClient.get(searchTerm, async (err, data) => {
            if (err) throw err;

            if (data && !redisDisabled) {
                res.status(200).send(JSON.parse(data));
            } else {
                const fornitori = await getData();

                redisClient.setex(searchTerm, redisTimeCache, JSON.stringify(fornitori));
                if (fornitori != null) res.status(200).json(fornitori);
                else res.status(404).json({ error: "No patient found" });
            }
        });
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});


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
        });

        const result = await fornitore.save();

        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        if (redisClient != undefined && !redisDisabled) {
            redisClient.del(`FORNITORIALL`);
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
        const fornitori = await Fornitori.updateOne(
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
                    sesso: req.body.sesso,
                    indirizzoResidenza: req.body.indirizzoResidenza,
                    comuneResidenza: req.body.comuneResidenza,
                    provinciaResidenza: req.body.provinciaResidenza,
                    mansione: req.body.mansione,
                    tipoContratto: req.body.tipoContratto,
                    telefono: req.body.telefono,
                    email: req.body.email,
                },
            }
        );

        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        if (redisClient != undefined && !redisDisabled) {
            const searchTerm = `FORNITORIBY${id}`;
            redisClient.del(searchTerm);
        }

        res.status(200);
        res.json(fornitori);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        if (id == undefined || id === "undefined") {
            console.log("Error id is not defined ", id);
            res.status(404).json({ Error: "Id not defined" });
            return;
        }

        if (id == null) {
            res.status(400).json({ error: "id not valid" });
        }

        const fornitore = await Fornitori.updateOne(
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
            redisClient.del(`fornitoriBY${id}`);
            redisClient.del(`FORNITORIALL`);
        }

        res.status(200);
        res.json(fornitore);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

module.exports = router;
