import { CarrelloItem } from './carrelloItem'

export class Carrello {
  _id?: String;
  type?: String;
  contenuto?: CarrelloItem[];
  inUso?: Boolean;
  nomeCarrello?: String;
  operatoreID?: String;
  operatoreName?: String;
  dataUtilizzo?: Date;
}


