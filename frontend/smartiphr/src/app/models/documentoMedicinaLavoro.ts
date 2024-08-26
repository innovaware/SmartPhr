export class DocumentoMedicinaLavoro {
  static clone(obj: DocumentoMedicinaLavoro) {
    return JSON.parse(JSON.stringify(obj));
  }
  dipendente?: String;
  _id?: string;
  filenameRichiesta?: string;
  dateuploadRichiesta?: Date;
  noteRichiesta?: string;

  filenameCertificato?: string;
  dateuploadCertificato?: Date;
  noteCertificato?: string;

  fileRichiesta?: File;
  fileCertificato?: File;
}
