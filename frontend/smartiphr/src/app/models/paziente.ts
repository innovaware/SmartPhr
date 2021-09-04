import { CartellaClinica } from './cartellaClinica';
import { Diario } from './diario';

export class Paziente {
  _id?: string;
  cognome: string;
  nome: string;
  sesso: string;
  luogoNascita: string;
  dataNascita: Date;
  residenza: string;
  statoCivile: string;
  figli: number;
  scolarita: string;
  situazioneLavorativa: string;
  personeRiferimento: string;
  telefono: string;
  dataIngresso: Date;
  provincia: string;
  localita: string;
  provenienza?: string;

  cartellaClinica: CartellaClinica[];
  // schedaPisico?: {
  //   esame?: {
  //     statoEmotivo: string[];
  //     personalita: string[];
  //     linguaggio: string[];
  //     memoria: string[];
  //     orientamento: string[];
  //     abilitaPercettivo: string[];
  //     abilitaEsecutive: string[];
  //     ideazione: string[];
  //     umore: string[];

  //     partecipazioni: string;
  //     ansia: string;
  //     testEsecutivi: string;
  //   },
  //   valutazione: string;
  //   diario: Diario[]
  // };
}
