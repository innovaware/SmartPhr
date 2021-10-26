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



    user: String,
   





});

module.exports = mongoose.model(
  "CartellaClinica",
  CartellaClinicaSchema,
  "cartellaClinica"
);
