const express = require("express");
const router = express.Router();
const Pazienti = require("../models/pazienti");
const redis = require("redis");
const parametriVitali = require("../models/parametriVitali");
// const redisPort = process.env.REDISPORT || 6379;
// const redisHost = process.env.REDISHOST || "redis";
// const redisDisabled = process.env.REDISDISABLE === "true" || false;
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;

// const client = redis.createClient(redisPort, redisHost);
const searchTerm = `PAZIENTIALL`;

router.get("/", async (req, res) => {
  try {
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    //redisDisabled = false;
    const showOnlyCancellati = req.query.show == "deleted";
    const showAll = req.query.show == "all";

    const query = {
      $or: [{ cancellato: { $exists: false } }, { cancellato: false }],
    };

    const getData = (query) => {
      return Pazienti.find(query);
    };

  
    if (showOnlyCancellati || showAll) {
      console.log("Show all or deleted");
      let query = {};
      if (showOnlyCancellati) {
        query = { cancellato: true };
      }

      const pazienti = await getData(query);
      res.status(200).json(pazienti);
    } else {
      if (redisClient == undefined || redisDisabled) {
        const pazienti = await getData(query)

        if (pazienti.length > 0) res.status(200).json(pazienti);
        else res.status(404).json({ error: "No patients found" });

        return;
      }

      redisClient.get(searchTerm, async (err, data) => {
        if (err) throw err;

        if (data) {
          res.status(200).send(JSON.parse(data));
        } else {
          const pazienti = await getData(query);

          if (pazienti.length > 0) res.status(200).json(pazienti);
          else res.status(404).json({ error: "No patients found" });

          redisClient.setex(
            searchTerm,
            redisTimeCache,
            JSON.stringify(pazienti)
          );
        }
      });
    }
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).json({ Error: err });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const getData = (query) => {
    return Pazienti.find(query);
  };

  try {
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (id == undefined || id === "undefined") {
      console.log("Error id is not defined ", id);
      res.status(404).json({ Error: "Id not defined" });
      return;
    }

    query = {
      $and: [
        {
          $or: [{ cancellato: { $exists: false } }, { cancellato: false }],
        },
        { _id: id },
      ],
    };

    if (redisClient == undefined || redisDisabled) {
      const pazienti = await getData(query);

      if (pazienti != null) res.status(200).json(pazienti);
      else res.status(404).json({ error: "No patient found" });
    }

    const searchTerm = `PAZIENTIBY${id}`;
    redisClient.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data) {
        res.status(200).send(JSON.parse(data));
      } else {
        const pazienti = await getData(query);

        redisClient.setex(searchTerm, redisTimeCache, JSON.stringify(pazienti));
        if (pazienti != null) res.status(200).json(pazienti);
        else res.status(404).json({ error: "No patient found" });
      }
    });
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

// Recupera lista pazienti associati alla camera
router.get("/camera/:idCamera", async (req, res) => {
  const { idCamera } = req.params;

  const getData = (query) => {
    //console.log("Search by camera: ", query);
    return Pazienti.find(query);
  };

  try {
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (idCamera == undefined || idCamera === "undefined") {
      console.log("Error id is not defined ", idCamera);
      res.status(404).json({ Error: "Id not defined" });
      return;
    }

    query = {
      $and: [
        {
          $or: [{ cancellato: { $exists: false } }, { cancellato: false }],
        },
        { idCamera: idCamera },
      ],
    };

    const pazienti = await getData(query);

    if (pazienti != null) res.status(200).json(pazienti);
    else res.status(404).json({ error: "No patient found" });


  } catch (err) {
    res.status(500).json({ Error: err });
  }
});


