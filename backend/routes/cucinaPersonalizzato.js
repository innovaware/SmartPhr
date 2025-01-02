const express = require("express");
const Menu = require("../models/cucinaPersonalizzato");
const Log = require("../models/log");
const Dipendenti = require("../models/dipendenti");


const router = express.Router();

router.get("/", async (req, res) => {
    try {
        // Function to get data from MongoDB
        const getData = () => {
            return Menu.find();
        };

        // Get the data from MongoDB
        const menu = await getData();

        // Send the response
        res.status(200).json(menu);
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ Error: err });
    }
});


router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        // Function to get data from MongoDB by ID
        const getData = () => {
            return Menu.findById(id);
        };

        // Get the data from MongoDB
        const menu = await getData();

        // Send the response
        res.status(200).json(menu);
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ Error: err });
    }
});

router.get("/Paziente/active/:id", async (req, res) => {
    const { id } = req.params;
    try {
        // Function to get data from MongoDB by ID and active status
        const getData = () => {
            return Menu.find({ paziente: id, active: true });
        };

        // Get the data from MongoDB
        const menu = await getData();

        // Send the response
        res.status(200).json(menu);
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ Error: err });
    }
});

router.get("Paziente/disactive/:id", async (req, res) => {
    const { id } = req.params;
    try {
        // Function to get data from MongoDB by ID
        const getData = () => {
            return Menu.find({ paziente: id, active: false });
        };

        // Get the data from MongoDB
        const menu = await getData();

        // Send the response
        res.status(200).json(menu);
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ Error: err });
    }
});

router.post("/", async (req, res) => {
    console.log("Richiesta ricevuta con il body:", req.body);
    try {
        const menu = new Menu({
            pazienteName: req.body.pazienteName,
            paziente: req.body.paziente,
            dataCreazione: req.body.dataCreazione,
            dataInizio: req.body.dataInizio,
            dataFine: req.body.dataFine,
            giornoRif: req.body.giornoRif,
            menuColazione: req.body.menuColazione,
            menuPranzo: req.body.menuPranzo,
            giornoRifNum: req.body.giornoRifNum,
            menuCena: req.body.menuCena,
            menuSpuntino: req.body.menuSpuntino,
            menuMerenda: req.body.menuMerenda,
            firma: req.body.firma,
            dataScadenza: req.body.dataScadenza,
            personalizzatoColazione: req.body.personalizzatoColazione,
            personalizzatoPranzo: req.body.personalizzatoPranzo,
            personalizzatoCena: req.body.personalizzatoCena,
            active: true,
        });

        console.log("Oggetto menu creato:", menu);

        const result = await menu.save();
        console.log("Menu salvato con successo:", result);

        const user = res.locals.auth;

        const getDipendente = () => {
            return Dipendenti.findById(user.dipendenteID);
        };

        const dipendenti = await getDipendente();

        const log = new Log({
            data: new Date(),
            operatore: dipendenti.nome + " " + dipendenti.cognome,
            operatoreID: user.dipendenteID,
            className: "CucinaPersonalizzato",
            operazione: "Inserimento menù personalizzato per il paziente " + menu.pazienteName,
        });
        console.log("log: ", log);
        const resultLog = await log.save();

        res.status(200).json(result);

    } catch (err) {
        console.error("Errore durante il salvataggio della segnalazione:", err);
        res.status(500).json({ "Error": err.message });
    }
});



router.put('/:id', async (req, res) => {
    try {
        const menuID = req.params.id;
        const updateData = req.body;
        updateData.dataUltimaModifica = new Date();
        // Trova la segnalazione per ID e aggiornala
        const updatedMenu = await Menu.findByIdAndUpdate(menuID, updateData, { new: true });

        if (!updatedMenu) {
            return res.status(404).send({ message: 'menu personalizzato non trovato' });
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
            className: "CucinaPersonalizzato",
            operazione: "Modifica menù personalizzato per il paziente " + menu.pazienteName,
        });
        console.log("log: ", log);
        const resultLog = await log.save();

        res.send(updatedMenu);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

module.exports = router;