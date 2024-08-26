import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { DocumentoDipendente } from '../models/documentoDipendente';
import { Dipendenti } from '../models/dipendenti';
import { DocumentoMedicinaLavoro } from "../models/documentoMedicinaLavoro";


@Injectable({
  providedIn: 'root'
})
export class DocumentiService {

  api: string = environment.api;

  constructor(private http: HttpClient) {}

  async get(dipendente: Dipendenti, type: string): Promise<DocumentoDipendente[]> {
    const headers = {
      // 'Authorization': 'Bearer ' + this.token,
      // 'x-refresh': this.refreshToken
    }

    try {
      const response = await this.http
        .get<DocumentoDipendente[]>(`${this.api}/api/documentidipendenti/dipendente/${dipendente._id}/${type}`, { headers })
        .toPromise();

      return response;
    } catch (error) {
      throw error; // Rilancia l'errore per essere gestito nel metodo chiamante
    }
  }


  async getByType(type: string): Promise<DocumentoDipendente[]> {
    const headers = {
      // 'Authorization': 'Bearer ' + this.token,
      // 'x-refresh': this.refreshToken
    }

    return this.http
      .get<DocumentoDipendente[]>(`${this.api}/api/documentidipendenti/type/${type}`, { headers })
      .toPromise();
  }



  async getDocMedicinaLavoro(dipendente: Dipendenti,): Promise<DocumentoMedicinaLavoro[]> {
    const headers = {
      // 'Authorization': 'Bearer ' + this.token,
      // 'x-refresh': this.refreshToken
    }

    return this.http
      .get<DocumentoMedicinaLavoro[]>(`${this.api}/api/documentimedicinalavoro/dipendente/${dipendente._id}`, { headers })
      .toPromise();
  }



  async insert(doc: DocumentoDipendente, dipendente: Dipendenti) {
    var body = doc;
    return this.http.post(`${this.api}/api/documentidipendenti/${dipendente._id}`, body).toPromise();
  }

  async insertDocMed(doc: DocumentoMedicinaLavoro, dipendente: Dipendenti) {
    var body = doc;
    return this.http.post(`${this.api}/api/documentimedicinalavoro/${dipendente._id}`, body).toPromise();
  }

  async update(doc: DocumentoDipendente) {
    var body = doc;
    return this.http.put(this.api + "/api/documentidipendenti/" + doc._id, body).toPromise();
  }

  async updateMed(doc: DocumentoMedicinaLavoro) {
    var body = doc;
    console.log("DOC: ",doc);
    return this.http.put(this.api + "/api/documentimedicinalavoro/documento/" + doc._id, body).toPromise();
  }

  async remove(doc: DocumentoDipendente) {
    return this.http.delete(`${this.api}/api/documentidipendenti/documento/${doc._id}`).toPromise();
  }

}
