const express = require("express");
const router = express.Router();
const Fornitori = require("../models/fornitori");

router.get("/", async (req, res) => {
    try {
        const showOnlyCancellati = req.query.show === "deleted";
        const showAll = req.query.show === "all";

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
        } else {
            const query = {
                $or: [{ cancellato: { $exists: false } }, { cancellato: false }],
            };

            const data = await getData(query);

            if (data.length > 0) {
                res.status(200).json(data);
            } else {
                res.status(404).json({ error: "No suppliers found" });
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

        const query = {
            $and: [
                {
                    $or: [{ cancellato: { $exists: false } }, { cancellato: false }],
                },
                { _id: id },
            ],
        };

        const getData = () => {
            return Fornitori.find(query);
        };

        const fornitoridata = await getData();

        if (fornitoridata != null && fornitoridata.length > 0) {
            res.status(200).json(fornitoridata);
        } else {
            res.status(404).json({ error: "No supplier found" });
        }
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

        res.status(200).json(data);
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

        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

module.exports = router;