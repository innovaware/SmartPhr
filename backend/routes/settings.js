const express = require("express");
const router = express.Router();
const Settings = require("../models/settings");

router.get("/", async (req, res) => {
    try {
        const settings = await Settings.find();
        res.status(200).json(settings);
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ Error: err });
    }
});


router.post("/", async (req, res) => {
    try {
        const settings = new Settings({
            alertContratto: req.body.alertContratto,
            alertDiarioClinico: req.body.alertDiarioClinico,
            menuInvernaleStart: req.body.menuInvernaleStart,
            menuInvernaleEnd: req.body.menuInvernaleEnd,
            menuEstivoStart: req.body.menuEstivoStart,
            menuEstivoEnd: req.body.menuEstivoEnd,
        });
        
        const result = await settings.save();

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
        const settings = await Settings.updateOne(
            { _id: id },
            {
                $set: {
                    alertContratto: req.body.alertContratto,
                    alertDiarioClinico: req.body.alertDiarioClinico,
                    menuInvernaleStart: req.body.menuInvernaleStart,
                    menuInvernaleEnd: req.body.menuInvernaleEnd,
                    menuEstivoStart: req.body.menuEstivoStart,
                    menuEstivoEnd: req.body.menuEstivoEnd,
                    ScadenzaPersonalizzato: req.body.ScadenzaPersonalizzato,
                },
            }
        );
        
        res.status(200).json(settings);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

module.exports = router;
