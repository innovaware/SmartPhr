const express = require("express");
const router = express.Router();
const Dipendenti = require("../models/dipendenti");

router.get("/", async (req, res) => {
  try {
    const dipendenti = await Dipendenti.find();
    res.status(200).json(dipendenti);

  } catch (err) {
    console.error("Error: ", err);
    res.status(500).json("Error", err);
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const dipendenti = await Dipendenti.findById(id);
    res.status(200);
    res.json(dipendenti);
  } catch (err) {
    res.status(500).json("Error", err);
  }
});

router.post("/", async (req, res) => {
  try {
    const dipendente = new Dipendenti({
      cognome: req.body.cognome,
      nome: req.body.nome,
      email: req.body.email,
      group: req.body.group,
      user: req.body.user,
    });

    const result = await dipendente.save();
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
    const dipendenti = await Dipendenti.updateOne(
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
    res.json(dipendenti);

  } catch (err) {
    res.status(500).json("Error", err);
  }
});

module.exports = router;
