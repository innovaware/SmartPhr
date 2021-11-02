
export class Asp {
  static clone(obj: Asp) {
    return JSON.parse(JSON.stringify(obj));
  }

  _id?: string;
  cognome: string;
  nome: string;
  email: string;
  user: string;

  group: string;

}
