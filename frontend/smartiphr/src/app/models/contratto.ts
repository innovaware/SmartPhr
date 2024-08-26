
export class Contratto {

  static clone(obj: Contratto) {
    return JSON.parse(JSON.stringify(obj));
  }

  _id?: string;
  idConsulente?: string;
  filename: string;
  dateupload?: Date;
  dataScadenza?: Date;
  note?: string;
  file?: File;
}
