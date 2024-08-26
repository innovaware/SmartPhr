export class LettoCamera {
  static clone(obj: LettoCamera) {
    return JSON.parse(JSON.stringify(obj));
  }


  _id?: string;
  tipo: String;
  carico: Number;
  scarico: Number;
  giacenza: Number;
  lacerati?: Boolean;
  laceratiNum?: Number;
  dataUltimaModifica?: Date;
  firma: String;
  isInternal: Boolean;
  operatore?: String;

}
