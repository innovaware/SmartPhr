import { Injectable } from "@angular/core";
import { Utenti } from "../models/utenti";

@Injectable({
  providedIn: "root",
})
export class UtentiService {
  constructor() {}

  getUtenti(): Promise<Utenti[]> {
    return new Promise<Utenti[]>((resolve, reject) => {
      var result: Utenti[] = [
        {
          cognome: "Test",
          nome: "Test",
          email: "email",
          user: "dan",
        },
      ];

      resolve(result);
    });
  }
}
