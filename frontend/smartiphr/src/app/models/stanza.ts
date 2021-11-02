export class Stanza {
  static clone(obj: Stanza) {
    return JSON.parse(JSON.stringify(obj));
  }

  numero: number;
  descrizione: string;
  piano: number;
  statusSanif: number;
  statusLetti: number;
  statusArmadio: number;
  statusIgiene: number;
}
