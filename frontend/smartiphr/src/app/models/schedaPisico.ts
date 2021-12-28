import { Diario } from "./diario";
import { EsamePisico } from './EsamePisico';

export class schedaPisico {
  static clone(obj: schedaPisico) {
    return JSON.parse(JSON.stringify(obj));
  }

  public update(scheda: schedaPisico): void {
    this.valutazione = scheda.valutazione;
    this.diario = scheda.diario;
    this.esame = scheda.esame;
  }

  constructor() {
    this.valutazione = "";
    this.diario = [];
    this.esame = new EsamePisico();
  }

  esame?: EsamePisico;
  valutazione: string;
  diario: Diario[];
}
