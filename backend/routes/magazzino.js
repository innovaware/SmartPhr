const express = require("express");
const router = express.Router();
const Magazzino = require("../models/magazzino");
const MagazzinoOperazioni = require("../models/magazzinoOperazioni");
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;
const Log = require("../models/log");
const Dipendenti = require("../models/dipendenti");

/**
 * Ritorna tutti gli elementi della collection 
*/
router.get("/", async (req, res) => {
    try {
        const getData = () => {
            return Magazzino.find();
        };

        const magazzino = await getData();
        res.status(200).json(magazzino);

    } catch (err) {
        console.log(err);
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
            return Magazzino.findById(id);
        };

        const magazzino = await getData();
        res.status(200).json(magazzino);

    } catch (err) {
        console.log(err);
        res.status(500).json({ Error: err });
    }
});

/**
 * Ritorna tutti gli elementi della collection magazzinoOperazioni 
*/
router.get("/operazioni/getAll", async (req, res) => {
    try {
        const getData = () => {
            return MagazzinoOperazioni.find();
        };

        const magazzino = await getData();
        res.status(200).json(magazzino);

    } catch (err) {
        console.log(err);
        res.status(500).json({ Error: err });
    }
});

/**
 * Ritorna tutti gli elementi della collection magazzinoOperazioni 
 * I dati sono filtrati per id del magazzino
*/
router.get("/operazioni/:id", async (req, res) => {
    try {
        const getData = () => {
            return MagazzinoOperazioni.find({
                idMagazzino: id
            });
        };

        const magazzino = await getData();
        res.status(200).json(magazzino);

    } catch (err) {
        console.log(err);
        res.status(500).json({ Error: err });
    }
});

/**
 * Modifica un elemento usando id per identificarlo
*/
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const dataToUpdate = {
            idUser: req.body.idUser,
            //dateInsert: req.body.dateInsert,
            nome: req.body.nome,
            descrizione: req.body.descrizione,
            area: req.body.area,
            quantita: req.body.quantita,
            giacenza: req.body.giacenza,
            conformi: req.body.conformi,
            inuso: req.body.inuso
        }

        const old = await Magazzino.findById(id)
        const magazzino = await Magazzino.updateOne(
            { _id: id },
            {
                $set: dataToUpdate,
            }
        );

        await (new MagazzinoOperazioni({
            idUser: req.body.idUser,
            dateInsert: new Date(),
            tipologiaOperazione: "Modifica",
            idMagazzino: id,
            old: old
        })).save();

        console.log("Update Magazzino:", magazzino);

        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        if (redisClient != undefined && !redisDisabled) {
            const searchTerm = "magazzinoALL*";
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
            className: "Magazzino",
            operazione: "Modifica dettaglio magazzino " ,
        });
        console.log("log: ", log);
        const resultLog = await log.save();

        res.status(200);
        res.json(magazzino);
    } catch (err) {
        console.log(err);
        res.status(500).json({ Error: err });
    }
});


/**
 * Carico 
*/
router.put("/operazioni/carico/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const dataToUpdate = {
            quantita: req.body.quantita,
        }

        const old = await Magazzino.findById(id)
        const magazzino = await Magazzino.updateOne(
            { _id: id },
            {
                $set: dataToUpdate,
            }
        );

        await (new MagazzinoOperazioni({
            idUser: req.body.idUser,
            dateInsert: new Date(),
            tipologiaOperazione: "Carico",
            idMagazzino: id,
            old: old
        })).save();

        console.log("Update Magazzino:", magazzino);

        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        if (redisClient != undefined && !redisDisabled) {
            const searchTerm = "magazzinoALL*";
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
            className: "CaricoMagazzino",
            operazione: "Modifica carico magazzino ",
        });
        console.log("log: ", log);
        const resultLog = await log.save();

        res.status(200);
        res.json(magazzino);
    } catch (err) {
        console.log(err);
        res.status(500).json({ Error: err });
    }
});


/**
 * Scarico 
*/
router.put("/operazioni/scarico/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const dataToUpdate = {
            quantita: req.body.quantita,
        }

        const old = await Magazzino.findById(id)
        const magazzino = await Magazzino.updateOne(
            { _id: id },
            {
                $set: dataToUpdate,
            }
        );

        await (new MagazzinoOperazioni({
            idUser: req.body.idUser,
            dateInsert: new Date(),
            tipologiaOperazione: "Scarico",
            idMagazzino: id,
            old: old
        })).save();

        console.log("Update Magazzino:", magazzino);

        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        if (redisClient != undefined && !redisDisabled) {
            const searchTerm = "magazzinoALL*";
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
            className: "ScaricoMagazzino",
            operazione: "Modifica scarico magazzino ",
        });
        console.log("log: ", log);
        const resultLog = await log.save();

        res.status(200);
        res.json(magazzino);
    } catch (err) {
        console.log(err);
        res.status(500).json({ Error: err });
    }
});



/**
 * Inserimento elemento
 */
router.post("/", async (req, res) => {
    try {
        const magazzino = new Magazzino({
            idUser: req.body.idUser,
            dateInsert: new Date(),
            nome: req.body.nome,
            descrizione: req.body.descrizione,
            area: req.body.area,
            quantita: req.body.quantita,
            giacenza: req.body.giacenza,
            conformi: req.body.conformi,
            inuso: req.body.inuso
        });

        // Salva i dati sul mongodb
        const result = await magazzino.save(async (err, item) => {
            await (new MagazzinoOperazioni({
                idUser: req.body.idUser,
                dateInsert: new Date(),
                idMagazzino: item.id,
                tipologiaOperazione: "Inserimento",
                old: magazzino
            })).save();
        });
        console.log(result);


        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        if (redisClient != undefined && !redisDisabled) {
            redisClient.del(`magazzino*`);
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
            className: "Magazzino",
            operazione: "Inserimento nel magazzino ",
        });
        console.log("log: ", log);
        const resultLog = await log.save();

        res.status(200);
        res.json(result);
    } catch (err) {
        console.log(err);
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
        const magazzino = await Magazzino.remove({ _id: id });

        if (redisClient != undefined && !redisDisabled) {
            redisClient.del(`magazzino*`);
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
            className: "Magazzino",
            operazione: "Eliminazione nel magazzino ",
        });
        console.log("log: ", log);
        const resultLog = await log.save();

        res.status(200);
        res.json(magazzino);
    } catch (err) {
        console.log(err);
        res.status(500).json({ Error: err });
    }
});

/** */
module.exports = router;
