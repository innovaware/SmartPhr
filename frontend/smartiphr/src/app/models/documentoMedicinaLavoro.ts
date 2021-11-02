export class DocumentoMedicinaLavoro {
  static clone(obj: DocumentoMedicinaLavoro) {
    return JSON.parse(JSON.stringify(obj));
  }

  _id?: string;
  filenameRichiesta: string;
  dateuploadRichiesta?: Date;
  noteRichiesta?: string;

  filenameCertificato: string;
  dateuploadCertificato?: Date;
  noteCertificato?: string;

  file?: File;
}
