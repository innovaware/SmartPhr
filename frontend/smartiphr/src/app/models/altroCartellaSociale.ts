export class AltroCartellaSociale {
    static clone(obj: AltroCartellaSociale) {
      return JSON.parse(JSON.stringify(obj));
    }
    constructor() {
      this.perditaautonomia = false;
      this.statosalute = false;
      this.rapportifamiliaridifficili = false;
      this.solitudine = false;
      this.alloggioinidoneo = false;
      this.impossibfamigliaassistere = false;
      this.trasfdaaltro = false;
      this.istituto = "";
      this.altro = false;
      this.altrotext = "";

      this.invaliditacivile = false;
      this.ausili = false;
      this.ammsostesgno = false;
      this.inabilitazione = false;
      this.interdizione = false;
      this.ausilialtro = "";



      this.dispvisite = false;
      this.ospiteperperiodi = false;
      this.accpervisite = false;
      this.abitazionealtro = "";
      this.bagno = false;
      this.telefono = false;
      this.cambiospessoresidenza = false;
      this.riscaldamento = false;


    }


    perditaautonomia: boolean;
    statosalute: boolean;
    rapportifamiliaridifficili: boolean;
    solitudine: boolean;
    alloggioinidoneo: boolean;
    impossibfamigliaassistere: boolean;
    trasfdaaltro: boolean;
    istituto: String;
    altro: boolean;
    altrotext: String;

    invaliditacivile: boolean;
    assdiaccompagnamento: number;
    accintegrata: number;
    esenzioneticket: boolean;
    ausili: boolean;
    ausilialtro: String;
    interdizione: boolean;
    inabilitazione: boolean;
    ammsostesgno: boolean;


    medicomg: String;
    tel: String;
    referente: String;
    via: String;
    citta: String;
    telref: String;
    nucleo: String;

    dispassFam: number;
    dispvisite: boolean;
    ospiteperperiodi: boolean;
    accpervisite: boolean;
    abitazione: number;
    abitazionealtro: String;
    dislocazione: number;
    barriere: number;
    bagno: boolean;
    telefono: boolean;
    riscaldamento: boolean;
    cambiospessoresidenza: boolean;
    contattimantenuti: number;
  }
  
  