export class Curriculum {
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
