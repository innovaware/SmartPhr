const express = require("express");
const router = express.Router();
const Cucina = require("../models/cucina");
const CucinaGenerale = require("../models/cucinaGenerale");
const CucinaAmbienti = require("../models/cucinaAmbienti");
const CucinaAmbientiArchivio = require("../models/cucinaAmbientiArchivio");
const CucinaDocumenti= require("../models/cucinaDocumenti");
const CucinaDocumentiAutoControllo = require("../models/cucinaDocumentiAutoControllo");
const CucinaDerranteAlimenti = require("../models/cucinaDerranteAlimenti");
const CucinaDerranteAlimentiArchivio = require("../models/cucinaDerranteAlimentiArchivio");
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

/// CUCINA AMBIENTE

/**
 * Ritorna tutti gli elementi della collection cucinaAmbiente
*/
router.get("/ambiente/getAll", async (req, res) => {
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

/// CUCINA ARCHIVIO AMBIENTE

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

/// CUCINA GENERALE

/**
 * Ritorna la lista del menu generale
 */
router.get("/generale/getAll", async (req, res) => {
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

router.get("/generale/getByType", async (req, res) => {
    const { type } = req.query;
    try {
        const getData = () => {
            return CucinaGenerale.find({
                type: type
            });
        };

        const cucina = await getData();
        res.status(200).json(cucina);

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

/// CUCINA DOCUMENTO CONTROLLO TAMPONI

/**
 * Ritorna tutti gli elementi della collection cucinaDocumenti
*/
router.get("/documenti/getAll", async (req, res) => {
  console.log("Get Cucina Documenti");
  try {
    const getData = () => {
      return CucinaDocumenti.find();
    };

    const cucina = await getData();
    res.status(200).json(cucina);
  
  } catch (err) {
    console.log(err);
    res.status(500).json({ Error: err });
  }
});

/**
 * Ritorna tutti gli elementi della collection cucinaDocumenti 
*/
router.get("/documenti/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const getData = () => {
      return CucinaDocumenti.findById(id);
    };

    const cucina = await getData();
    res.status(200).json(cucina);
  
  } catch (err) {
    console.log(err);
    res.status(500).json({ Error: err });
  }
});

/**
 * Update cucina Documenti
*/
router.put("/documenti/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const cucina = await CucinaDocumenti.updateOne(
      { _id: id },
      {
        $set: {
          filename: req.body.filename,
          dateupload: req.body.dateupload,
          type: req.body.type,
          typeDocument: req.body.typeDocument,
          note: req.body.note,
          cancellato: req.body.cancellato,
          dataCancellazione: req.body.dataCancellazione,
        },
      }
    );

    console.log("Update Cucina Documenti:", cucina);
    
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      const searchTerm = "cucinaALL*";
      redisClient.del(searchTerm);
    }
    

    res.status(200);
    res.json(cucina);
  } catch (err) {
    console.log(err);
    res.status(500).json({ Error: err });
  }
});

/**
 * Inserimento cucina Documenti
 */
router.post("/documenti", async (req, res) => {
  try {
    const cucina = new CucinaDocumenti({
      filename: req.body.filename,
      dateupload: new Date(),
      type: req.body.type,
      typeDocument: req.body.typeDocument,
      note: req.body.note,
      cancellato: req.body.cancellato,
      dataCancellazione: req.body.dataCancellazione,
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
    console.log(err);
    res.status(500);
    res.json({ Error: err });
  }
});

router.delete("/documenti/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await CucinaDocumenti.findByIdAndRemove(id);

    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      redisClient.del(`cucina*`);
    }

    res.status(200);
    res.json(doc);
  } catch (err) {
    console.log(err);
    res.status(500).json({ Error: err });
  }
});

/// CUCINA DOCUMENTI AUTO CONTROLLO

/**
 * Ritorna tutti gli elementi della collection 
*/
router.get("/autocontrollo/getAll", async (req, res) => {
  console.log("Get Cucina Documenti auto controllo");
  try {
    const getData = () => {
      return CucinaDocumentiAutoControllo.find();
    };

    const cucina = await getData();
    res.status(200).json(cucina);
  
  } catch (err) {
    console.log(err);
    res.status(500).json({ Error: err });
  }
});

/**
 * Ritorna tutti gli elementi della collection cucinaDocumenti 
*/
router.get("/autocontrollo/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const getData = () => {
      return CucinaDocumentiAutoControllo.findById(id);
    };

    const cucina = await getData();
    res.status(200).json(cucina);
  
  } catch (err) {
    console.log(err);
    res.status(500).json({ Error: err });
  }
});

/**
 * Update cucina Documenti
*/
router.put("/autocontrollo/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const cucina = await CucinaDocumentiAutoControllo.updateOne(
      { _id: id },
      {
        $set: {
          filename: req.body.filename,
          dateupload: req.body.dateupload,
          type: req.body.type,
          typeDocument: req.body.typeDocument,
          note: req.body.note,
          cancellato: req.body.cancellato,
          dataCancellazione: req.body.dataCancellazione,
        },
      }
    );

    console.log("Update Cucina Documenti:", cucina);
    
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      const searchTerm = "cucinaALL*";
      redisClient.del(searchTerm);
    }
    

    res.status(200);
    res.json(cucina);
  } catch (err) {
    console.log(err);
    res.status(500).json({ Error: err });
  }
});

/**
 * Inserimento cucina Documenti
 */
