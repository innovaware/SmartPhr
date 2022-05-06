export class LettoCamera {
    static clone(obj: LettoCamera) {
      return JSON.parse(JSON.stringify(obj));
    }


    _id?: string;
    camera: string;
    lenzuola: number;
    lenzuola_lacerati: number;
    traverse: number;
    traverse_lacerati: number;
    cuscini: number;
    cuscini_lacerati: number;
    coprimaterassi: number;
    coprimaterassi_lacerati: number;
    copriletti: number;
    copriletti_lacerati: number;
    coperte: number;
    coperte_lacerati: number;
    federe: number;
    federe_lacerati: number;
    isInternal:boolean;
    operator?: string;
    operatorName?: string;
    data?: Date;


  }
  