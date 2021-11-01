export class Diario {

  static clone(obj: Diario) {
    return JSON.parse(JSON.stringify(obj));
  }


  constructor() {
    this.data = new Date(),
    this.valore = "";
    this.firma = "";
  }

  data: Date;
  valore: string;
  firma: string;
}
