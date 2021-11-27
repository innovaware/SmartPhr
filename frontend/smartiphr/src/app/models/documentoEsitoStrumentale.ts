export class DocumentoEsitoStrumentale {
  static clone(obj: DocumentoEsitoStrumentale) {
    return JSON.parse(JSON.stringify(obj));
  }

  _id?: string;
  type: string;
  filename: string;
  dateupload?: Date;
  file?: File;
  note?: string;
}
