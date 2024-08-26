export class AgendaClinica {
  static clone(obj: AgendaClinica) {
    return JSON.parse(JSON.stringify(obj));
  }
  _id?: string;
  paziente: String;
  pazienteName: String;
  dataRequest: Date;
  dataEvento?: Date;
  evento: String;
  status: String;
  tipo: String;
  note: String;
}
