export class Curriculum {

  static clone(obj: Curriculum) {
    return JSON.parse(JSON.stringify(obj));
  }

  constructor() {
    this.filename = "";
    this.note = "";
    this.mansione = "";
    this.nome = "";
    this.cognome = "";
    this.codiceFiscale = "";
  }

  _id?: string;
  filename: string;
  note?: string;
  file?: File;
  dateupload?: Date;
  mansione: string;
  nome: string;
  cognome: string;
  codiceFiscale: string;
}
