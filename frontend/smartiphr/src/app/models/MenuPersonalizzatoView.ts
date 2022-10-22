import { CucinaMenuPersonalizzato } from "./CucinaMenuPersonalizzato";

export class MenuPersonalizzatiView {
  static clone(obj: MenuPersonalizzatiView) {
    return JSON.parse(JSON.stringify(obj));
  }

  idPaziente: string;
  cognome: string;
  nome: string;
  codiceFiscale: string;
  menuPersonalizzato: CucinaMenuPersonalizzato;

}
