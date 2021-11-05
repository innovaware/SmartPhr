
export class schedaAnamnesiPatologica {
    static clone(obj: schedaAnamnesiPatologica) {
      return JSON.parse(JSON.stringify(obj));
    }
    constructor() {
      this.anamnesiRemota = "";
      this.anamnesiProssima = "";
      this.terapiaDomicilio = "";
      this.reazioneAFarmaci = "";     
    }
  
  
    anamnesiRemota: String;
    anamnesiProssima: String;
    terapiaDomicilio: String;
    reazioneAFarmaci: String;
  }
  
  
  