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
  provinciaNascita: string;
  indirizzoNascita: string;
  indirizzoResidenza: string;
  comuneResidenza: string;
  provinciaResidenza: string;
  mansione: string;
  tipoContratto: string;
  telefono: string;
  email: string;

  public update(fornitore: Fornitore): void {
    this.cognome = fornitore.cognome;
    this.nome = fornitore.nome;
    this.codiceFiscale = fornitore.codiceFiscale;
    this.dataNascita = fornitore.dataNascita;
    this.indirizzoResidenza = fornitore.indirizzoResidenza;
    this.comuneResidenza = fornitore.comuneResidenza;
    this.provinciaResidenza = fornitore.provinciaResidenza;
    this.mansione = fornitore.mansione;
    this.telefono = fornitore.telefono;
    this.indirizzoNascita = fornitore.indirizzoNascita;
    this.comuneNascita = fornitore.comuneNascita;
    this.provinciaNascita = fornitore.provinciaNascita;
    this.email = fornitore.email;
    this.tipoContratto = fornitore.tipoContratto;
  }

  constructor() {
    this.cognome = "";
    this.nome = "";
    this.dataNascita = undefined;
    this.indirizzoResidenza = "";
    this.comuneResidenza = "";
    this.provinciaResidenza = "";
    this.telefono = "";
    this.comuneNascita = "";
    this.provinciaNascita = "";
  }
}
