
export class Presenze {
  static clone(obj: Presenze) {
    return JSON.parse(JSON.stringify(obj));
  }
  _id?: string;
  data?: Date;
  user?: string;
  oraInizio?: string;
  oraFine?: string;
  turno?: string;
  nome?: string;
  cognome?: string;
  cf?: string;
  mansione?: string;
}

