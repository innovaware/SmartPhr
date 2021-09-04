const express = require("express");
const router = express.Router();
const Consulenti = require("../models/consulenti");

router.get("/", async (req, res) => {
  try {
    const consulenti = await Consulenti.find();
    res.status(200).json(consulenti);

  } catch (err) {
    console.error("Error: ", err);
    res.status(500).json({"Error": err});
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const consulenti = await Consulenti.findById(id);
    res.status(200);
    res.json(consulenti);
  } catch (err) {
    res.status(500).json({"Error": err});
  }
});

router.post("/", async (req, res) => {
  try {
    const dipendente = new Consulenti({
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
    res.json({"Error": err});
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const consulenti = await Consulenti.updateOne(
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
    res.json(consulenti);

  } catch (err) {
    res.status(500).json({"Error": err});
  }
});

module.exports = router;
