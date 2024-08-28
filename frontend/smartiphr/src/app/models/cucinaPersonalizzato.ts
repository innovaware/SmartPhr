export class CucinaPersonalizzato {
  _id?: String;
  paziente: String;
  pazienteName: String;
  dataCreazione: Date;
  dataUltimaModifica?: Date;
  dataInizio?: Date;
  dataFine?: Date;
  giornoRif: String;
  giornoRifNum?: Number;
  menuColazione?: String;
  menuPranzo?: String;
  menuCena?: String;
  menuSpuntino?: String;
  menuMerenda?: String;
  dataScadenza?: Date;
  personalizzatoColazione?: String;
  personalizzatoPranzo?: String;
  personalizzatoCena?: String;
  active: Boolean;
}
