const express = require("express");
//const jwt_decode = require("jwt-decode");

const router = express.Router();
const CartellaClinica = require("../models/cartellaClinica");

const redis = require("redis");
const redisPort = process.env.REDISPORT || 6379;
const redisHost = process.env.REDISHOST || "redis";
const redisDisabled = process.env.REDISDISABLE === "true" || false;
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;

const client = redis.createClient(redisPort, redisHost);

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const searchTerm = `CartellaClinica${id}`;
    client.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data && !redisDisabled) {
        console.log(`${searchTerm}: ${data}`);
        res.status(200).send(JSON.parse(data));
      } else {
        const cartellaClinica = await CartellaClinica.find({
          user: id,
        });
        client.setex(searchTerm, redisTimeCache, JSON.stringify(cartellaClinica));
        res.status(200).json(cartellaClinica);
      }
    });

    // const CartellaClinica = await CartellaClinica.find();
    // res.status(200).json(CartellaClinica);
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).json({ Error: err });
  }
});



router.post("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const cartellaClinica = new CartellaClinica({

        ipertensione: req.body.ipertensione,
    diabete: req.body.diabete,
    malatCardiovascolari: req.body.malatCardiovascolari,
    malatCerebrovascolari: req.body.malatCerebrovascolari,
    demenza: req.body.demenza,
    neoplasie: req.body.neoplasie,
    altro: req.body.altro,
    testoAltro: req.body.testoAltro,
    antitetanica: req.body.antitetanica,
    antiepatiteB: req.body.antiepatiteB,
    antinfluenzale: req.body.antinfluenzale,
    altre: req.body.altre,
    testoAltre: req.body.testoAltre,
    attLavorative: req.body.attLavorative,
    scolarita: req.body.scolarita,
    servizioMilitare: req.body.servizioMilitare,
    menarca: req.body.menarca,
    menopausa: req.body.menopausa,
    attFisica: req.body.attFisica,
    alimentazione: req.body.alimentazione,
    alvo: req.body.alvo,
    diurisi: req.body.diurisi,
    alcolici: req.body.alcolici,
    fumo: req.body.fumo,
    sonno: req.body.sonno,


    anamnesiRemota: req.body.anamnesiRemota,
    anamnesiProssima: req.body.anamnesiProssima,
    terapiaDomicilio: req.body.terapiaDomicilio,
    reazioneAFarmaci: req.body.reazioneAFarmaci,


      user: id,

    });

    console.log("Insert CartellaClinica: ", cartellaClinica);

    const result = await CartellaClinica.save();


    const searchTerm = `CartellaClinica${id}`;
    client.del(searchTerm);

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
    const CartellaClinica = await CartellaClinica.updateOne(
      { _id: id },
      {
        $set: {
            ipertensione: req.body.ipertensione,
            diabete: req.body.diabete,
            malatCardiovascolari: req.body.malatCardiovascolari,
            malatCerebrovascolari: req.body.malatCerebrovascolari,
            demenza: req.body.demenza,
            neoplasie: req.body.neoplasie,
            altro: req.body.altro,
            testoAltro: req.body.testoAltro,
            antitetanica: req.body.antitetanica,
            antiepatiteB: req.body.antiepatiteB,
            antinfluenzale: req.body.antinfluenzale,
            altre: req.body.altre,
            testoAltre: req.body.testoAltre,
            attLavorative: req.body.attLavorative,
            scolarita: req.body.scolarita,
            servizioMilitare: req.body.servizioMilitare,
            menarca: req.body.menarca,
            menopausa: req.body.menopausa,
            attFisica: req.body.attFisica,
            alimentazione: req.body.alimentazione,
            alvo: req.body.alvo,
            diurisi: req.body.diurisi,
            alcolici: req.body.alcolici,
            fumo: req.body.fumo,
            sonno: req.body.sonno,


            anamnesiRemota: req.body.anamnesiRemota,
            anamnesiProssima: req.body.anamnesiProssima,
            terapiaDomicilio: req.body.terapiaDomicilio,
            reazioneAFarmaci: req.body.reazioneAFarmaci,
        
        
        },
      }
    );

    const searchTerm = `CartellaClinicaBY${id}`;
    client.del(searchTerm);

    res.status(200);
    res.json(CartellaClinica);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const item = await CartellaClinica.findById(id);
    const identifyUser = item.identifyUser;
    const CartellaClinica = await CartellaClinica.remove({ _id: id });

    let searchTerm = `CartellaClinicaBY${id}`;
    client.del(searchTerm);
    searchTerm = `CARTELLACLINICAALL`;
    client.del(searchTerm);


    res.status(200);
    res.json(CartellaClinica);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

module.exports = router;
