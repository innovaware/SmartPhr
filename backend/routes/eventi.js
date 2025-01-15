const express = require("express");
const router = express.Router();
const Eventi = require("../models/eventi");
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;
const Log = require("../models/log");
const Dipendenti = require("../models/dipendenti");

router.get("/", async (req, res) => {
    try {

        const getData = () => {
            return Eventi.find({
                $or: [
                    { cancellato: { $exists: false } },
                    { cancellato: false }
                ]
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
            return Eventi.findOne({
                _id: id,
                $or: [
                    { cancellato: { $exists: false } },
                    { cancellato: false }
                ]
            });
        };

        const eventi = await getData();
        res.status(200).json(eventi);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

router.get("/tipo/:tipo", async (req, res) => {
    const { tipo } = req.params;
    try {
        const eventi = await Eventi.find({
            tipo: tipo,
            $or: [
                { cancellato: { $exists: false } },
                { cancellato: false }
            ]
        });
        res.status(200).json(eventi);
    } catch (err) {
        console.error("Errore durante il recupero degli eventi:", err);
        res.status(500).json({ error: err.message || "Errore del server" });
    }
});

router.get("/search/:data", async (req, res) => {
    const { data } = req.params;
    const { user } = req.query;

    try {
        if (data == undefined) {
            res.status(400).json({ Error: "data not defined" });
            return;
        }

        if (user == undefined) {
            res.status(400).json({ Error: "user not defined" });
            return;
        }

        const year = data.substring(0, 4);
        const month = data.substring(4, 6);
        const day = data.substring(6, 8);

        const query = {
            $and: [
                {
                    data: {
                        $gte: new Date(year, month - 1, day, "00", "00", "00"),
                        $lt: new Date(year, month - 1, day, "23", "59", "59"),
                    },
                    utente: user,
                },
                {
                    $or: [
                        { cancellato: { $exists: false } },
                        { cancellato: false },
                    ],
                },
            ],
        };

        const eventi = await Eventi.find(query);
        res.status(200).json(eventi);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});


router.get("/searchByDay/:data", async (req, res) => {
    const { data } = req.params;
    const { user } = req.query;

    try {
        if (!data || data.length !== 8 || isNaN(data)) {
            return res.status(400).json({ Error: "Parametro 'data' non valido. Deve essere nel formato YYYYMMDD." });
        }

        if (!user) {
            return res.status(400).json({ Error: "user not defined" });
        }

        const year = parseInt(data.substring(0, 4), 10);
        const month = parseInt(data.substring(4, 6), 10) - 1;
        const day = parseInt(data.substring(6, 8), 10);

        const startDate = new Date(year, month, day, 0, 0, 0);
        const endDate = new Date(year, month, day, 23, 59, 59);

        const query = {
            $and: [
                {
                    data: {
                        $gte: startDate,
                        $lt: endDate,
                    },
                },
                {
                    $or: [
                        { cancellato: { $exists: false } },
                        { cancellato: false }
                    ]
                },
                {
                    $or: [
                        { utente: user },
                        { visibile: true }
                    ]
                }
            ]
        };

        const eventi = await Eventi.find(query);
        return res.status(200).json(eventi);
    } catch (err) {
        console.error("Errore durante la ricerca degli eventi:", err);
        return res.status(500).json({ Error: "Errore interno del server." });
    }
});

router.get("/searchByDayType/:data/:type", async (req, res) => {
    const { data, type } = req.params;
    const { user } = req.query;

    try {
        if (!data || data.length !== 8 || isNaN(data)) {
            return res.status(400).json({ Error: "Parametro 'data' non valido. Deve essere nel formato YYYYMMDD." });
        }

        if (!type) {
            return res.status(400).json({ Error: "Parametro 'type' non valido o mancante." });
        }

        if (!user) {
            return res.status(400).json({ Error: "user not defined" });
        }

        const year = parseInt(data.substring(0, 4), 10);
        const month = parseInt(data.substring(4, 6), 10) - 1;
        const day = parseInt(data.substring(6, 8), 10);

        const startDate = new Date(year, month, day, 0, 0, 0);
        const endDate = new Date(year, month, day, 23, 59, 59);

        const query = {
            $and: [
                {
                    data: {
                        $gte: startDate,
                        $lt: endDate,
                    },
                },
                {
                    tipo: type,
                },
                {
                    $or: [
                        { cancellato: { $exists: false } },
                        { cancellato: false }
                    ]
                },
                {
                    $or: [
                        { utente: user },
                        { visibile: true }
                    ]
                }
            ]
        };

        const eventi = await Eventi.find(query);
        return res.status(200).json(eventi);
    } catch (err) {
        console.error("Errore durante la ricerca degli eventi:", err);
        return res.status(500).json({ Error: "Errore interno del server." });
    }
});


router.get("/searchIntervaltype/:dataStart/:dataEnd/:type", async (req, res) => {
    const { dataStart, dataEnd, type } = req.params;
    const { user } = req.query;

    if (!dataStart || !dataEnd) {
        return res.status(400).json({ Error: "dataStart or dataEnd not defined" });
    }
    console.log(type);
    if (!type) {
        return res.status(400).json({ Error: "type not defined" });
    }
    try {
        const yearStart = dataStart.substring(0, 4);
        const monthStart = dataStart.substring(4, 6);
        const dayStart = dataStart.substring(6, 8);

        const yearEnd = dataEnd.substring(0, 4);
        const monthEnd = dataEnd.substring(4, 6);
        const dayEnd = dataEnd.substring(6, 8);

        const query = {
            $and: [
                {
                    data: {
                        $gte: new Date(yearStart, monthStart - 1, dayStart, 0, 0, 0),
                        $lt: new Date(yearEnd, monthEnd - 1, dayEnd, 23, 59, 59),
                    },
                },
                {
                    tipo: type
                },
                {
                    $or: [
                        { cancellato: false },
                        { cancellato: { $exists: false } }
                    ]
                },
                {
                    $or: [
                        { utente: user },
                        { visibile: true }
                    ]
                }
            ]
        };

        const eventi = await Eventi.find(query);
        console.log(eventi);
        res.status(200).json(eventi);

    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});

router.get("/searchInterval/:dataStart/:dataEnd", async (req, res) => {
    const { dataStart, dataEnd } = req.params;
    const { user } = req.query;

    if (!dataStart || !dataEnd) {
        return res.status(400).json({ Error: "dataStart or dataEnd not defined" });
    }

    if (!user) {
        return res.status(400).json({ Error: "user not defined" });
    }

    try {
        const yearStart = dataStart.substring(0, 4);
        const monthStart = dataStart.substring(4, 6);
        const dayStart = dataStart.substring(6, 8);

        const yearEnd = dataEnd.substring(0, 4);
        const monthEnd = dataEnd.substring(4, 6);
        const dayEnd = dataEnd.substring(6, 8);

        const query = {
            $and: [
                {
                    data: {
                        $gte: new Date(yearStart, monthStart - 1, dayStart, 0, 0, 0),
                        $lt: new Date(yearEnd, monthEnd - 1, dayEnd, 23, 59, 59),
                    },
                },
                {
                    $or: [
                        { utente: user },
                        { visibile: true }
                    ]
                },
                {
                    $or: [
                        { cancellato: false },
                        { cancellato: { $exists: false } }
                    ]
                }
            ]
        };

        const eventi = await Eventi.find(query);
        res.status(200).json(eventi);

    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});


router.post("/", async (req, res) => {
    try {
        const eventi = new Eventi({
            data: req.body.data,
            descrizione: req.body.descrizione,
            tipo: req.body.tipo,
            utente: req.body.utente,
            visibile: req.body.visibile,
            effettuato: false,
            dataCreazione: new Date(),
        });

        const result = await eventi.save();

        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        if (redisClient != undefined && !redisDisabled) {
            const searchTerm = `EVENTIALL`;
            redisClient.del(searchTerm);
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
            className: "Eventi",
            operazione: "Inserimento evento status corsi: " + eventi.descrizione,
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
        const eventi = await Eventi.updateOne(
            { _id: id },
            {
                $set: {
                    data: req.body.data,
                    descrizione: req.body.descrizione,
                    tipo: req.body.tipo,
                    utente: req.body.utente,
                    visibile: req.body.visibile,
                    finito: req.body.finito,
                    dataCompletato: new Date(),
                },
            }
        );

        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        if (redisClient != undefined && !redisDisabled) {
            const searchTerm = `EVENTIBY${id}`;
            redisClient.del(searchTerm);
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
            className: "EventiStatusCorsi",
            operazione: "Modifica evento status corsi: " + eventi.descrizione,
        });
        console.log("log: ", log);
        const resultLog = await log.save();

        res.status(200);
        res.json(eventi);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const evento = await Eventi.findOneAndUpdate(
            { _id: id },
            { cancellato: true, DataCancellazione: new Date() },
            { new: true }
        );

        if (!evento) {
            return res.status(404).json({ message: "Evento non trovato" });
        }


        const usr = res.locals.auth;

        const getDipendente = () => {
            return Dipendenti.findById(usr.dipendenteID);
        };

        const dip = await getDipendente();

        const log = new Log({
            data: new Date(),
            operatore: `${dip.nome} ${dip.cognome}`,
            operatoreID: usr.dipendenteID,
            className: "Evento",
            operazione: `Cancellazione evento: ${evento.descrizione}`,
        });

        console.log("log: ", log);
        await log.save();

        res.status(200).json(evento);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});

module.exports = router;
