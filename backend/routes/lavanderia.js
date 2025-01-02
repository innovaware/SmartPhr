const express = require("express");
const router = express.Router();
const Lavanderia = require("../models/lavanderia");
const Pazienti = require("../models/pazienti");
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;
const Log = require("../models/log");
const Dipendenti = require("../models/dipendenti");

/**
 * Ritorna tutti gli elementi della collection 
*/
router.get("/", async (req, res) => {
    const { id } = req.params;
    try {
        const getData = () => {
            //return Pazienti.aggregate(
            //[
            //  {
            //    '$lookup': {
            //      'from': 'lavanderia', 
            //      'localField': '_id', 
            //      'foreignField': 'idDipendente', 
            //      'as': 'lavanderia'
            //    }
            //  }
            //]);

            return Lavanderia.find();
        };

        const lavanderia = await getData();
        res.status(200).json(lavanderia);

    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

router.get("/dipendente/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const getData = () => {
            return Lavanderia.find({ idUtente: id });
        };

        const lavanderia = await getData();
        res.status(200).json(lavanderia);

    } catch (err) {
        res.status(500).json({ Error: err });
    }
});
/**
 * Ricerca un elemento per identificativo
*/
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const getData = () => {
            return Lavanderia.findById(id);
        };

        const lavanderia = await getData();
        res.status(200).json(lavanderia);

    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

/**
 * Modifica un elemento usando id per identificarlo
*/
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const lavanderia = await Lavanderia.updateOne(
            { _id: id },
            {
                $set: {
                    idDipendente: req.body.idDipendente,
                    data: req.body.data,
                    descrizione: req.body.descrizione,
                    tipologia: req.body.tipologia,
                    descrizioneTipologia: req.body.descrizioneTipologia,
                },
            }
        );

        console.log("Update Lavanderia:", lavanderia);

        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        if (redisClient != undefined && !redisDisabled) {
            const searchTerm = "LAVANDERIAALL*";
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
            className: "Lavanderia",
            operazione: "Modifica in lavanderia ",
        });
        console.log("log: ", log);
        const resultLog = await log.save();

        res.status(200);
        res.json(camera);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

/**
 * Inserimento elemento
 */
router.post("/", async (req, res) => {
    try {
        const lavanderia = new Lavanderia({
            idDipendente: req.body.idDipendente,
            data: req.body.data,
            descrizione: req.body.descrizione,
            tipologia: req.body.tipologia,
            descrizioneTipologia: req.body.descrizioneTipologia,
        });

        // Salva i dati sul mongodb
        const result = await lavanderia.save();

        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        if (redisClient != undefined && !redisDisabled) {
            redisClient.del(`LAVANDERIA*`);
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
            className: "Lavanderia",
            operazione: "Inserimento in lavanderia ",
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

/**
 * Elimina un elemento
*/
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const lavanderia = await Lavanderia.remove({ _id: id });

        if (redisClient != undefined && !redisDisabled) {
            redisClient.del(`LAVANDERIA*`);
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
            className: "Lavanderia",
            operazione: "Eliminazione in lavanderia ",
        });
        console.log("log: ", log);
        const resultLog = await log.save();

        res.status(200);
        res.json(lavanderia);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

/** */
module.exports = router;
