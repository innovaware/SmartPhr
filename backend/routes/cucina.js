const express = require("express");
const router = express.Router();
const Cucina = require("../models/cucina");
const CucinaGenerale = require("../models/cucinaGenerale");
const CucinaAmbienti = require("../models/cucinaAmbienti");
const CucinaAmbientiArchivio = require("../models/cucinaAmbientiArchivio");
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;

/**
 * Ritorna tutti gli elementi della collection 
*/
router.get("/", async (req, res) => {
  const { id } = req.params;
  try {
    const getData = () => {
      return Cucina.find();
    };

    const cucina = await getData();
    res.status(200).json(cucina);
  
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

/**
 * Ritorna tutti gli elementi della collection cucinaAmbiente
*/
router.get("/ambiente/", async (req, res) => {
  const { id } = req.params;
  try {
    const getData = () => {
      return CucinaAmbienti.find();
    };

    const cucina = await getData();
    res.status(200).json(cucina);
  
  } catch (err) {
    console.log(err);
    res.status(500).json({ Error: err });
  }
});

/**
 * Ritorna tutti gli elementi della collection cucinaAmbienteArchivio
*/
router.get("/archivio/ambiente/", async (req, res) => {
  const { id } = req.params;
  try {
    const getData = () => {
      return CucinaAmbientiArchivio.find();
    };

    const cucina = await getData();
    res.status(200).json(cucina);
  
  } catch (err) {
    console.log(err);
    res.status(500).json({ Error: err });
  }
});



/**
 * Ritorna tutti gli elementi della collection cucinaAmbiente
*/
router.get("/ambiente/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const getData = () => {
      return CucinaAmbienti.findById(id);
    };

    const cucina = await getData();
    res.status(200).json(cucina);
  
  } catch (err) {
    console.log(err);
    res.status(500).json({ Error: err });
  }
});


/**
 * Ritorna tutti gli elementi della collection cucinaAmbienteArchivio
*/
router.get("/archivio/ambiente/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const getData = () => {
      return CucinaAmbientiArchivio.findById(id);
    };

    const cucina = await getData();
    res.status(200).json(cucina);
  
  } catch (err) {
    console.log(err);
    res.status(500).json({ Error: err });
  }
});



/**
 * Ritorna la lista del menu generale
 */
router.get("/generale", async (req, res) => {
  const { type, week, year } = req.query;
  try {
    const getData = () => {
      return CucinaGenerale.find({
        week: week,
        type: type,
        year: year
      });
    };

    const cucina = await getData();
    res.status(200).json(cucina);
  
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

router.get("/paziente/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const getData = () => {
      return Cucina.find({idPaziente: id});
    };

    const cucina = await getData();
    res.status(200).json(cucina);
  
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
      return Cucina.findById(id);
    };

    const cucina = await getData();
    res.status(200).json(cucina);
  
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
    const cucina = await Cucina.updateOne(
      { _id: id },
      {
        $set: {
          idPaziente: req.body.idPaziente,
          data: req.body.data,
          descrizione: req.body.descrizione,
          menuColazione: req.body.menuColazione,
          menuPranzo: req.body.menuPranzo,
          menuCena: req.body.menuCena,
        },
      }
    );

    console.log("Update Cucina:", cucina);
    
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      const searchTerm = "cucinaALL*";
      redisClient.del(searchTerm);
    }
    

    res.status(200);
    res.json(cucina);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});


/**
 * Update cucina Ambienti
*/
router.put("/ambiente/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = {
          nome: req.body.nome,
          dateSanficazioneOrdinaria: req.body.dateSanficazioneOrdinaria,
          dateSanficazioneStraordinaria: req.body.dateSanficazioneStraordinaria,
          idUser: req.body.idUser
        };
    const cucina = await CucinaAmbienti.updateOne(
      { _id: id },
      {
        $set: data,
      }
    );

    (await new CucinaAmbientiArchivio(data)).save();

    console.log("Update Cucina ambiente:", cucina);
    
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      const searchTerm = "cucinaALL*";
      redisClient.del(searchTerm);
    }
    

    res.status(200);
    res.json(cucina);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

