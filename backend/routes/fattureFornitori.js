const express = require("express");
const router = express.Router();
const Fatture = require("../models/fatture");
const mongoose = require("mongoose");

router.get("/", async (req, res) => {
    try {
        // Funzione per ottenere i dati da MongoDB
        const getData = () => {
            return Fatture.aggregate([
                {
                    $project: {
                        identifyUserObj: {
                            $cond: {
                                if: { $eq: [{ $strLenCP: "$identifyUser" }, 24] },
                                then: { $toObjectId: "$identifyUser" },
                                else: null,
                            },
                        },
                        filename: 1,
                        dateupload: 1,
                        note: 1,
                    },
                },
                {
                    $lookup: {
                        localField: "identifyUserObj",
                        from: "fornitori",
                        foreignField: "_id",
                        as: "fromFornitori",
                    },
                },
                {
                    $replaceRoot: {
                        newRoot: {
                            $mergeObjects: [
                                { $arrayElemAt: ["$fromFornitori", 0] },
                                "$$ROOT",
                            ],
                        },
                    },
                },
                {
                    $project: {
                        dataNascita: 0,
                        comuneNascita: 0,
                        provinciaNascita: 0,
                        indirizzoNascita: 0,
                        indirizzoResidenza: 0,
                        comuneResidenza: 0,
                        provinciaResidenza: 0,
                        mansione: 0,
                        tipoContratto: 0,
                        telefono: 0,
                        email: 0,
                        fromFornitori: 0,
                    },
                },
                {
                    $match: { identifyUserObj: { $ne: null } }, // Esclude documenti con ObjectId non valido
                },
            ]);
        };

        // Recupera i dati direttamente da MongoDB
        const eventi = await getData();
        res.status(200).json(eventi);
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ Error: err.message });
    }
});

module.exports = router;
