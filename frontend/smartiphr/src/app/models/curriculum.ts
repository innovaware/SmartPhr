export class Curriculum {
  static check(curriculum: Curriculum): boolean {
    return ( curriculum.nome != "" && curriculum.nome != undefined) &&
           ( curriculum.cognome != "" && curriculum.cognome != undefined) &&
           ( curriculum.codiceFiscale != "" && curriculum.codiceFiscale != undefined) &&
           ( curriculum.file != undefined)
  }

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
