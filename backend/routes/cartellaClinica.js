const express = require("express");
const router = express.Router();
const CartellaClinica = require("../models/cartellaClinica");
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    const getData = () => {
      return CartellaClinica.findOne({
        user: id,
      });
    };

    if (redisClient == undefined || redisDisabled) {
      const eventi = await getData();
      res.status(200).json(eventi);
      return;
    }

    const searchTerm = `CARTELLACLINICA${id}`;
    client.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data) {
        console.log(`${searchTerm}: ${data}`);
        res.status(200).send(JSON.parse(data));
      } else {
        const cartellaClinica = await getData();
        client.setex(
          searchTerm,
          redisTimeCache,
          JSON.stringify(cartellaClinica)
        );
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

      tipocostituzionale: req.body.tipocostituzionale,
      condizionigenerali: req.body.condizionigenerali,
      nutrizione: req.body.nutrizione,
      cute: req.body.cute,
      sistemalinfo: req.body.sistemalinfo,
      capocollo: req.body.capocollo,
      protesi: req.body.apparatourogenitale,
      apparatourogenitale: req.body.apparatourogenitale,
      apparatomuscholoscheletrico: req.body.apparatomuscholoscheletrico,
      apparatocardio: req.body.apparatocardio,
      frequenza: req.body.frequenza,
      pressionearteriosa: req.body.pressionearteriosa,
      polsiarteriosi: req.body.polsiarteriosi,
      apparatorespiratorio: req.body.apparatorespiratorio,
      addome: req.body.addome,
      fegato: req.body.fegato,
      milza: req.body.milza,

      facies: req.body.facies,
      stato_coscienza: req.body.stato_coscienza,
      stato_emotivo: req.body.stato_emotivo,
      comportamento: req.body.comportamento,
      linguaggio: req.body.linguaggio,
      concentrazione: req.body.concentrazione,
      disturbi_pensiero: req.body.disturbi_pensiero,
      orientamentopersonale: req.body.orientamentopersonale,
      orientamentotemporale: req.body.orientamentotemporale,
      orientamentospaziale: req.body.orientamentospaziale,
      stazioneeretta: req.body.stazioneeretta,
      seduto: req.body.seduto,
      altreanomalie: req.body.altreanomalie,
      romberg: req.body.romberg,
      olfatto: req.body.olfatto,
      pupille: req.body.pupille,
      visus: req.body.visus,
      campovisivo: req.body.campovisivo,
      fondooculare: req.body.fondooculare,
      movimentioculari: req.body.movimentioculari,
      masticazione: req.body.masticazione,
      motilitafacciale: req.body.motilitafacciale,
      funzioneuditiva: req.body.funzioneuditiva,
      funzionevestibolare: req.body.funzionevestibolare,
      motilitafaringea: req.body.motilitafaringea,
      trofismo: req.body.trofismo,
      articolazioneparola: req.body.articolazioneparola,
      annotazioni: req.body.annotazioni,
      tono: req.body.tono,
      forza: req.body.forza,
      coordinazione: req.body.coordinazione,
      riflessiosteotendinei: req.body.riflessiosteotendinei,
      sensibilitasuper: req.body.sensibilitasuper,
      sensibilitaprofonda: req.body.sensibilitaprofonda,
      funzionicerebellari: req.body.funzionicerebellari,
      funzioniextrapirabidali: req.body.funzioniextrapirabidali,
      segnimeningei: req.body.segnimeningei,
      sfinteri: req.body.sfinteri,
      annotazioniriflessi: req.body.annotazioniriflessi,

      valsociale: req.body.valsociale,
      valeducativa: req.body.valeducativa,
      valpsicologica: req.body.valpsicologica,
      valmotoria: req.body.valmotoria,

      user: id,
    });

    console.log("Insert CartellaClinica: ", cartellaClinica);

    const result = await cartellaClinica.save();
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      redisClient.del(`CARTELLACLINICA${id}`);
    }

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
    const cartellaClinica = await CartellaClinica.updateOne(
      { user: id },
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

          tipocostituzionale: req.body.tipocostituzionale,
          condizionigenerali: req.body.condizionigenerali,
          nutrizione: req.body.nutrizione,
          cute: req.body.cute,
          sistemalinfo: req.body.sistemalinfo,
          capocollo: req.body.capocollo,
          protesi: req.body.apparatourogenitale,
          apparatourogenitale: req.body.apparatourogenitale,
          apparatomuscholoscheletrico: req.body.apparatomuscholoscheletrico,
          apparatocardio: req.body.apparatocardio,
          frequenza: req.body.frequenza,
          pressionearteriosa: req.body.pressionearteriosa,
          polsiarteriosi: req.body.polsiarteriosi,
          apparatorespiratorio: req.body.apparatorespiratorio,
          addome: req.body.addome,
          fegato: req.body.fegato,
          milza: req.body.milza,

          facies: req.body.facies,
          stato_coscienza: req.body.stato_coscienza,
          stato_emotivo: req.body.stato_emotivo,
          comportamento: req.body.comportamento,
          linguaggio: req.body.linguaggio,
          concentrazione: req.body.concentrazione,
          disturbi_pensiero: req.body.disturbi_pensiero,
          orientamentopersonale: req.body.orientamentopersonale,
          orientamentotemporale: req.body.orientamentotemporale,
          orientamentospaziale: req.body.orientamentospaziale,
          stazioneeretta: req.body.stazioneeretta,
          seduto: req.body.seduto,
          altreanomalie: req.body.altreanomalie,
          romberg: req.body.romberg,
          olfatto: req.body.olfatto,
          pupille: req.body.pupille,
          visus: req.body.visus,
          campovisivo: req.body.campovisivo,
          fondooculare: req.body.fondooculare,
          movimentioculari: req.body.movimentioculari,
          masticazione: req.body.masticazione,
          motilitafacciale: req.body.motilitafacciale,
          funzioneuditiva: req.body.funzioneuditiva,
          funzionevestibolare: req.body.funzionevestibolare,
          motilitafaringea: req.body.motilitafaringea,
          trofismo: req.body.trofismo,
          articolazioneparola: req.body.articolazioneparola,
          annotazioni: req.body.annotazioni,
          tono: req.body.tono,
          forza: req.body.forza,
          coordinazione: req.body.coordinazione,
          riflessiosteotendinei: req.body.riflessiosteotendinei,
          sensibilitasuper: req.body.sensibilitasuper,
          sensibilitaprofonda: req.body.sensibilitaprofonda,
          funzionicerebellari: req.body.funzionicerebellari,
          funzioniextrapirabidali: req.body.funzioniextrapirabidali,
          segnimeningei: req.body.segnimeningei,
          sfinteri: req.body.sfinteri,
          annotazioniriflessi: req.body.annotazioniriflessi,

          valsociale: req.body.valsociale,
          valeducativa: req.body.valeducativa,
          valpsicologica: req.body.valpsicologica,
          valmotoria: req.body.valmotoria,
        },
      }
    );
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      redisClient.del(`CARTELLACLINICABY${id}`);
    }

    res.status(200);
    res.json(cartellaClinica);
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
    redisClient = req.app.get("redis");
    redisDisabled = req.app.get("redisDisabled");

    if (redisClient != undefined && !redisDisabled) {
      redisClient.del(`CARTELLACLINICA*`);
    }

    res.status(200);
    res.json(CartellaClinica);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

module.exports = router;
