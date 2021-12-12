export class DocumentoPaziente {
    static clone(obj: DocumentoPaziente) {
      return JSON.parse(JSON.stringify(obj));
    }

    /**
     * Id Paziente
     */
    paziente: string;
    _id?: string;
    type: string;
    typeDocument?: string;
    filename: string;
    dateupload?: Date;
    note?: string;
    descrizione?: string;
    filenameesito?: string;
    file?: File;
  }
