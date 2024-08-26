const express = require("express");
const router = express.Router();
const Materiali = require("../models/materiali");


router.get("/", async (req, res) => {
    try {
        const getData = () => {
            return Materiali.find();
        };

        const materiali = await getData();
        res.status(200).json(materiali);

    } catch (err) {
        console.log(err);
        res.status(500).json({ Error: err });
    }
});


router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const getData = () => {
            return Materiali.findById(id);
        };

        const materiali = await getData();
        res.status(200).json(materiali);

    } catch (err) {
        console.log(err);
        res.status(500).json({ Error: err });
    }
});

router.get("/type/:type", async (req, res) => {
    try {
        let type = req.params.type;

        const getData = async () => {
            return await Materiali.find({
                type: type,
            });
        };

        // Fetch data from the database directly without using cache
        const materiali = await getData();
        res.status(200).json(materiali);
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ Error: err });
    }
});

module.exports = router;
