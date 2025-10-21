const express = require("express");
const router = express.Router();
const Bonifici = require("../models/bonifici");
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;

router.get("/", async (req, res) => {
    try {
        // Get the redisDisabled flag from the app settings
        const redisDisabled = req.app.get("redisDisabled");

        const getData = () => {
            return Bonifici.aggregate([
                {
                    $project: {
                        identifyUserObj: { $toObjectId: "$identifyUser" },
                        filename: 1,
                        dateupload: 1,
                        note: 1,
                    },
                },
                {
                    $lookup: {
                        from: "fornitori",
                        localField: "identifyUserObj",
                        foreignField: "_id",
                        as: "fromFornitori",
                    },
                },
                {
                    $match: {
                        "fromFornitori.0": { $exists: true }, // ✅ solo bonifici con fornitore associato
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
            ]);
        };

        const eventi = await getData();
        res.status(200).json(eventi);
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ Error: err.message });
    }
});

module.exports = router;

