import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { ProspettoCM } from '../models/prospettoCM';

@Injectable({
  providedIn: "root",
})
export class ProspettoCMService {
  api: string = environment.api;

  constructor(private http: HttpClient) {}

  getProspettoCMAll(): Observable<ProspettoCM[]> {
    return this.http.get<ProspettoCM[]>(`${this.api}/api/prospettocm`);
  }

  async getProspettoCM(id: string): Promise<ProspettoCM[]> {
    return this.http
      .get<ProspettoCM[]>(`${this.api}/api/prospettocm/${id}`)
      .toPromise();
  }

  async insertProspettoCM(prospetto: ProspettoCM, id: string) {
    console.log("Insert prospetto: ", prospetto);
    var body = prospetto;
    return this.http.post(`${this.api}/api/prospettocm/${id}`, body).toPromise();
  }

  async updateProspettoCM(prospetto: ProspettoCM) {
    var body = prospetto;
    console.log("body: ", body);
    return this.http.put(this.api + "/api/prospettocm/" + prospetto._id, body).toPromise();
  }

  async remove(prospetto: ProspettoCM) {
    return this.http.delete(`${this.api}/api/prospettocm/${prospetto._id}`).toPromise();
  }

/*   delete(prospetto: ProspettoCM): Observable<ProspettoCM> {
    return this.http.delete<ProspettoCM>(this.api + "/api/curriculum/" + prospetto._id);
  } */

}
