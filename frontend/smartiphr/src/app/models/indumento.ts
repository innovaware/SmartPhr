export class Indumento {
  nome: string;
  quantita: number;
  carico?: number;
  scarico?: number;
  dataCaricamento?: Date;
  lastChecked?: {
    UserName: string;
    datacheck: Date;
  };
  note?: string;
  _id?: string;
}
