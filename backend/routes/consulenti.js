const express = require("express");
const router = express.Router();
const Consulenti = require("../models/consulenti");

router.get("/", async (req, res) => {
    try {
        const getData = (query) => {
            return Consulenti.find(query);
        };

        const showOnlyCancellati = req.query.show === "deleted";
        const showAll = req.query.show === "all";

        if (showOnlyCancellati || showAll) {
            console.log("Show all or deleted");
            let query = {};
            if (showOnlyCancellati) {
                query = { cancellato: true };
            }
            const consulenti = await getData(query);
            res.status(200).json(consulenti);
        } else {
            const consulenti = await getData({
                $or: [{ cancellato: { $exists: false } }, { cancellato: false }],
            });

            if (consulenti.length > 0) {
                res.status(200).json(consulenti);
            } else {
                res.status(404).json({ error: "No consultant found" });
            }
        }
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ Error: err });
    }
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
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

        const consulenti = await getData();

        if (consulenti != null && consulenti.length > 0) {
            res.status(200).json(consulenti);
        } else {
            res.status(404).json({ error: "No patient found" });
        }
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

        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ Error: err });
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

        res.status(200).json(consulenti);
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

        res.status(200).json(consulente);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

module.exports = router;