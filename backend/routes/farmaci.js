const express = require("express");
const router = express.Router();
const Farmaci = require("../models/farmaci");

router.get("/", async (req, res) => {
  try {
    const farmaci = await Farmaci.find();
    res.status(200).json(farmaci);

  } catch (err) {
    console.error("Error: ", err);
    res.status(500).json({"Error": err});
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const farmaci = await Farmaci.findById(id);
    res.status(200);
    res.json(farmaci);
  } catch (err) {
    res.status(500).json({"Error": err});
  }
});

router.post("/", async (req, res) => {
  try {
    const farmaci = new Farmaci({
      nome: req.body.nome,
      descrizione: req.body.descrizione,
      formato: req.body.formato,
      dose: req.body.dose,
      qty: req.body.qty,
      codice_interno: req.body.codice_interno
    });

    const result = await farmaci.save();
    res.status(200);
    res.json(result);

  } catch (err) {
    res.status(500).json({error: err}) 
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const farmaci = await Farmaci.updateOne(
      { _id: id },
      {
        $set: {
          nome: req.body.nome,
          descrizione: req.body.descrizione,
          formato: req.body.formato,
          dose: req.body.dose,
          qty: req.body.qty,
          codice_interno: req.body.codice_interno
        },
      }
    );
    res.status(200);
    res.json(farmaci);

  } catch (err) {
    res.status(500).json({error: err}) 
  }
});

module.exports = router;
