export class Settings {
  _id?: string; // ID opzionale del documento
  alertContratto?: number; // Numero, probabilmente un alert per i contratti
  alertFarmaci?: Number;
  alertDiarioClinico?: number; // Numero, probabilmente un alert per il diario clinico
  menuInvernaleStart?: Date; // Data di inizio del menu invernale
  menuInvernaleEnd?: Date;   // Data di fine del menu invernale
  menuEstivoStart?: Date;    // Data di inizio del menu estivo
  menuEstivoEnd?: Date;      // Data di fine del menu estivo
  ScadenzaPersonalizzato?: number; // Numero, valore personalizzato di scadenza
  turni?: Array<{
    mattina: Array<{
      inizio: number; // Orario di inizio (es. in millisecondi)
      fine: number;   // Orario di fine
    }>;
    pomeriggio: Array<{
      inizio: number; // Orario di inizio
      fine: number;   // Orario di fine
    }>;
    notte: Array<{
      inizio: number; // Orario di inizio
      fine: number;   // Orario di fine
    }>;
  }>;
}
