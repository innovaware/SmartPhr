export class DocumentoFarmaci {
    static clone(obj: DocumentoFarmaci) {
      return JSON.parse(JSON.stringify(obj));
    }

    /**
     * Id Paziente
     */
    paziente_id?: string;
    paziente?: string;
    _id?: string;
    type: string;
    filename: string;
    dateupload?: Date;
    note?: string;
    descrizione?: string;
    file?: File;
    operator_id?: string;
    operator?: string;
  }
