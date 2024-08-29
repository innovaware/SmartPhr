const { ObjectId } = require("bson");
const express = require("express");
const router = express.Router();
const Menu = require("../models/menu");
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;

router.get("/", async (req, res) => {
    try {
        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");
        const mansioneRole = res.locals.auth.role;

        const getData = () => {
            const query = {
                roles: {
                    $all: [ObjectId(mansioneRole)]
                }
            };

            console.log(query);
            // { roles: { $all: [ObjectId('620d1dbd01df09c08ccd9822')] } }
            return Menu.find(query);
        };

        const eventi = await getData();
        res.status(200).json(eventi);
        return;

    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ Error: err });
    }
});


router.get("/access", async (req, res) => {
    try {
        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        const getData = () => {
            return Menu.find();
        };

        const eventi = await getData();
        res.status(200).json(eventi);
        return;

    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ Error: err });
    }
});


router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        if (!id || !data) {
            res.status(404).json({ Error: "Id or data not defined" });
            return;
        }

        // Recupera il menu esistente
        const existingMenu = await Menu.findById(id);

        if (!existingMenu) {
            res.status(404).json({ Error: "Menu not found" });
            return;
        }

        // Aggiorna solo i campi specificati senza sovrascrivere i sottomenu
        existingMenu.title = data.title || existingMenu.title;
        existingMenu.link = data.link || existingMenu.link;
        existingMenu.icon = data.icon || existingMenu.icon;
        existingMenu.roles = data.roles || existingMenu.roles;
        existingMenu.active = data.active !== undefined ? data.active : existingMenu.active;
        existingMenu.order = data.order !== undefined ? data.order : existingMenu.order;

        // Mantieni i sottomenu esistenti se non sono inclusi nel payload
        if (data.subMenu) {
            existingMenu.subMenu = data.subMenu;
        }

        const result = await existingMenu.save();

        res.status(200).json(result);
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ Error: err });
    }
});

module.exports = router;