router.post("/", async (req, res) => {
  try {

    console.log('schedaAssSociale: ' + JSON.stringify(req.body.schedaAssSociale));
    const pazienti = new Pazienti({
      cognome: req.body.cognome,
      nome: req.body.nome,
      sesso: req.body.sesso,
      luogoNascita: req.body.luogoNascita,
      dataNascita: req.body.dataNascita,
      indirizzoResidenza: req.body.indirizzoResidenza,
      comuneResidenza: req.body.comuneResidenza,
      provinciaResidenza: req.body.provinciaResidenza,
      statoCivile: req.body.statoCivile,
      figli: req.body.figli,
      scolarita: req.body.scolarita,
      situazioneLavorativa: req.body.situazioneLavorativa,
      personeRiferimento: req.body.personeRiferimento,
      telefono: req.body.telefono,
      dataIngresso: req.body.dataIngresso,
      indirizzoNascita: req.body.indirizzoNascita,
      comuneNascita: req.body.comuneNascita,
      provinciaNascita: req.body.provinciaNascita,
      codiceFiscale: req.body.codiceFiscale,

      ricovero: req.body.ricovero,
      numstanza: req.body.numstanza,
      numletto: req.body.numletto,
      diagnosiingresso: req.body.diagnosiingresso,
      allergie: req.body.allergie,

      idCamera: req.body.idCamera,

      schedaInfermeristica: req.body.schedaInfermeristica,
      schedaClinica: req.body.schedaClinica,

      schedaAssSociale: req.body.schedaAssSociale,
      schedaEducativa: req.body.schedaEducativa,
      valutazioneMotoria: req.body.valutazioneMotoria,
      areaRiabilitativa: req.body.areaRiabilitativa,
      areaRiabilitativaProgramma: req.body.areaRiabilitativaProgramma,
      areaRiabilitativaDiario: req.body.areaRiabilitativaDiario,
    });

    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      //const searchTerm = `PAZIENTIALL${skip}${limit}${sortOrder}`;
      const searchTerm = `PAZIENTIALL`;
      redisClient.del(searchTerm);
    }

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
    if (id == undefined || id === "undefined") {
      console.log("Error id is not defined ", id);
      res.status(404).json({ Error: "Id not defined" });
      return;
    }
console.log('req.body.schedaAssSociale: ' + JSON.stringify(req.body.schedaAssSociale) );
    const pazienti = await Pazienti.updateOne(
      { _id: id },
      {
        $set: {
          cognome: req.body.cognome,
          nome: req.body.nome,
          sesso: req.body.sesso,
          luogoNascita: req.body.luogoNascita,
          dataNascita: req.body.dataNascita,
          indirizzoResidenza: req.body.indirizzoResidenza,
          comuneResidenza: req.body.comuneResidenza,
          provinciaResidenza: req.body.provinciaResidenza,
          statoCivile: req.body.statoCivile,
          figli: req.body.figli,
          scolarita: req.body.scolarita,
          situazioneLavorativa: req.body.situazioneLavorativa,
          personeRiferimento: req.body.personeRiferimento,
          telefono: req.body.telefono,
          dataIngresso: req.body.dataIngresso,
          indirizzoNascita: req.body.indirizzoNascita,
          comuneNascita: req.body.comuneNascita,
          provinciaNascita: req.body.provinciaNascita,
          codiceFiscale: req.body.codiceFiscale,


          ricovero: req.body.ricovero,
          numstanza: req.body.numstanza,
          numletto: req.body.numletto,
          diagnosiingresso: req.body.diagnosiingresso,
          allergie: req.body.allergie,

          idCamera: req.body.idCamera,

          schedaInfermeristica: req.body.schedaInfermeristica,
          schedaClinica: req.body.schedaClinica,
          schedaPisico: req.body.schedaPisico,

          schedaAssSociale: req.body.schedaAssSociale,
          schedaEducativa: req.body.schedaEducativa,
          valutazioneMotoria: req.body.valutazioneMotoria,
          areaRiabilitativa: req.body.areaRiabilitativa,
          areaRiabilitativaProgramma: req.body.areaRiabilitativaProgramma,
          areaRiabilitativaDiario: req.body.areaRiabilitativaDiario,
        },
      }
    );

    //console.log("Update paziente: ", pazienti);

    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      const searchTerm = `PAZIENTIBY${id}`;
      redisClient.del(searchTerm);
    }

    res.status(200);
    res.json(pazienti);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (id == undefined || id === "undefined") {
      console.log("Error id is not defined ", id);
      res.status(404).json({ Error: "Id not defined" });
      return;
    }

    if (id == null) {
      res.status(400).json({ error: "id not valid" });
    }

    const pazienti = await Pazienti.updateOne(
      { _id: id },
      {
        $set: {
          cancellato: true,
          dataCancellazione: new Date(),
        },
      }
    );

    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      const searchTerm = `PAZIENTIBY${id}`;
      redisClient.del(searchTerm);
    }

    res.status(200);
    res.json(pazienti);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

