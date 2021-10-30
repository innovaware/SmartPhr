
export class NotaCredito {
  static clone(obj: NotaCredito) {
    return JSON.parse(JSON.stringify(obj));
  }
  _id?: string;
  identifyUser?: string;
  filename: string;
  dataupload?: Date;
  note?: string;

  file?: File;
}
