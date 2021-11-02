export class Fatture {
  static clone(obj: Fatture) {
    return JSON.parse(JSON.stringify(obj));
  }
  _id?: string;
  identifyUser?: string;
  filename: string;
  dataupload?: Date;
  note?: string;
  file?: File;
}
