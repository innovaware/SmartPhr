import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { DocumentoPaziente } from '../models/documentoPaziente';
import { DocumentoMedicinaLavoro } from "../models/documentoMedicinaLavoro";
import { Paziente } from "../models/paziente";

@Injectable({
  providedIn: 'root'
})
export class DocumentipazientiService {

  api: string = environment.api;

  constructor(private http: HttpClient) {}

  async get(paziente: Paziente,type : string): Promise<DocumentoPaziente[]> {
    const headers = {
      // 'Authorization': 'Bearer ' + this.token,
      // 'x-refresh': this.refreshToken
    }

    return this.http
      .get<DocumentoPaziente[]>(`${this.api}/api/documentipazienti/paziente/${paziente._id}/${type}`, { headers })
      .toPromise();
  }


  async getByIngresso(paziente: Paziente,type : string): Promise<DocumentoPaziente[]> {
    const headers = {
      // 'Authorization': 'Bearer ' + this.token,
      // 'x-refresh': this.refreshToken
    }

    return this.http
      .get<DocumentoPaziente[]>(`${this.api}/api/documentipazienti/pazienteingresso/${paziente._id}`, { headers })
      .toPromise();
  }


  async insert(doc: DocumentoPaziente, paziente: Paziente) {
    var body = doc;
    return this.http.post(`${this.api}/api/documentipazienti/${paziente._id}`, body).toPromise();
  }

  async update(doc: DocumentoPaziente) {
    var body = doc;
    console.log("body: ", body);
    return this.http.put(this.api + "/api/documentipazienti/" + doc._id, body).toPromise();
  }

  async remove(doc: DocumentoPaziente) {
    return this.http.delete(`${this.api}/api/documentipazienti/documento/${doc._id}`).toPromise();
  }

}
