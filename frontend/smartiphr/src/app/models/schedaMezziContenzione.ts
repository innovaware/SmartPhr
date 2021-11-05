
export class schedaMezziContenzione {
    static clone(obj: schedaMezziContenzione) {
      return JSON.parse(JSON.stringify(obj));
    }
    constructor() {
      this.usomezzi = "";
      this.spondine = false;
      this.pozizionespondine = "";
      this.pelvica = false;
      this.pettorina = false;
      this.cinturaaddominale = false;
      this.cinturaletto = false;
      this.fermabraccio = false;
      this.posizionefermabraccio = "";
      this.tavolinocarrozzina = false;
      this.posizionepresenzaconsenso = "";
      this.datainizioingresso = false;
      this.datainizio = "";
      this.motivo = "";
      this.tempi = "";
      this.durata = "";
      this.interruzione = "";
      this.motivointerruzione = "";
      
    }
  
  

    usomezzi: String;
    spondine?: boolean;
    pozizionespondine: String;
    pelvica?: boolean;
    pettorina?: boolean;
    cinturaaddominale?: boolean;
    cinturaletto?: boolean;
    fermabraccio?: boolean;
    posizionefermabraccio: String;
    tavolinocarrozzina?: boolean;
    posizionepresenzaconsenso: String;
    datainizioingresso?: boolean;
    datainizio: String;
    motivo: String;
    tempi: String;
    durata: String;
    interruzione: String;
    motivointerruzione: String;
  }
  
  
  