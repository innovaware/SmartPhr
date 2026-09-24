const express = require("express");
const router = express.Router();
const Fatture = require("../models/fatture");
const mongoose = require("mongoose");

router.get("/", async (req, res) => {
    try {
        const fattureFornitori = await Fatture.aggregate([
            // 1. Filtra per typology = "FattureFornitori"
            {
                $match: {
                    typology: "FattureFornitori",
                },
            },
            // 2. Converte identifyUser in ObjectId se salvato come stringa
            {
                $addFields: {
                    identifyUserObj: {
                        $cond: {
                            if: { $eq: [{ $type: "$identifyUser" }, "string"] },
                            then: {
                                $convert: {
                                    input: "$identifyUser",
                                    to: "objectId",
                                    onError: null,
                                    onNull: null,
                                },
                            },
                            else: "$identifyUser",
                        },
                    },
                },
            },
            // 3. Join ($lookup) con la collezione 'fornitori'
            {
                $lookup: {
                    from: "fornitori",
                    localField: "identifyUserObj",
                    foreignField: "_id",
                    as: "fornitoreData",
                },
            },
            // 4. Estrai i campi del fornitore trovati
            {
                $addFields: {
                    nome: { $arrayElemAt: ["$fornitoreData.nome", 0] },
                    cognome: { $arrayElemAt: ["$fornitoreData.cognome", 0] },
                    codiceFiscale: { $arrayElemAt: ["$fornitoreData.codiceFiscale", 0] },
                },
            },
            // 5. Rimuovi i campi temporanei di servizio
            {
                $project: {
                    identifyUserObj: 0,
                    fornitoreData: 0,
                },
            },
        ]);
        console.log(fattureFornitori);
        return res.status(200).json(fattureFornitori);
    } catch (err) {
        console.error("Errore durante il recupero delle fatture fornitori:", err);
        return res.status(500).json({ Error: err.message });
    }
});
module.exports = router;
