export class DocumentoDipendente {
  static clone(obj: DocumentoDipendente) {
    return JSON.parse(JSON.stringify(obj));
  }

  _id?: string;
  type?: string;
  filename: string;
  dateupload?: Date;
  dataScadenza?: Date;
  note?: string;
  descrizione?: string;
  filenameesito?: string;
  file?: File;
  accettata?: boolean;
  closed?: boolean;
  dipendente?: String;
}
