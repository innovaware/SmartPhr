import { Diario } from './diario';

export class SchedaDiario {
  static clone(obj: SchedaDiario) {
    return JSON.parse(JSON.stringify(obj));
  }
  constructor() {
    this.diario = [];
  }

  diario: Diario[];
}
