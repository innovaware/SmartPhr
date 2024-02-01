import { Diario } from "./diario";
import { EsamePisico } from './EsamePisico';

export class schedaPsico {
  static clone(obj: schedaPsico) {
    return JSON.parse(JSON.stringify(obj));
  }

  public update(scheda: schedaPsico): void {
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
