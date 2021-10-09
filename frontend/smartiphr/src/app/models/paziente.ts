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
  comuneNascita: string;
  provinciaNascita: string;
  provenienza?: string;

  cartellaClinica: CartellaClinica[];
}