/**
 * Update cucina Ambienti archivio
*/
router.put("/archivio/ambiente/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const cucina = await CucinaAmbientiArchivio.updateOne(
      { _id: id },
      {
        $set: {
          nome: req.body.nome,
          dateSanficazioneOrdinaria: req.body.dateSanficazioneOrdinaria,
          dateSanficazioneStraordinaria: req.body.dateSanficazioneStraordinaria,
          idUser: req.body.idUser
        },
      }
    );

    console.log("Update Cucina ambiente archivio:", cucina);
    
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      const searchTerm = "cucinaALL*";
      redisClient.del(searchTerm);
    }
    

    res.status(200);
    res.json(cucina);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

/**
 * Update menu generale
 */
router.put("/generale/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const cucinaGenerale = await CucinaGenerale.updateOne(
      { _id: id },
      {
        $set: {
          type: req.body.type,
          day: req.body.day,
          week: req.body.week,
          year: req.body.year,
          dataStartRif: req.body.dataStartRif,
          dataEndRif: req.body.dataEndRif,
          dataInsert: req.body.dataInsert,
          colazione: req.body.colazione,
          spuntino: req.body.spuntino,
          pranzo: req.body.pranzo,
          merenda: req.body.merenda,
          cena: req.body.cena,
        },
      }
    );

    console.log("Update CucinaGenerale:", cucinaGenerale);
    
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      const searchTerm = "cucinageneraleALL*";
      redisClient.del(searchTerm);
    }
    

    res.status(200);
    res.json(cucinaGenerale);
  } catch (err) {
    res.status(500).json({ Error: err });
  }

});
/**
 * Inserimento elemento
 */
router.post("/", async (req, res) => {
  try {
    const cucina = new Cucina({
      idPaziente: req.body.idPaziente,
      data: req.body.data,
      descrizione: req.body.descrizione,
      menuColazione: req.body.menuColazione,
      menuPranzo: req.body.menuPranzo,
      menuCena: req.body.menuCena,
    });

    // Salva i dati sul mongodb
    const result = await cucina.save();

    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      redisClient.del(`cucina*`);
    }

    res.status(200);
    res.json(result);
  } catch (err) {
    res.status(500);
    res.json({ Error: err });
  }
});

/**
 * Inserimento cucina ambiente
 */
router.post("/ambiente/", async (req, res) => {
  try {
    const cucina = new CucinaAmbienti({
      nome: req.body.nome,
      dateSanficazioneOrdinaria: req.body.dateSanficazioneOrdinaria,
      dateSanficazioneStraordinaria: req.body.dateSanficazioneStraordinaria,
      idUser: req.body.idUser
    });

    // Salva i dati sul mongodb
    const result = await cucina.save();

    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      redisClient.del(`cucina*`);
    }

    res.status(200);
    res.json(result);
  } catch (err) {
    res.status(500);
    res.json({ Error: err });
  }
});


/**
 * Inserimento cucina ambiente archivio
 */
router.post("/archivio/ambiente/", async (req, res) => {
  try {
    const cucina = new CucinaAmbientiArchivio({
      nome: req.body.nome,
      dateSanficazioneOrdinaria: req.body.dateSanficazioneOrdinaria,
      dateSanficazioneStraordinaria: req.body.dateSanficazioneStraordinaria,
      idUser: req.body.idUser
    });

    // Salva i dati sul mongodb
    const result = await cucina.save();

    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      redisClient.del(`cucina*`);
    }

    res.status(200);
    res.json(result);
  } catch (err) {
    res.status(500);
    res.json({ Error: err });
  }
});




/**
 * Inserimento elemento generale
 */
router.post("/generale", async (req, res) => {
  try {
    const cucinaGenerale = new CucinaGenerale({
      type: req.body.type,
      week: req.body.week,
      day: req.body.day,
      year: req.body.year,
      dataStartRif: req.body.dataStartRif,
      dataEndRif: req.body.dataEndRif,
      dataInsert: req.body.dataInsert,
      colazione: req.body.colazione,
      spuntino: req.body.spuntino,
      pranzo: req.body.pranzo,
      merenda: req.body.merenda,
      cena: req.body.cena
    });

    // Salva i dati sul mongodb
    const result = await cucinaGenerale.save();

    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      redisClient.del(`cucina*`);
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
    const cucina = await Cucina.remove({ _id: id });

    if (redisClient != undefined && !redisDisabled) {
      redisClient.del(`cucina*`);
    }

    res.status(200);
    res.json(cucina);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

/** */
module.exports = router;
