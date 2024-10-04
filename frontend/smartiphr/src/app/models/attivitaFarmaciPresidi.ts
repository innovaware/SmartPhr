export class AttivitaFarmaciPresidi {
  static clone(obj: AttivitaFarmaciPresidi) {
    return JSON.parse(JSON.stringify(obj));
  }

  _id?: String;
  operator?: String;
  operatorName?: String;
  paziente?: String;
  pazienteName?: String;
  elemento?: String;
  elementotype?: String;
  elemento_id?: String;
  qty?: String;
  qtyRes?: String;
  type?: String;
  dataOP?: Date;
  operation?: String;

}
