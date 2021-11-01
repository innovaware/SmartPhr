export class SchedaMnar {
  static clone(obj: SchedaMnar) {
    return JSON.parse(JSON.stringify(obj));
  }
  constructor() {
    this.peso = "";
    this.statura = "";
    this.punteggioA = "";
    this.punteggioB = "";
    this.punteggioC = "";
    this.punteggioD = "";
    this.punteggioE = "";
    this.punteggioF1 = "";
    this.punteggioF2 = "";
    this.punteggioScreening = "";
  }

  peso: string;
  statura: string;
  punteggioA: string;
  punteggioB: string;
  punteggioC: string;
  punteggioD: string;

  punteggioE: string;
  punteggioF1: string;
  punteggioF2: string;
  punteggioScreening: string;
}
