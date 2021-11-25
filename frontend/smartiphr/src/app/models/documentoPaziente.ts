export class DocumentoPaziente {
    static clone(obj: DocumentoPaziente) {
      return JSON.parse(JSON.stringify(obj));
    }
  
    _id?: string;
    type: string;
    filename: string;
    dateupload?: Date;
    note?: string;
    descrizione?: string;
    filenameesito?: string;
    file?: File;
  }
  