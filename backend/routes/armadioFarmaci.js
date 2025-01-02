const { ObjectId } = require("bson");
const express = require("express");
const router = express.Router();
const Armadio = require("../models/armadioFarmaci");
const Log = require("../models/log");
const Dipendenti = require("../models/dipendenti");

router.get("/", async (req, res) => {
    try {
        // Get the redisDisabled flag from the app settings
        redisDisabled = req.app.get("redisDisabled");

        const getData = () => {
            return Armadio.find();
        };

        // Directly fetch data from MongoDB if redis is disabled or undefined
        const armadio = await getData();
        res.status(200).json(armadio);
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ Error: err });
    }
});



router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const armadio = await Armadio.findById(id);
        res.status(200).json(armadio);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});


router.get("/paziente/:id", async (req, res) => {
    const { id } = req.params;
    try {
        // Assicurati che Armadio sia importato correttamente
        const registro = await Armadio.find({ pazienteId: id });
        if (!registro) {
            return res.status(404).json({ message: "Paziente non trovato" });
        }

        res.status(200).json(registro);
    } catch (err) {
        console.error("Errore durante il recupero dei dati: ", err);
        res.status(500).json({ error: "Si è verificato un errore durante il recupero dei dati." });
    }
});


router.put("/:id", async (req, res) => {
    try {
        console.log("Chiamato PUT con ID:", req.params.id);
        console.log("Dati ricevuti per l'aggiornamento:", req.body);

        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ Error: "ID mancante nella richiesta" });
        }

        const armadio = await Armadio.updateOne({ _id: id }, { $set: req.body });

        const user = res.locals.auth;

        const getDipendente = () => {
            return Dipendenti.findById(user.dipendenteID);
        };

        const dipendenti = await getDipendente();

        const log = new Log({
            data: new Date(),
            operatore: dipendenti.nome + " " + dipendenti.cognome,
            operatoreID: user.dipendenteID,
            className: "ArmadioFarmaci",
            operazione: "Modifica farmaco dell'armadio effettuata. ",
        });
        console.log("log: ", log);
        const resultLog = await log.save();

        console.log("Aggiornamento completato:", armadio);
        res.status(200).json({ message: "Aggiornamento riuscito", data: armadio });
    } catch (err) {
        console.error("Errore durante l'aggiornamento dell'armadio:", err);
        res.status(500).json({ Error: err.message });
    }
});




router.post("/", async (req, res) => {
    try {
        const armadio = new Armadio(req.body.armadio);

        await armadio.save();

        //const registro = new registroArmadi({
        //    idCamera: req.body.armadio.idCamera,
        //    stato: false,
        //    paziente: req.body.armadio.pazienteId,
        //    data: new Date(),
        //    note: req.body.note,
        //    firma: req.body.armadio.lastChecked.idUser
        //});

        /* const resultRegistro = await registro.save();*/

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
            operazione: "Inserimento " + armadio.farmaci.nome + "nell'armadio dei farmaci.",
        });
        console.log("log: ", log);
        const resultLog = await log.save();

        res.status(200).json(armadio);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});


module.exports = router;
