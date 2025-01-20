export class NewMessage {
  _id: String;
  mittente: String;
  mittenteId: String;
  oggetto: String;
  corpo: String;
  destinatario: String;
  destinatarioId: String;
  letto?: Boolean;
  data?: Date;
}
