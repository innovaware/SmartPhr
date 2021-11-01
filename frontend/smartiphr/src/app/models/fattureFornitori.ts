export class FattureFornitori {
  static clone(obj: FattureFornitori) {
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
