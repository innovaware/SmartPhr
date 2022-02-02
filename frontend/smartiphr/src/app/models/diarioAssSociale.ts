export class DiarioAssSociale {

  static clone(obj: DiarioAssSociale) {
    return JSON.parse(JSON.stringify(obj));
  }


  data: Date;
  firma: string;
  contenuto: string;
  user: string;
  _id?:String;
  }
  