const express = require("express");
const router = express.Router();
const Fornitori = require("../models/fornitori");
//const redis = require("redis");
//const redisPort = process.env.REDISPORT || 6379;
//const redisHost = process.env.REDISHOST || 'redis';
//const redisDisabled = process.env.REDISDISABLE === "true" || false;
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;
//const client = redis.createClient(redisPort, redisHost);
const searchTerm = `FORNITORIALL`;

router.get("/", async (req, res) => {
    try {
        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        //redisDisabled = false;
        const showOnlyCancellati = req.query.show == "deleted";
        const showAll = req.query.show == "all";

        const query = {
            $or: [{ cancellato: { $exists: false } }, { cancellato: false }],
        };

        const getData = (query) => {
            return Fornitori.find(query);
        };


        if (showOnlyCancellati || showAll) {
            console.log("Show all or deleted");
            let query = {};
            if (showOnlyCancellati) {
                query = { cancellato: true };
            }

            const data = await getData(query);
            res.status(200).json(data);
        }
        else {
            if (redisClient == undefined || redisDisabled) {
                const data = await getData(query)

                if (data.length > 0) res.status(200).json(data);
                else res.status(404).json({ error: "No supplier found" });

                return;
            }

            redisClient.get(searchTerm, async (err, data) => {
                if (err) throw err;

                if (data) {
                    res.status(200).send(JSON.parse(data));
                } else {
                    const data = await getData(query);

                    if (data.length > 0) res.status(200).json(data);
                    else res.status(404).json({ error: "No suppliers found" });

                    redisClient.setex(
                        searchTerm,
                        redisTimeCache,
                        JSON.stringify(data)
                    );
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

    const getData = (query) => {
        return Pazienti.find(query);
    };

    try {
        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        if (id == undefined || id === "undefined") {
            console.log("Error id is not defined ", id);
            res.status(404).json({ Error: "Id not defined" });
            return;
        }

        query = {
            $and: [
                {
                    $or: [{ cancellato: { $exists: false } }, { cancellato: false }],
                },
                { _id: id },
            ],
        };

        if (redisClient == undefined || redisDisabled) {
            const data = await getData(query);

            if (data != null) res.status(200).json(pazienti);
            else res.status(404).json({ error: "No supplier found" });
        }
        console.log("\nCiao\n");
        const searchTerm = `FORNITORIBY${id}`;
        redisClient.get(searchTerm, async (err, data) => {
            if (err) throw err;

            if (data) {
                res.status(200).send(JSON.parse(data));
            } else {
                const fornitoridata = await getData(query);

                redisClient.setex(searchTerm, redisTimeCache, JSON.stringify(fornitoridata));
                if (fornitoridata != null) res.status(200).json(fornitoridata);
                else res.status(404).json({ error: "No suppliers found" });
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
            dataCreazione: new Date()
        });

        console.log(req.body);

        const result = await fornitore.save();

        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        if (redisClient != undefined && !redisDisabled) {
            const searchTerm = `FORNITORIALL`;
            redisClient.del(searchTerm);
        }

        res.status(200);
        res.json(result);

    } catch (err) {
        res.status(500);
        res.json({ "Error": err });
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

        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        if (redisClient != undefined && !redisDisabled) {
            const searchTerm = `FORNITORIBY${id}`;
            redisClient.del(searchTerm);
        }

        res.status(200);
        res.json(data);
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

        const data = await Fornitori.updateOne(
            { _id: id },
            {
                $set: {
                    cancellato: true,
                    dataCancellazione: new Date(),
                },
            }
        );
        console.log("\n" + data.cancellato + "\n");
        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        if (redisClient != undefined && !redisDisabled) {
            const searchTerm = `FORNITORIBY${id}`;
            console.log(searchTerm);
            redisClient.del(searchTerm);
        }

        res.status(200);
        res.json(data);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

module.exports = router;