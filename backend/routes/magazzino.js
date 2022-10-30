const express = require("express");
const router = express.Router();
const Magazzino = require("../models/magazzino");
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;

/**
 * Ritorna tutti gli elementi della collection 
*/
router.get("/", async (req, res) => {
  try {
    const getData = () => {
      return Magazzino.find();
    };

    const magazzino = await getData();
    res.status(200).json(magazzino);
  
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});


/**
 * Ricerca un elemento per identificativo
*/
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const getData = () => {
      return Magazzino.findById(id);
    };

    const magazzino = await getData();
    res.status(200).json(magazzino);
  
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

/**
 * Modifica un elemento usando id per identificarlo
*/
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const magazzino = await Magazzino.updateOne(
      { _id: id },
      {
        $set: {
          idUser: req.body.idUser,
          dateInsert: req.body.dateInsert,
          nome: req.body.nome,
          descrizione: req.body.descrizione,
          area: req.body.area,
          quantita: req.body.quantita,
          giacenza: req.body.giacenza,
          conformi: req.body.conformi,
          inuso: req.body.inuso
        },
      }
    );

    console.log("Update Magazzino:", magazzino);
    
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      const searchTerm = "magazzinoALL*";
      redisClient.del(searchTerm);
    }
    

    res.status(200);
    res.json(magazzino);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

/**
 * Inserimento elemento
 */
router.post("/", async (req, res) => {
  try {
    const magazzino = new Magazzino({
      idUser: req.body.idUser,
      dateInsert: req.body.dateInsert,
      nome: req.body.nome,
      descrizione: req.body.descrizione,
      area: req.body.area,
      quantita: req.body.quantita,
      giacenza: req.body.giacenza,
      conformi: req.body.conformi,
      inuso: req.body.inuso
    });

    // Salva i dati sul mongodb
    const result = await magazzino.save();

    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      redisClient.del(`magazzino*`);
    }

    res.status(200);
    res.json(result);
  } catch (err) {
    res.status(500);
    res.json({ Error: err });
  }
});


/**
 * Elimina un elemento
*/
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const magazzino = await Magazzino.remove({ _id: id });

    if (redisClient != undefined && !redisDisabled) {
      redisClient.del(`magazzino*`);
    }

    res.status(200);
    res.json(magazzino);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

/** */
module.exports = router;
