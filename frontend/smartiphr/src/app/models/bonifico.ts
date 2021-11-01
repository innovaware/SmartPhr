
export class Bonifico {

  static clone(obj: Bonifico) {
    return JSON.parse(JSON.stringify(obj));
  }

  _id?: string;
  identifyUser?: string;
  filename: string;
  dataupload?: Date;
  note?: string;

  file?: File;
}
