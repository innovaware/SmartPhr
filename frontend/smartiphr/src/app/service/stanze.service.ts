import { Injectable } from "@angular/core";
import { Stanza } from "../models/stanza";

@Injectable({
  providedIn: "root",
})
export class StanzeService {
  constructor() {}

  getStanze(): Promise<Stanza[]> {
    return new Promise<Stanza[]>((resolve, reject) => {
      var result: Stanza[] = [
        {
          numero: 1,
          descrizione: "Stanza Rossa",
          piano: 1,
          statusSanif: 20,
          statusLetti: 20,
          statusArmadio: 20,
          statusIgiene: 20,
        },
      ];

      resolve(result);
    });
  }
}
