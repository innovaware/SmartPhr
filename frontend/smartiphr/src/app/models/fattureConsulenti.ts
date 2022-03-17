export class FattureConsulenti {
    static clone(obj: FattureConsulenti) {
      return JSON.parse(JSON.stringify(obj));
    }
    _id: string;
    filename: string;
    dataupload: Date;
    note: string;
    file: File;
    cognome: string;
    nome: string;
    codiceFiscale: string;
    identifyUserObj: string;
  }
  