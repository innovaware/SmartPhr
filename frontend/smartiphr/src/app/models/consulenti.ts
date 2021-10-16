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


  /**
   * create
   */
  public static create() {
    return {
      cognome: "",
      nome: "",
      codiceFiscale: "",
      dataNascita: new Date(),
      comuneNascita: "",
      provinciaNascita: "",
      indirizzoNascita: "",
      indirizzoResidenza: "",
      comuneResidenza: "",
      provinciaResidenza: "",
      mansione: "",
      tipologiaContratto: "",
      telefono: "",
      email: "",
    };
  }

  public static check(consulente: Consulenti): boolean {
    return ( consulente.nome != "" && consulente.nome != undefined) &&
           ( consulente.cognome != "" && consulente.cognome != undefined) &&
           ( consulente.codiceFiscale != "" && consulente.codiceFiscale != undefined)
  }
}
