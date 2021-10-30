
export class SchedaInterventi {
  static clone(obj: SchedaInterventi) {
    return JSON.parse(JSON.stringify(obj));
  }
  constructor() {
    this.data = new Date();
    this.diagnosi = "";
    this.obiettivi = "";
    this.intervento = "";
    this.firma = "";

  }

  data: Date;
  diagnosi: string;
  obiettivi: string;
  intervento: string;
  firma: string
}


