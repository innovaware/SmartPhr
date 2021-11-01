export class SchedaUlcere {
  static clone(obj: SchedaUlcere) {
    return JSON.parse(JSON.stringify(obj));
  }
  constructor() {

    this.indiceNorton = "";
    this.totale = "";
  }

  indiceNorton: string;
  totale: string;
}
