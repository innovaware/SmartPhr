export class DiarioEducativo {

  static clone(obj: DiarioEducativo) {
    return JSON.parse(JSON.stringify(obj));
  }


  data: Date;
  firma: string;
  contenuto: string;
  user: string;
  _id?:String;
  }
  