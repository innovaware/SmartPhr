export class Fornitore {
  static clone(obj: Fornitore) {
    return JSON.parse(JSON.stringify(obj));
  }
  _id?: string;
  cognome: string;
  nome: string;
  codiceFiscale: string;
  dataNascita: Date;
  comuneNascita: string;
  sesso: String;
  provinciaNascita: string;
  indirizzoNascita: string;
  indirizzoResidenza: string;
  comuneResidenza: string;
  provinciaResidenza: string;
  mansione: string;
  tipoContratto: string;
  telefono: string;
  email: string;


  constructor() {
    this.cognome = "";
    this.nome = "";
    this.codiceFiscale = "";
    this.dataNascita = new Date();
    this.comuneNascita = "";
    this.provinciaNascita = "";
    this.indirizzoNascita = "";
    this.indirizzoResidenza = "";
    this.comuneResidenza = "";
    this.provinciaResidenza = "";
    this.mansione = "";
    this.sesso = "";
    this.telefono = "";
    this.tipoContratto = "";
    this.email = "";
  }
}
