export interface v1 {
  barriera: number;
  Facilitatore: number;
}

export interface v2 {
  performance: number;
  capacita: number;
}

export interface MenomazioniFunzioniCorporee {
  intellettive: number;
  comportamentali: number;
  sensiorialeDolore: number;
  voceEloquio: number;
  sistemiCEIR: number;
  sistemiDME: number;
  genitoUR: number;
  NMS: number;
  altreFunzioni: number;
}

export interface MenomazioniStruttureCorporee {
  sistemaNervoso: number;
  occhioOrecchio: number;
  voce: number;
  apparatoDigerente: number;
  sistemiCEIR: number;
  sistemaGenitouriano: number;
  movimento: number;
  cute: number;
  altreStrutture: number;
}

export interface FattoriAmbientali {
  prodottiTecnologie: v1;
  cambiamentiAmbiente: v1;
  sostegnoSociale: v1;
  atteggiamenti: v1;
  servizi: v1;
}

export interface Limitazioni {
  apprendimento: v2;
  compiti: v2;
  comunicazione: v2;
  mobilita: v2;
  cura: v2;
  attDomestiche: v2;
  attInterpersonali: v2;
  principaliAreeVita: v2;
  vitaSociale: v2;
}

export class ICF {
  _id?: string;
  menomazioniFunzioniCorporee?: MenomazioniFunzioniCorporee;
  menomazioniStruttureCorporee?: MenomazioniStruttureCorporee;
  fattoriAmbientali?: FattoriAmbientali;
  limitazioni?: Limitazioni;

  constructor() {
    this.menomazioniFunzioniCorporee = {
      intellettive: 0,
      comportamentali: 0,
      sensiorialeDolore: 0,
      voceEloquio: 0,
      sistemiCEIR: 0,
      sistemiDME: 0,
      genitoUR: 0,
      NMS: 0,
      altreFunzioni: 0
    };

    this.menomazioniStruttureCorporee = {
      sistemaNervoso: 0,
      occhioOrecchio: 0,
      voce: 0,
      apparatoDigerente: 0,
      sistemiCEIR: 0,
      sistemaGenitouriano: 0,
      movimento: 0,
      cute: 0,
      altreStrutture: 0
    };

    this.fattoriAmbientali = {
      prodottiTecnologie: { barriera: 0, Facilitatore: 0 },
      cambiamentiAmbiente: { barriera: 0, Facilitatore: 0 },
      sostegnoSociale: { barriera: 0, Facilitatore: 0 },
      atteggiamenti: { barriera: 0, Facilitatore: 0 },
      servizi: { barriera: 0, Facilitatore: 0 }
    };

    this.limitazioni = {
      apprendimento: { performance: 0, capacita: 0 },
      compiti: { performance: 0, capacita: 0 },
      comunicazione: { performance: 0, capacita: 0 },
      mobilita: { performance: 0, capacita: 0 },
      cura: { performance: 0, capacita: 0 },
      attDomestiche: { performance: 0, capacita: 0 },
      attInterpersonali: { performance: 0, capacita: 0 },
      principaliAreeVita: { performance: 0, capacita: 0 },
      vitaSociale: { performance: 0, capacita: 0 }
    };
  }


  static clone(obj: ICF) {
    return JSON.parse(JSON.stringify(obj));
  }
}
