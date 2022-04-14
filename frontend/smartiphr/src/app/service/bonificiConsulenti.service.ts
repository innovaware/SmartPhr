import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { BonificiConsulenti } from "../models/bonificiConsulenti";

@Injectable({
  providedIn: "root",
})
export class BonificiConsulentiService {
  api: string = environment.api;

  constructor(private http: HttpClient) {}

  get(): Observable<BonificiConsulenti[]> {
    var bonifici = this.http.get<BonificiConsulenti[]>(`${this.api}/api/bonificiconsulenti`);
    console.log("get all bonifici consulenti: " + JSON.stringify(bonifici));
    return bonifici;

  }

/*   getById(id: string): Observable<BonificiConsulenti[]> {
    return this.http.get<BonificiConsulenti[]>(`${this.api}/api/bonificiconsulenti/${id}`);
  }

  insert(bonifico: BonificiConsulenti) {
    var body = bonifico;
    return this.http.post(`${this.api}/api/bonificiconsulenti`, body);
  }

  update(bonifico: BonificiConsulenti) {
    var body = bonifico;
    console.log("body: ", body);
    return this.http.put(this.api + "/api/bonificiconsulenti/" + bonifico._id, body);
  }

  delete(bonifico: BonificiConsulenti): Observable<BonificiConsulenti> {
    return this.http.delete<BonificiConsulenti>(this.api + "/api/bonificiconsulenti/" + bonifico._id);
  } */
}
