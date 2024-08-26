import { Dipendenti } from "./dipendenti";
import { DocumentoDipendente } from "./documentoDipendente";
import { FormazioneDipendente } from "./formazioneDipendente";
import { NominaDipendente } from "./nominaDipendente";

export class ItemDataSourceNomina {
  dipendente: Dipendenti;
  nomina?: NominaDipendente;
  formazione?: FormazioneDipendente;
  documento?: DocumentoDipendente;
  documentoAttestato?: DocumentoDipendente;
  caricato?: Boolean;
}
