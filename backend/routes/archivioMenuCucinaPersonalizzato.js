const { ObjectId } = require("bson");
const express = require("express");
const router = express.Router();
const ArchivioMenu = require("../models/archivioMenuCucinaPersonalizzato");
const Log = require("../models/log");
const Dipendenti = require("../models/dipendenti");

router.get("/", async (req, res) => {
    try {
        // Get the redisDisabled flag from the app settings
        redisDisabled = req.app.get("redisDisabled");

        const getData = () => {
            return ArchivioMenu.find();
        };

        // Directly fetch data from MongoDB if redis is disabled or undefined
        const archivioMenu = await getData();
        res.status(200).json(archivioMenu);
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
            return ArchivioMenu.findById(id);
        };

        const archivioMenu = await getData();
        res.status(200).json(archivioMenu);

    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

router.post("/", async (req, res) => {
    try {
        console.log(req.body);
        const archivioMenu = new ArchivioMenu(req.body);

        const result = await archivioMenu.save();

        const user = res.locals.auth;

        const getDipendente = () => {
            return Dipendenti.findById(user.dipendenteID);
        };

        const dipendenti = await getDipendente();

        const log = new Log({
            data: new Date(),
            operatore: dipendenti.nome + " " + dipendenti.cognome,
            operatoreID: user.dipendenteID,
            className: "ArchivioMenuCucinaPersonalizzato",
            operazione: "Inserimento menù del paziente " + archivioMenu.pazienteNome + " (creato il " + archivioMenu.menu.dataCreazione + ") in archivio.",
        });
        console.log("log: ", log);
        const resultLog = await log.save();
       
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});


module.exports = router;
