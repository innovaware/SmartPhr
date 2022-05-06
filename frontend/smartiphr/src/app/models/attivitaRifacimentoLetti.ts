export class AttivitaRifacimentoLetti {
    static clone(obj: AttivitaRifacimentoLetti) {
      return JSON.parse(JSON.stringify(obj));
    }


    _id?: string;
    camera: string;
    carico_lenzuola: number;
    carico_lenzuola_lacerati: number;
    carico_traverse: number;
    carico_traverse_lacerati: number;
    carico_cuscini: number;
    carico_cuscini_lacerati: number;
    carico_coprimaterassi: number;
    carico_coprimaterassi_lacerati: number;
    carico_copriletti: number;
    carico_copriletti_lacerati: number;
    carico_coperte: number;
    carico_coperte_lacerati: number;
    carico_federe: number;
    carico_federe_lacerati: number;
    isInternal:boolean;
    operator?: string;
    operatorName?: string;
    data?: Date;

  }
  