
export class Documento {
  static clone(obj: Documento) {
    return JSON.parse(JSON.stringify(obj));
  }

  _id?: string;
  path: string;
  typeDocument: string;
  name: string;
  dateupload: Date;
  binaryFile?: FormData;
}
