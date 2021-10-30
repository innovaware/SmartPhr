export class SchedaVas {
  static clone(obj: SchedaVas) {
    return JSON.parse(JSON.stringify(obj));
  }

  constructor() {
    this.punteggio = "";
  }

  punteggio: string;
}
