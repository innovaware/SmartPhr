export class AttivitaRifacimentoLetti {
  static clone(obj: AttivitaRifacimentoLetti) {
    return JSON.parse(JSON.stringify(obj));
  }


  _id?: string;
  tipo: String;
  carico: Number;
  scarico: Number;
  laceratiNum?: Number;
  dataUltimaModifica: Date;
  firma: String;
  isInternal?: Boolean;
  operatore: String;
  turno: String;

}
