import { CucinaAmbienti } from "./CucinaAmbienti";

export class CucinaAmbientiArchivio extends CucinaAmbienti {
  static clone(obj: CucinaAmbientiArchivio) {
    return JSON.parse(JSON.stringify(obj));
  }
}
