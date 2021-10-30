export class AnticipoFatture {
  static clone(obj: AnticipoFatture) {
    return JSON.parse(JSON.stringify(obj));
  }

  _id?: string;
  identifyUser?: string;
  filename: string;
  dataupload?: Date;
  note?: string;
  file?: File;
}
