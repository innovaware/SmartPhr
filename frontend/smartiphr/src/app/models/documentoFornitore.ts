export class DocumentoFornitore {
  static clone(obj: DocumentoFornitore) {
    return JSON.parse(JSON.stringify(obj));
  }

  _id?: string;
  identifyUser?: string;
  filename: string;
  dataupload?: Date;
  note?: string;
  file?: File;
}
