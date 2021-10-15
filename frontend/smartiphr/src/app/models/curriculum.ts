export class Curriculum {
  static create(): Curriculum {
    return {
      filename: "",
      note: "",
      mansione: "", //altro
      nome: "",
      cognome: "",
      codiceFiscale: "",
    };
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
