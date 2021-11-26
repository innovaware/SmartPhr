import { Diario } from './diario';
import { schedaAnamnesiFamigliare } from './schedaAnamnesiFamigliare';
import { schedaAnamnesiPatologica } from './schedaAnamnesiPatologica';
import { schedaEsameGenerale } from './schedaEsameGenerale';
import { schedaEsameNeurologia } from './schedaEsameNeurologia';
import { schedaMezziContenzione } from './schedaMezziContenzione';
import { schedaPisico } from './schedaPisico';
import { schedaValutazioneTecniche } from './schedaValutazioneTecniche';
import { schedaDecessoOspite } from './schedaDecessoOspite';
import { schedaDimissioneOspite } from './schedaDimissioneOspite';

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

    this.schedaDecessoOspite = new schedaDecessoOspite();
    this.schedaDimissioneOspite = new schedaDimissioneOspite();

  }




  schedaAnamnesiPatologica?: schedaAnamnesiPatologica;
  schedaAnamnesiFamigliare?: schedaAnamnesiFamigliare;
  schedaEsameGenerale?: schedaEsameGenerale;
  schedaEsameNeurologia?: schedaEsameNeurologia;
  schedaMezziContenzione?: schedaMezziContenzione;
  schedaValutazioneTecniche?: schedaValutazioneTecniche;

  schedaDecessoOspite?: schedaDecessoOspite;
  schedaDimissioneOspite?: schedaDimissioneOspite;

}
