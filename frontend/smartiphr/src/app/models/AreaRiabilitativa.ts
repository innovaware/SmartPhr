import { AreaRiabilitativaLesioni } from './AreaRiabilitativaLesioni';
import { AreaRiabilitativaTest } from './AreaRiabilitativaTest';

export class AreaRiabilitativa {
  static clone(obj: AreaRiabilitativa) {
    return JSON.parse(JSON.stringify(obj));
  }
  constructor() {
    this.anamnesiRiabilitativa = "";
    this.test = new AreaRiabilitativaTest();
    this.lesioni = [];
    this.diagnosiFunzionamento = "";
  }

  anamnesiRiabilitativa: String;
  test: AreaRiabilitativaTest;
  lesioni: AreaRiabilitativaLesioni[];
  diagnosiFunzionamento: String;
}
