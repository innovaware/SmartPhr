export class DocumentoAutorizzazioneUscita {
  static clone(obj: DocumentoAutorizzazioneUscita) {
    return JSON.parse(JSON.stringify(obj));
  }

  _id?: string;
  type: string;
  filename: string;
  dateupload?: Date;
  file?: File;
}
