const express = require("express");
const router = express.Router();
const Consulenti = require("../models/consulenti");

//const redis = require("redis");
//const redisPort = process.env.REDISPORT || 6379;
//const redisHost = process.env.REDISHOST || "redis";
//const redisDisabled = process.env.REDISDISABLE === "true" || false;
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;
//const client = redis.createClient(redisPort, redisHost);


router.get("/", async (req, res) => {
    try {
        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        const getData = (query) => {
            return Consulenti.find(query);
        };

        const showOnlyCancellati = req.query.show == "deleted";
        const showAll = req.query.show == "all";

        if (showOnlyCancellati || showAll) {
            console.log("Show all or deleted");
            let query = {};
            if (showOnlyCancellati) {
                query = { cancellato: true };
            }
            const consulenti = await getData(query);
            res.status(200).json(consulenti);
        } else {

            if (redisClient == undefined || redisDisabled) {
                const consulenti = await getData({
                    $or: [{ cancellato: { $exists: false } }, { cancellato: false }],
                })

                if (consulenti.length > 0) res.status(200).json(consulenti);
                else res.status(404).json({ error: "No consultant found" });

                return;
            }

            const searchTerm = `CONSULENTIALL`;
            redisClient.get(searchTerm, async (err, data) => {
                if (err) throw err;

                if (data) {
                    res.status(200).send(JSON.parse(data));
                } else {
                    const consulenti = await getData({
                        $or: [{ cancellato: { $exists: false } }, { cancellato: false }],
                    });

                    if (consulenti.length > 0) res.status(200).json(consulenti);
                    else res.status(404).json({ error: "No consultant found" });

                    redisClient.setex(searchTerm, redisTimeCache, JSON.stringify(consulenti));
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
            return Consulenti.find({
                $and: [
                    {
                        $or: [{ cancellato: { $exists: false } }, { cancellato: false }],
                    },
                    { _id: id },
                ],
            });
        };

        if (redisClient == undefined || redisDisabled) {
            const consulenti = await getData();

            if (consulenti != null) res.status(200).json(consulenti);
            else res.status(404).json({ error: "No patient found" });
            return;
        }

        const searchTerm = `CONSULENTIBY${id}`;
        redisClient.get(searchTerm, async (err, data) => {
            if (err) throw err;

            if (data && !redisDisabled) {
                res.status(200).send(JSON.parse(data));
            } else {
                const consulenti = await getData();

                redisClient.setex(searchTerm, redisTimeCache, JSON.stringify(consulenti));
                if (consulenti != null) res.status(200).json(consulenti);
                else res.status(404).json({ error: "No patient found" });
            }
        });
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

router.post("/", async (req, res) => {
    try {
        const consulente = new Consulenti({
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
            tipologiaContratto: req.body.tipologiaContratto,
            telefono: req.body.telefono,
            email: req.body.email,
            dataCreazione: new Date()
        });

        const result = await consulente.save();

        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        if (redisClient != undefined && !redisDisabled) {
            redisClient.del(`CONSULENTIALL`);
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
        if (id == undefined || id === "undefined") {
            console.log("Error id is not defined ", id);
            res.status(404).json({ Error: "Id not defined" });
            return;
        }


        const consulenti = await Consulenti.updateOne(
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
                    comuneResidenza: req.body.comuneResidenza,
                    provinciaResidenza: req.body.provinciaResidenza,
                    mansione: req.body.mansione,
                    tipologiaContratto: req.body.tipologiaContratto,
                    telefono: req.body.telefono,
                    email: req.body.email,
                    sesso: req.body.sesso,
                    dataUltimaModifica: new Date()
                },
            }
        );

        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        if (redisClient != undefined && !redisDisabled) {
            const searchTerm = `CONSULENTIBY${id}`;
            redisClient.del(searchTerm);
        }

        res.status(200);
        res.json(consulenti);
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

        const consulente = await Consulenti.updateOne(
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
            redisClient.del(`CONSULENTIBY${id}`);
            redisClient.del(`CONSULENTIALL`);
        }

        res.status(200);
        res.json(consulente);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

module.exports = router;
