const express = require("express");
const router = express.Router();
const Pazienti = require("../models/pazienti");

router.get("/", async (req, res) => {
  try {
    const pazienti = await Pazienti.find();
    res.status(200).json(pazienti);
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).json({ Error: err });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const pazienti = await Pazienti.findById(id);
    res.status(200);
    res.json(pazienti);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

router.post("/", async (req, res) => {
  try {
    const pazienti = new Pazienti({
      cognome: req.body.cognome,
      nome: req.body.nome,
      sesso: req.body.sesso,
      luogoNascita: req.body.luogoNascita,
      dataNascita: req.body.dataNascita,
      residenza: req.body.residenza,
      statoCivile: req.body.statoCivile,
      figli: req.body.figli,
      scolarita: req.body.scolarita,
      situazioneLavorativa: req.body.situazioneLavorativa,
      personeRiferimento: req.body.personeRiferimento,
      telefono: req.body.telefono,
      dataIngresso: req.body.dataIngresso,
      provincia: req.body.provincia,
      localita: req.body.localita,
      comuneNascita: req.body.comuneNascita,
      provinciaNascita: req.body.provinciaNascita,
    });

    const result = await pazienti.save();
    res.status(200);
    res.json(result);
  } catch (err) {
    res.status(500);
    res.json({ Error: err });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const pazienti = await Pazienti.updateOne(
      { _id: id },
      {
        $set: {
          cognome: req.body.cognome,
          nome: req.body.nome,
          sesso: req.body.sesso,
          luogoNascita: req.body.luogoNascita,
          dataNascita: req.body.dataNascita,
          residenza: req.body.residenza,
          statoCivile: req.body.statoCivile,
          figli: req.body.figli,
          scolarita: req.body.scolarita,
          situazioneLavorativa: req.body.situazioneLavorativa,
          personeRiferimento: req.body.personeRiferimento,
          telefono: req.body.telefono,
          dataIngresso: req.body.dataIngresso,
          provincia: req.body.provincia,
          localita: req.body.localita,
          comuneNascita: req.body.comuneNascita,
          provinciaNascita: req.body.provinciaNascita,
        },
      }
    );
    res.status(200);
    res.json(pazienti);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

module.exports = router;
