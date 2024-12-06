const mongoose = require("mongoose");

// Definizione dello schema per la collezione "settings"
const settingsSchema = mongoose.Schema({
    alertContratto: Number, // Numero, probabilmente un alert per i contratti
    alertFarmaci: Number,
    alertDiarioClinico: Number, // Numero, probabilmente un alert per il diario clinico
    menuInvernaleStart: Date, // Data di inizio del menu invernale
    menuInvernaleEnd: Date,   // Data di fine del menu invernale
    menuEstivoStart: Date,    // Data di inizio del menu estivo
    menuEstivoEnd: Date,      // Data di fine del menu estivo
    ScadenzaPersonalizzato: Number, // Numero, probabilmente un valore personalizzato di scadenza
    turni: [
        {
            mattina: [ // Array di oggetti che rappresentano i turni mattutini
                {
                    inizio: Number, // Orario di inizio (rappresentato come numero, es. ore in millisecondi)
                    fine: Number    // Orario di fine
                }
            ],
            pomeriggio: [ // Array di oggetti per i turni pomeridiani
                {
                    inizio: Number, // Orario di inizio
                    fine: Number    // Orario di fine
                }
            ],
            notte: [ // Array di oggetti per i turni notturni
                {
                    inizio: Number, // Orario di inizio
                    fine: Number    // Orario di fine
                }
            ]
        }
    ]
});

// Esportazione del modello "Settings" basato sullo schema "settingsSchema"
module.exports = mongoose.model("Settings", settingsSchema, "settings");
