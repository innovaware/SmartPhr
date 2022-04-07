import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { BonificiFornitori } from "../models/bonificiFornitori";

@Injectable({
  providedIn: "root",
})
export class BonificiFornitoriService {
  api: string = environment.api;

  constructor(private http: HttpClient) {}

  get(): Observable<BonificiFornitori[]> {
    var bonifici = this.http.get<BonificiFornitori[]>(`${this.api}/api/bonificifornitori`);
    console.log("get all bonifici fornitori: " + JSON.stringify(bonifici));
    return bonifici;

  }

/*   getById(id: string): Observable<BonificiFornitori[]> {
    return this.http.get<BonificiFornitori[]>(`${this.api}/api/bonificifornitori/${id}`);
  }

  insert(bonifico: BonificiFornitori) {
    var body = bonifico;
    return this.http.post(`${this.api}/api/bonificifornitori`, body);
  }

  update(bonifico: BonificiFornitori) {
    var body = bonifico;
    return this.http.put(this.api + "/api/bonificifornitori/" + bonifico._id, body);
  }

  delete(bonifico: BonificiFornitori): Observable<BonificiFornitori> {
    return this.http.delete<BonificiFornitori>(this.api + "/api/bonificifornitori/" + bonifico._id);
  } */
}
