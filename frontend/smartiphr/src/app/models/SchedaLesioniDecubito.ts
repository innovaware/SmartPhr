export class SchedaLesioniDecubito {
  static clone(obj: SchedaLesioniDecubito) {
    return JSON.parse(JSON.stringify(obj));
  }
  constructor() {
    this.protocolloFisiologicaRigerLattato = "";
    this.protocolloFlittene = "";
    this.escara = "";
    this.emorragica = "";
    this.essudativaNecroticaFibbrinosa = "";
    this.cavitaria = "";
    this.granuleggiante = "";
    this.infetta = "";
  }
  protocolloFisiologicaRigerLattato: string;
  protocolloFlittene: string;
  escara: string;
  emorragica: string;
  essudativaNecroticaFibbrinosa: string;
  cavitaria: string;
  granuleggiante: string;
  infetta: string;
}
