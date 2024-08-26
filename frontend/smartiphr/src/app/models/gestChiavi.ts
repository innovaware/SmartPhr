export class gestChiavi {
    static clone(obj: gestChiavi) {
      return JSON.parse(JSON.stringify(obj));
    }
    _id?: string;
    dataPrelievo?: Date;
    dataRiconsegna?: Date;
    chiave:number;
    operatorPrelievo?:string;
    operatorPrelievoName?:string;
    operatorRiconsegna?:string;
    operatorRiconsegnaName?:string;
  }
  