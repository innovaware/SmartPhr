const express = require("express");
const router = express.Router();
const FattureConsulenti = require("../models/fatture");

router.get("/", async (req, res) => {
    try {
        const fattureConsulenti = await FattureConsulenti.aggregate([
            // 1. Filtra per typology = "FattureConsulenti"
            {
                $match: {
                    typology: "FattureConsulenti",
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
            // 3. Join ($lookup) con la collezione 'consulenti'
            {
                $lookup: {
                    from: "consulenti",
                    localField: "identifyUserObj",
                    foreignField: "_id",
                    as: "consulenteData",
                },
            },
            // 4. Estrai nome e cognome dal primo elemento dell'array 'consulenteData'
            {
                $addFields: {
                    nome: { $arrayElemAt: ["$consulenteData.nome", 0] },
                    cognome: { $arrayElemAt: ["$consulenteData.cognome", 0] },
                    codiceFiscale: { $arrayElemAt: ["$consulenteData.codiceFiscale", 0] },
                },
            },
            // 5. Rimuovi i campi di servizio temporanei
            {
                $project: {
                    identifyUserObj: 0,
                    consulenteData: 0,
                },
            },
        ]);

        return res.status(200).json(fattureConsulenti);
    } catch (err) {
        console.error("Errore durante il recupero delle fatture:", err);
        return res.status(500).json({ Error: err.message });
    }
});

module.exports = router;