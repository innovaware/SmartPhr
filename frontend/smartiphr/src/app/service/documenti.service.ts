import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { DocumentoDipendente } from '../models/documentoDipendente';
import { Dipendenti } from '../models/dipendenti';


@Injectable({
  providedIn: 'root'
})
export class DocumentiService {

  api: string = environment.api;

  constructor(private http: HttpClient) {}

  async get(dipendente: Dipendenti,type : string): Promise<DocumentoDipendente[]> {
    const headers = {
      // 'Authorization': 'Bearer ' + this.token,
      // 'x-refresh': this.refreshToken
    }

    return this.http
      .get<DocumentoDipendente[]>(`${this.api}/api/documentidipendenti/dipendente/${dipendente._id}/${type}`, { headers })
      .toPromise();
  }



  async insert(doc: DocumentoDipendente, dipendente: Dipendenti) {
    var body = doc;
    return this.http.post(`${this.api}/api/documentidipendenti/${dipendente._id}`, body).toPromise();
  }

  async update(doc: DocumentoDipendente) {
    var body = doc;
    console.log("body: ", body);
    return this.http.put(this.api + "/api/documentidipendenti/" + doc._id, body).toPromise();
  }

  async remove(doc: DocumentoDipendente) {
    return this.http.delete(`${this.api}/api/documentidipendenti/documento/${doc._id}`).toPromise();
  }

}
