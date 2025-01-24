import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Bonifico } from '../models/bonifico';
import { Paziente } from '../models/paziente';

@Injectable({
  providedIn: "root",
})
export class BonificoService {
  api: string = environment.api;

  constructor(private http: HttpClient) {}

/*   getBonificiAll(): Observable<Bonifico[]> {
    return this.http.get<Bonifico[]>(`${this.api}/api/bonifici`);
  } */

  async getByUserId(id: string): Promise<Bonifico[]> {
    return this.http
      .get<Bonifico[]>(`${this.api}/api/bonifici/${id}`)
      .toPromise();
  }

  async insert(bonifico: Bonifico, id: string): Promise<Bonifico> {
    console.log("Insert bonifico: ", bonifico);
    var body = bonifico;
    return this.http.post<Bonifico>(`${this.api}/api/bonifici/${id}`, body).toPromise();
  }

/*   async updateBonifico(bonifico: Bonifico) {
    var body = bonifico;
    return this.http.put(this.api + "/api/bonifici/" + bonifico._id, body).toPromise();
  } */

  async remove(bonifico: Bonifico) {
    return this.http.delete(`${this.api}/api/bonifici/${bonifico._id}`).toPromise();
  }

}
