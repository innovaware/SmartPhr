import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { FattureConsulenti } from "../models/fattureConsulenti";

@Injectable({
  providedIn: "root",
})
export class FattureConsulentiService {
  api: string = environment.api;

  constructor(private http: HttpClient) {}

  get(): Observable<FattureConsulenti[]> {
    var fatture = this.http.get<FattureConsulenti[]>(`${this.api}/api/fattureConsulenti`);
    console.log("get all fatture Consulenti: " + JSON.stringify(fatture));
    return fatture;

  }

/*   getById(id: string): Observable<FattureConsulenti[]> {
    return this.http.get<FattureConsulenti[]>(`${this.api}/api/fattureConsulenti/${id}`);
  }

  insert(fattura: FattureConsulenti) {
    var body = fattura;
    return this.http.post(`${this.api}/api/fattureConsulenti`, body);
  }

  update(fattura: FattureConsulenti) {
    var body = fattura;
    console.log("body: ", body);
    return this.http.put(this.api + "/api/fattureConsulenti/" + fattura._id, body);
  }

  delete(fattura: FattureConsulenti): Observable<FattureConsulenti> {
    return this.http.delete<FattureConsulenti>(this.api + "/api/fattureConsulenti/" + fattura._id);
  } */
}