// PARAMETRI VITALI

// id = idPaziente
// TODO find to date
router.get("/parametriVitali/:id/:dateRif", async (req, res) => {
  const { id, dateRif } = req.params;
  try {
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    const getData = () => {
      return parametriVitali.find({
        $and: [{ idPaziente: id }, { dateRif: dateRif }],
      });
    };

    if (id == undefined || id === "undefined") {
      console.log("Error id is not defined ", id);
      res.status(404).json({ Error: "Id not defined" });
      return;
    }

    if (redisClient == undefined || redisDisabled) {
      const parametri = await getData();

      if (parametri != null) res.status(200).json(parametri);
      else res.status(404).json({ error: "No parametriVitali found" });
      return;
    }

    const searchTerm = `PARAMETRIVITALI${id}${dateRif}`;
    redisClient.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data) {
        res.status(200).send(JSON.parse(data));
      } else {
        const parametri = await getData();

        redisClient.setex(
          searchTerm,
          redisTimeCache,
          JSON.stringify(parametri)
        );
        if (parametri != null) res.status(200).json(parametri);
        else res.status(404).json({ error: "No parametriVitali found" });
      }
    });
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

router.put("/parametriVitali/:id/:dateRif", async (req, res) => {
  try {
    const { id, dateRif } = req.params;
    const data = req.body;
    if (id == undefined || id === "undefined") {
      console.log("Error id is not defined ", id);
      res.status(404).json({ Error: "Id not defined" });
      return;
    }

    if (dateRif == undefined || dateRif === "undefined") {
      console.log("Error dateRif is not defined ", dateRif);
      res.status(404).json({ Error: "dateRif not defined" });
      return;
    }

    if (data == undefined || data === "undefined") {
      console.log("Error data is not defined ", id);
      res.status(404).json({ Error: "Data not defined" });
      return;
    }

    const parametri = await parametriVitali.updateOne(
      { $and: [{ idPaziente: id }, { dateRif: dateRif }] },
      {
        $set: {
          dateRif: dateRif,
          data: data,
        },
      },
      { upsert: true }
    );

    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      const searchTerm = `PARAMETRIVITALI${id}${dateRif}`;
      redisClient.del(searchTerm);
    }

    res.status(200);
    res.json(parametri);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

// SCHEDA PSICOLOGICA
router.get("/schedaPsicologica/:id", async (req, res) => {
  const { id } = req.params;
  try {
    if (id == undefined || id === "undefined") {
      console.log("Error id is not defined ", id);
      res.status(404).json({ Error: "Id not defined" });
      return;
    }

    const getData = () => {
      return Pazienti.findOne({
        $and: [
          {
            $or: [{ cancellato: { $exists: false } }, { cancellato: false }],
          },
          { _id: id },
        ],
      });
    };

    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient == undefined || redisDisabled) {
      const pazienti = await getData();
      if (pazienti != null) res.status(200).json(pazienti.schedaPisico);
      else res.status(404).json({ error: "No patient found" });
      return;
    }

    const searchTerm = `PAZIENTIBY${id}`;
    redisClient.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data && !redisDisabled) {
        res.status(200).send(JSON.parse(data.schedaPisico));
      } else {
        const pazienti = await getData();
        redisClient.setex(searchTerm, redisTimeCache, JSON.stringify(pazienti));
        if (pazienti != null) res.status(200).json(pazienti.schedaPisico);
        else res.status(404).json({ error: "No patient found" });
      }
    });
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

router.put("/schedaPsicologica/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    if (id == undefined || id === "undefined") {
      console.log("Error id is not defined ", id);
      res.status(404).json({ Error: "Id not defined" });
      return;
    }

    if (data == undefined || data === "undefined") {
      console.log("Error data is not defined ", id);
      res.status(404).json({ Error: "Data not defined" });
      return;
    }

    const parametri = await Pazienti.updateOne(
      { _id: id },
      {
        $set: {
          schedaPisico: data,
        },
      }
    );

    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      const searchTerm = `PAZIENTIBY${id}`;
      redisClient.del(searchTerm);
    }

    res.status(200);
    res.json(parametri);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

module.exports = router;
