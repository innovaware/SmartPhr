export class Segnalazione{
  _id?: String
  utenteNome: String;
  utente: String;
  numTicket: Number;
  segnalato: Boolean;
  descrizione: String;
  status: String;
  presoincarico: Boolean;
  risolto: Boolean;
  dataSegnalazione: Date;
  datapresaincarico?: Date;
  datarisoluzione?: Date;
}
