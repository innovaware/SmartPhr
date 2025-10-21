const express = require("express");
const router = express.Router();
const Fatture = require("../models/fatture");

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const fatture = await Fatture.find({
            identifyUser: id,
        });

        res.status(200).json(fatture);
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ Error: err.message });
    }
});

router.post("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const fatture = new Fatture({
            identifyUser: id,
            filename: req.body.filename,
            dateupload: Date.now(),
            note: req.body.note,
        });

        console.log("Insert fattura: ", fatture);

        const result = await fatture.save();

        res.status(200).json(result);
    } catch (err) {
        console.error("Error in POST /fatture/:id: ", err);
        res.status(500).json({ Error: err.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const fatture = await Fatture.updateOne(
            { _id: id },
            {
                $set: {
                    identifyUser: req.body.identifyUser,
                    filename: req.body.filename,
                    note: req.body.note,
                },
            }
        );

        res.status(200).json(fatture);
    } catch (err) {
        console.error("Error in PUT /fatture/:id: ", err);
        res.status(500).json({ Error: err.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const item = await Fatture.findById(id);
        const fatture = await Fatture.deleteOne({ _id: id });

        res.status(200).json(fatture);
    } catch (err) {
        console.error("Error in DELETE /fatture/:id: ", err);
        res.status(500).json({ Error: err.message });
    }
});

module.exports = router;