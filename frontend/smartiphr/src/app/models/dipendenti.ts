
export class Dipendenti {
  static clone(obj: Dipendenti) {
    return JSON.parse(JSON.stringify(obj));
  }

  _id?: string;
  cognome: string;
  nome: string;
  cf: string;
  indirizzoNascita?: string;
  comuneNascita?: string;
  provinciaNascita?: string;
  dataNascita?: Date;
  sesso?: string;
  indirizzoResidenza?: string;
  //luogoResidenza?: string;
  comuneResidenza?:string;
  provinciaResidenza?: string;
  titoloStudio?: string;
  mansione?: string;
  contratto?: string;
  telefono?: string;
  email?: string;
  accettatoRegolamento : boolean;

  group: string;
  user?: string;
  idUser?:string;

}
