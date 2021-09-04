const express = require("express");
const router = express.Router();
const ASP = require("../models/asp");

router.get("/", async (req, res) => {
  try {
    const asp = await ASP.find();
    res.status(200).json(asp);

  } catch (err) {
    console.error("Error: ", err);
    res.status(500).json({"Error": err});
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const asp = await ASP.findById(id);
    res.status(200);
    res.json(asp);
  } catch (err) {
    res.status(500).json({"Error": err});
  }
});

router.post("/", async (req, res) => {
  try {
    const asp = new ASP({
      cognome: req.body.cognome,
      nome: req.body.nome,
      email: req.body.email,
      group: req.body.group,
      user: req.body.user,
    });

    const result = await asp.save();
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
    const asp = await ASP.updateOne(
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
    res.json(asp);

  } catch (err) {
    res.status(500).json({"Error": err});
  }
});

module.exports = router;
