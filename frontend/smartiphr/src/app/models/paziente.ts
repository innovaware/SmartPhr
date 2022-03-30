import { CartellaClinica } from './cartellaClinica';
import { cartellaAssSociale } from './cartellaAssSociale';
import { SchedaInfermeristica } from './SchedaInfermeristica';
import { CartellaEducativa } from './cartellaEducativa';
import { schedaPisico } from './schedaPisico';
import { ValutazioneMotoria } from './ValutazioneMotoria';
import { AreaRiabilitativa } from './AreaRiabilitativa';
import { AreaRiabilitativaProgramma } from './AreaRiabilitativaProgramma';
import { AreaRiabilitativaDiario } from './AreaRiabilitativaDiario';

export class Paziente {
  static clone(obj: Paziente) {
    return JSON.parse(JSON.stringify(obj));
  }

  static refresh(src: Paziente, dst: Paziente) {
    dst.cognome = src.cognome;
    dst.nome = src.nome;
    dst.sesso = src.sesso;
    dst.luogoNascita = src.luogoNascita;
    dst.dataNascita = src.dataNascita;
    dst.indirizzoResidenza = src.indirizzoResidenza;
    dst.comuneResidenza = src.comuneResidenza;
    dst.provinciaResidenza = src.provinciaResidenza;
    dst.statoCivile = src.statoCivile;
    dst.figli = src.figli;
    dst.scolarita = src.scolarita;
    dst.situazioneLavorativa = src.situazioneLavorativa;
    dst.personeRiferimento = src.personeRiferimento;
    dst.telefono = src.telefono;
    dst.dataIngresso = src.dataIngresso;
    dst.provinciaNascita = src.provinciaNascita;
    dst.indirizzoNascita = src.indirizzoNascita;
    dst.provenienza = src.provenienza;
    dst.comuneNascita = src.comuneNascita;
    dst.codiceFiscale= src.codiceFiscale;
    dst.schedaInfermeristica = src.schedaInfermeristica;
    dst.schedaClinica = src.schedaClinica;
    dst.schedaPisico = src.schedaPisico;
    dst.dimissione = src.dimissione;

    dst.ricovero = src.ricovero;
    dst.numstanza = src.numstanza;
    dst.numletto = src.numletto;
    dst.diagnosiingresso = src.diagnosiingresso;
    dst.allergie = src.allergie;


    dst.schedaAssSociale = src.schedaAssSociale;
    dst.schedaEducativa = src.schedaEducativa;


  }

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
  codiceFiscale: string;


  ricovero?: string;
  numstanza?: string;
  numletto?: string;
  diagnosiingresso?: string;
  allergie?: string;

  schedaInfermeristica: SchedaInfermeristica;
  schedaClinica: CartellaClinica;
  schedaPisico?: schedaPisico;

  schedaAssSociale: cartellaAssSociale;
  schedaEducativa: CartellaEducativa;

  valutazioneMotoria: ValutazioneMotoria;
  areaRiabilitativa: AreaRiabilitativa;
  areaRiabilitativaProgramma: AreaRiabilitativaProgramma;
  areaRiabilitativaDiario: AreaRiabilitativaDiario[];

  dimissione?: {
    typeDimissione: string,
    data: Date,
  }

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
