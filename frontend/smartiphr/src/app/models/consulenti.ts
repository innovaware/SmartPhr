export class Consulenti {
  _id?: string;

  cognome: string;
  nome: string;
  codiceFiscale: string;
  dataNascita: Date;
  comuneNascita: string;
  provinciaNascita: string;
  indirizzoNascita: string;
  indirizzoResidenza: string;
  comuneResidenza: string;
  provinciaResidenza: string;
  mansione: string;
  tipologiaContratto: string;
  telefono: string;
  email: String;


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
    this.tipologiaContratto = "";
    this.telefono = "";
    this.email = "";
  }

}
