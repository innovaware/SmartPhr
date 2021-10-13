import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { DocumentoFornitore } from '../models/documentoFornitore';
import { Fornitore } from '../models/fornitore';

@Injectable({
  providedIn: "root",
})
export class DocumentoFornitoreService {
  api: string = environment.api;

  constructor(private http: HttpClient) {}

  async getDocumentoFornitore(id: string): Promise<DocumentoFornitore[]> {
    const headers = {
      // 'Authorization': 'Bearer ' + this.token,
      // 'x-refresh': this.refreshToken
    }

    return this.http
      .get<DocumentoFornitore[]>(`${this.api}/api/documentifornitore/${id}`, { headers })
      .toPromise();
  }

  async insertDocumentoFornitore(documentoFornitore: DocumentoFornitore, id: string) {
    var body = documentoFornitore;
    return this.http.post(`${this.api}/api/documentifornitore/${id}`, body).toPromise();
  }

  async updateDocumentoFornitore(documentoFornitore: DocumentoFornitore) {
    var body = documentoFornitore;
    console.log("body: ", body);
    return this.http.put(this.api + "/api/documentifornitore/" + documentoFornitore._id, body).toPromise();
  }

  async remove(documentoFornitore: DocumentoFornitore) {
    return this.http.delete(`${this.api}/api/documentifornitore/${documentoFornitore._id}`).toPromise();
  }

}
