
export class Fornitore {
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

  public static empty(): any {
    return {
      cognome: "",
      nome: "",
      sesso: "",
      luogoNascita: "",
      dataNascita: undefined,
      indirizzoResidenza: "",
      comuneResidenza: "",
      provinciaResidenza: "",
      statoCivile: "",
      figli: 0,
      scolarita: "",
      situazioneLavorativa: "",
      personeRiferimento: "",
      telefono: "",
      dataIngresso: new Date(),
      provincia: "",
      localita: "",
      comuneNascita: "",
      provinciaNascita: "",
      cartellaClinica: [],
    };
  }
}
