const express = require("express");
const router = express.Router();
const Fornitori = require("../models/fornitori");

router.get("/", async (req, res) => {
  try {
    const fornitori = await Fornitori.find();
    res.status(200).json(fornitori);

  } catch (err) {
    console.error("Error: ", err);
    res.status(500).json("Error", err);
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const fornitori = await Fornitori.findById(id);
    res.status(200);
    res.json(fornitori);
  } catch (err) {
    res.status(500).json("Error", err);
  }
});

router.post("/", async (req, res) => {
  try {
    const fornitore = new Fornitori({
      cognome: req.body.cognome,
      nome: req.body.nome,
      email: req.body.email,
      group: req.body.group,
      user: req.body.user,
    });

    console.log(req.body);

    const result = await fornitore.save();
    res.status(200);
    res.json(result);

  } catch (err) {
    res.status(500);
    res.json("Error", err);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const fornitori = await Fornitori.updateOne(
      { _id: id },
      {
        $set: {
          cognome: req.body.cognome,
          nome: req.body.nome,
          email: req.body.email,
          group: req.body.group,
          user: req.body.user,
        },
      }
    );
    res.status(200);
    res.json(fornitori);

  } catch (err) {
    res.status(500).json("Error", err);
  }
});

module.exports = router;
