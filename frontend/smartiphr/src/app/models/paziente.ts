import { SchedaInfermeristica } from './SchedaInfermeristica';

export class Paziente {
  _id?: string;
  cognome: string;
  nome: string;
  sesso: string;
  luogoNascita: string;
  dataNascita: Date;
  indirizzoResidenza: string;
  comuneResidenza: string;
  provinciaResidenza: string;
  statoCivile: string;
  figli: number;
  scolarita: string;
  situazioneLavorativa: string;
  personeRiferimento: string;
  telefono: string;
  dataIngresso: Date;
  indirizzoNascita: string;
  comuneNascita: string;
  provinciaNascita: string;
  provenienza?: string;


  schedaInfermeristica: SchedaInfermeristica;


  public update(paziente: Paziente): void {
    this.cognome = paziente.cognome;
    this.nome = paziente.nome;
    this.sesso = paziente.sesso;
    this.luogoNascita = paziente.luogoNascita;
    this.dataNascita = paziente.dataNascita;
    this.indirizzoResidenza = paziente.indirizzoResidenza;
    this.comuneResidenza = paziente.comuneResidenza;
    this.provinciaResidenza = paziente.provinciaResidenza;
    this.statoCivile = paziente.statoCivile;
    this.figli = paziente.figli;
    this.scolarita = paziente.scolarita;
    this.situazioneLavorativa = paziente.situazioneLavorativa;
    this.personeRiferimento = paziente.personeRiferimento;
    this.telefono = paziente.telefono;
    this.dataIngresso = paziente.dataIngresso;
    this.provinciaNascita = paziente.provinciaNascita;
    this.indirizzoNascita = paziente.indirizzoNascita;
    this.provenienza = paziente.provenienza;
    this.comuneNascita = paziente.comuneNascita;
  }

  constructor() {
    this.cognome= "";
    this.nome= "";
    this.sesso= "";
    this.luogoNascita= "";
    this.dataNascita= undefined;
    this.indirizzoResidenza= "";
    this.comuneResidenza= "";
    this.provinciaResidenza= "";
    this.statoCivile= "";
    this.figli= 0;
    this.scolarita= "";
    this.situazioneLavorativa= "";
    this.personeRiferimento= "";
    this.telefono= "";
    this.dataIngresso= new Date();
    this.indirizzoNascita= "";
    this.comuneNascita= "";
    this.provinciaNascita= "";
  }

}
