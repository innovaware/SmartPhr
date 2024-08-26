const { ObjectId } = require("bson");
const express = require("express");
const router = express.Router();
const ArchivioMenu = require("../models/archivioMenuCucinaPersonalizzato");


router.get("/", async (req, res) => {
    try {
        // Get the redisDisabled flag from the app settings
        redisDisabled = req.app.get("redisDisabled");

        const getData = () => {
            return ArchivioMenu.find();
        };

        // Directly fetch data from MongoDB if redis is disabled or undefined
        const archivioMenu = await getData();
        res.status(200).json(archivioMenu);
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ Error: err });
    }
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        const getData = () => {
            return ArchivioMenu.findById(id);
        };

        const archivioMenu = await getData();
        res.status(200).json(archivioMenu);

    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

router.post("/", async (req, res) => {
    try {
        console.log(req.body);
        const archivioMenu = new ArchivioMenu(req.body);

        const result = await archivioMenu.save();

       
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});


module.exports = router;