router.post("/autocontrollo", async (req, res) => {
  try {
    const cucina = new CucinaDocumentiAutoControllo({
      filename: req.body.filename,
      dateupload: new Date(),
      type: req.body.type,
      typeDocument: req.body.typeDocument,
      note: req.body.note,
      cancellato: req.body.cancellato,
      dataCancellazione: req.body.dataCancellazione,
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
    console.log(err);
    res.status(500);
    res.json({ Error: err });
  }
});

router.delete("/autocontrollo/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await CucinaDocumentiAutoControllo.findByIdAndRemove(id);

    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      redisClient.del(`cucina*`);
    }

    res.status(200);
    res.json(doc);
  } catch (err) {
    console.log(err);
    res.status(500).json({ Error: err });
  }
});


/// CUCINA DERRANTE ALIMENTI 

/**
 * Ritorna tutti gli elementi della collection 
*/
router.get("/derranteAlimenti/getAll", async (req, res) => {
  console.log("Get Cucina derrante alimenti");
  try {
    const getData = () => {
      return CucinaDerranteAlimenti.find();
    };

    const cucina = await getData();
    res.status(200).json(cucina);
  
  } catch (err) {
    console.log(err);
    res.status(500).json({ Error: err });
  }
});

/**
 * Ritorna tutti gli elementi della collection cucinaDocumenti 
*/
router.get("/derranteAlimenti/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const getData = () => {
      return CucinaDerranteAlimenti.findById(id);
    };

    const cucina = await getData();
    res.status(200).json(cucina);
  
  } catch (err) {
    console.log(err);
    res.status(500).json({ Error: err });
  }
});

/**
 * Update cucina Documenti
*/
router.put("/derranteAlimenti/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const cucina = await CucinaDerranteAlimenti.updateOne(
      { _id: id },
      {
        $set: {
          nome: req.body.nome,
          dateInsert: req.body.dateInsert,
          note: req.body.note,
          quantita: req.body.quantita,
          unita: req.body.unita,
          idUser: req.body.idUser,
          conforme: req.body.conforme, 
          nonConsumato: req.body.nonConsumato,
          dateScadenza: req.body.dateScadenza
        },
      }
    );
    
    new CucinaDerranteAlimentiArchivio({
      operazione: "Modifica",
      dataOperazione: new Date(),
      idDerranteAlimenti: id,
      nome: req.body.nome,
      dateInsert: req.body.dateInsert,
      note: req.body.note,
      quantita: req.body.quantita,
      unita: req.body.unita,
      idUser: req.body.idUser,
      conforme: req.body.conforme, 
      nonConsumato: req.body.nonConsumato,
      dateScadenza: req.body.dateScadenza
    }).save();

    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      const searchTerm = "cucinaALL*";
      redisClient.del(searchTerm);
    }
    

    res.status(200);
    res.json(cucina);
  } catch (err) {
    console.log(err);
    res.status(500).json({ Error: err });
  }
});

/**
 * Inserimento cucina Documenti
 */
router.post("/derranteAlimenti", async (req, res) => {
  try {
    const cucina = new CucinaDerranteAlimenti({
      nome: req.body.nome,
      dateInsert: req.body.dateInsert,
      note: req.body.note,
      quantita: req.body.quantita,
      unita: req.body.unita,
      idUser: req.body.idUser,
      conforme: req.body.conforme, 
      nonConsumato: req.body.nonConsumato,
      dateScadenza: req.body.dateScadenza

    });

    // Salva i dati sul mongodb
    const result = await cucina.save();
    new CucinaDerranteAlimentiArchivio({
      operazione: "Inserimento",
      dataOperazione: new Date(),
      idDerranteAlimenti: result._id,
      nome: req.body.nome,
      dateInsert: req.body.dateInsert,
      note: req.body.note,
      quantita: req.body.quantita,
      unita: req.body.unita,
      idUser: req.body.idUser,
      conforme: req.body.conforme, 
      nonConsumato: req.body.nonConsumato,
      dateScadenza: req.body.dateScadenza
    }).save();



    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      redisClient.del(`cucina*`);
    }

    res.status(200);
    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(500);
    res.json({ Error: err });
  }
});

router.delete("/derranteAlimenti/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await CucinaDerranteAlimenti.findByIdAndRemove(id);
    new CucinaDerranteAlimentiArchivio({
      operazione: "Cancellazione",
      dataOperazione: new Date(),
      idDerranteAlimenti: id,
      nome: req.body.nome,
      dateInsert: req.body.dateInsert,
      note: req.body.note,
      quantita: req.body.quantita,
      unita: req.body.unita,
      idUser: req.body.idUser,
      conforme: req.body.conforme, 
      nonConsumato: req.body.nonConsumato,
      dateScadenza: req.body.dateScadenza
    }).save();


    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      redisClient.del(`cucina*`);
    }

    res.status(200);
    res.json(doc);
  } catch (err) {
    console.log(err);
    res.status(500).json({ Error: err });
  }
});

router.get("/derranteAlimentiArchivio/getAll", async (req, res) => {
  console.log("Get Cucina derrante alimenti archivio");
  try {
    const getData = () => {
      return CucinaDerranteAlimentiArchivio.find();
    };

    const cucina = await getData();
    res.status(200).json(cucina);
  
  } catch (err) {
    console.log(err);
    res.status(500).json({ Error: err });
  }
});

/**
 * Ritorna tutti gli elementi della collection cucinaDocumenti 
*/
router.get("/derranteAlimentiArchivio/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const getData = () => {
      return CucinaDerranteAlimentiArchivio.findById(id);
    };

    const cucina = await getData();
    res.status(200).json(cucina);
  
  } catch (err) {
    console.log(err);
    res.status(500).json({ Error: err });
  }
});





/** */
module.exports = router;
