import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { DocumentoFarmaci } from '../models/documentoFarmaci';
import { Paziente } from "../models/paziente";

@Injectable({
  providedIn: 'root'
})
export class DocumentifarmaciService {

  api: string = environment.api;

  constructor(private http: HttpClient) {}

  async get(): Promise<DocumentoFarmaci[]> {
    const headers = {
      // 'Authorization': 'Bearer ' + this.token,
      // 'x-refresh': this.refreshToken
    }

    return this.http
      .get<DocumentoFarmaci[]>(`${this.api}/api/documentifarmaci`, { headers })
      .toPromise();
  }


  async getByPaziente(paziente: Paziente): Promise<DocumentoFarmaci[]> {
    const headers = {
      // 'Authorization': 'Bearer ' + this.token,
      // 'x-refresh': this.refreshToken
    }

    return this.http
      .get<DocumentoFarmaci[]>(`${this.api}/api/documentifarmaci/paziente/${paziente._id}`, { headers })
      .toPromise();
  }


  async insert(doc: DocumentoFarmaci, paziente?: Paziente) {
    var body = doc;
    if(paziente != null)
      return this.http.post(`${this.api}/api/documentifarmaci/${paziente._id}`, body).toPromise();
    else
      return this.http.post(`${this.api}/api/documentifarmaci`, body).toPromise();
  }

  async update(doc: DocumentoFarmaci) {
    var body = doc;
    return this.http.put(this.api + "/api/documentifarmaci/" + doc._id, body).toPromise();
  }

  async remove(doc: DocumentoFarmaci) {
    return this.http.delete(`${this.api}/api/documentifarmaci/${doc._id}`).toPromise();
  }
}
