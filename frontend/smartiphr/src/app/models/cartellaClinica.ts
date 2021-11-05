import { Diario } from './diario';
import { schedaAnamnesiFamigliare } from './schedaAnamnesiFamigliare';
import { schedaAnamnesiPatologica } from './schedaAnamnesiPatologica';
import { schedaEsameGenerale } from './schedaEsameGenerale';
import { schedaEsameNeurologia } from './schedaEsameNeurologia';
import { schedaMezziContenzione } from './schedaMezziContenzione';
import { schedaPisico } from './schedaPisico';
import { schedaValutazioneTecniche } from './schedaValutazioneTecniche';

export class CartellaClinica {

  static clone(obj: CartellaClinica) {
    return JSON.parse(JSON.stringify(obj));
  }

  constructor() {
    this.schedaAnamnesiPatologica = new schedaAnamnesiPatologica();
    this.schedaAnamnesiFamigliare = new schedaAnamnesiFamigliare();
    this.schedaEsameGenerale = new schedaEsameGenerale();
    this.schedaEsameNeurologia = new schedaEsameNeurologia();
    this.schedaMezziContenzione = new schedaMezziContenzione();
    this.schedaValutazioneTecniche = new schedaValutazioneTecniche();

  }




  schedaAnamnesiPatologica?: schedaAnamnesiPatologica;
  schedaAnamnesiFamigliare?: schedaAnamnesiFamigliare;
  schedaEsameGenerale?: schedaEsameGenerale;
  schedaEsameNeurologia?: schedaEsameNeurologia;
  schedaMezziContenzione?: schedaMezziContenzione;
  schedaValutazioneTecniche?: schedaValutazioneTecniche;

}
