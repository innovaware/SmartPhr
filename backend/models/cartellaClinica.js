const mongoose = require("mongoose");

const CartellaClinicaSchema = mongoose.Schema({
    ipertensione: Boolean,
    diabete: Boolean,
    malatCardiovascolari: Boolean,
    malatCerebrovascolari: Boolean,
    demenza: Boolean,
    neoplasie: Boolean,
    altro: Boolean,
    testoAltro: String,
    antitetanica: Boolean,
    antiepatiteB: Boolean,
    antinfluenzale: Boolean,
    altre: Boolean,
    testoAltre: String,
    attLavorative: String,
    scolarita: String,
    servizioMilitare: String,
    menarca: String,
    menopausa: String,
    attFisica: String,
    alimentazione: String,
    alvo: String,
    diurisi: String,
    alcolici: String,
    fumo: String,
    sonno: String,


    anamnesiRemota: String,
    anamnesiProssima: String,
    terapiaDomicilio: String,
    reazioneAFarmaci: String,



    tipocostituzionale: String,
    condizionigenerali: String,
    nutrizione: String,
    cute: String,
    sistemalinfo: String,
    capocollo: String,
    protesi: String,
    apparatourogenitale:String,
    apparatomuscholoscheletrico: String,
    apparatocardio: String,
    frequenza: String,
    pressionearteriosa: String,
    polsiarteriosi: String,
    apparatorespiratorio: String,
    addome: String,
    fegato: String,
    milza: String,



    facies:String,
    stato_coscienza:String,
    stato_emotivo:String,
    comportamento:String,
    linguaggio:String,
    concentrazione:String,
    disturbi_pensiero:String,
    orientamentopersonale:String,
    orientamentotemporale:String,
    orientamentospaziale:String,
    stazioneeretta:String,
    seduto:String,
    altreanomalie:String,
    romberg:String,
    olfatto:String,
    pupille:String,
    visus:String,
    campovisivo:String,
    fondooculare:String,
    movimentioculari:String,
    masticazione:String,
     motilitafacciale:String,
     funzioneuditiva:String,
     funzionevestibolare:String,
     motilitafaringea:String,
     trofismo:String,
     articolazioneparola:String,
     annotazioni:String,
     tono:String,
     forza:String,
     coordinazione:String,
     riflessiosteotendinei:String,
     sensibilitasuper:String,
     sensibilitaprofonda:String,
     funzionicerebellari:String,
     funzioniextrapirabidali:String,
     segnimeningei:String,
     sfinteri:String,
     annotazioniriflessi:String,


    valsociale: String,
    valeducativa: String,
    valpsicologica: String,
    valmotoria: String,
    


    user: String,
   





});

module.exports = mongoose.model(
  "CartellaClinica",
  CartellaClinicaSchema,
  "cartellaClinica"
);
