import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Farmaci } from "../models/farmaci";

@Injectable({
  providedIn: "root",
})
export class FarmaciService {
  api: string = environment.api;

  constructor(private http: HttpClient) {}

  async getFarmaci(): Promise<Farmaci[]> {
    return this.http.get<Farmaci[]>(this.api + "/api/farmaci").toPromise();
  }
}
