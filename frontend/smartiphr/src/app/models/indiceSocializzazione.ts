
export class IndiceSocializzazione {
    static clone(obj: IndiceSocializzazione) {
      return JSON.parse(JSON.stringify(obj));
    }
    constructor() {
      this.adattamentoSociale = "";
      this.relAmicizia = "";
      this.integrazioneGruppo = "";
      this.gradoDisp = "";
      this.rapportoFamiglia = "";
      this.attivitaSociale = "";
      this.attivitaRSA = "";
      this.data = new Date();
    }
    
    adattamentoSociale: String;
    relAmicizia: String;
    integrazioneGruppo: String;
    gradoDisp: String;
    rapportoFamiglia: String;
    attivitaSociale: String;
    attivitaRSA: String;
    data: Date;
    totale: number;

  }
  
  
  