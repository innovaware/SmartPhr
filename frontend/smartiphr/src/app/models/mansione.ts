export class Mansione {
  static clone(obj: Mansione) {
    return JSON.parse(JSON.stringify(obj));
  }
  _id?: string;
  descrizione: string;
  codice: string;
}
