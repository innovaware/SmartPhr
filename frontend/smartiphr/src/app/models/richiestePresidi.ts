export class RichiestePresidi {
  _id?: String;
  materiale: String;
  type: String;
  dataRichiesta: Date;
  dataAcquisto?: Date;
  dataConsegna?: Date;
  status: String;
  dataAnnullamento?: Date;
  dipendente: String;
  dipendenteName: String;
  note?: String;
  quantita: Number;
}
