import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { FattureFornitori } from "../models/fattureFornitori";

@Injectable({
  providedIn: "root",
})
export class FattureFornitoriService {
  api: string = environment.api;

  constructor(private http: HttpClient) {}

  get(): Observable<FattureFornitori[]> {
    var fatture = this.http.get<FattureFornitori[]>(`${this.api}/api/fatturefornitori`);
    console.log("get all fatture fornitori: " + JSON.stringify(fatture));
    return fatture;

  }

/*   getById(id: string): Observable<FattureFornitori[]> {
    return this.http.get<FattureFornitori[]>(`${this.api}/api/fatturefornitori/${id}`);
  }

  insert(fattura: FattureFornitori) {
    var body = fattura;
    return this.http.post(`${this.api}/api/fatturefornitori`, body);
  }

  update(fattura: FattureFornitori) {
    var body = fattura;
    return this.http.put(this.api + "/api/fatturefornitori/" + fattura._id, body);
  }

  delete(fattura: FattureFornitori): Observable<FattureFornitori> {
    return this.http.delete<FattureFornitori>(this.api + "/api/fatturefornitori/" + fattura._id);
  } */
}
