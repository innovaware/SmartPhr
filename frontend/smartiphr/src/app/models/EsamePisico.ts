
export class EsamePisico {
  static clone(obj: EsamePisico) {
    return JSON.parse(JSON.stringify(obj));
  }

  constructor() {
    this.statoEmotivo = [];
    this.personalita = [];
    this.linguaggio = [];
    this.memoria = [];
    this.orientamento = [];
    this.abilitaPercettivo = [];
    this.abilitaEsecutive = [];
    this.ideazione = [];
    this.umore = [];
    this.partecipazioni = "";
    this.ansia = "";
    this.testEsecutivi = "";
  }

    statoEmotivo: string[];
    personalita: string[];
    linguaggio: string[];
    memoria: string[];
    orientamento: string[];
    abilitaPercettivo: string[];
    abilitaEsecutive: string[];
    ideazione: string[];
    umore: string[];

    partecipazioni: string;
    ansia: string;
    testEsecutivi: string;

}
