
export class Presenze {
  static clone(obj: Presenze) {
    return JSON.parse(JSON.stringify(obj));
  }
    _id?: string;
    nome?: string;
    cognome?: string;
    cf?: string;
    data?: Date;
    mansione?: string;
    turno?: string;
  }

