import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { environment } from "src/environments/environment";
import { CartellaClinica } from "../models/cartellaClinica";
import { Diario } from "../models/diario";
import { DocumentoAutorizzazioneUscita } from '../models/documentoAutorizzazioneUscita';
import { Paziente } from "../models/paziente";

@Injectable({
  providedIn: "root",
})
export class PazienteService {
  api: string = environment.api;

  constructor(private http: HttpClient) {}

  async getPazienti(): Promise<Paziente[]> {
    return this.http.get<Paziente[]>(`${this.api}/api/pazienti`)
      .toPromise();
    //return this.http.get<Paziente[]>(`${this.api}/api/pazienti?pageSize=${pageSize}&pageNumber=${pageNumber}`)
  }

  async getPaziente(id: string): Promise<Paziente[]> {
    return this.http.get<Paziente[]>(`${this.api}/api/pazienti/${id}`).toPromise();
  }

  save(data: Paziente): Promise<Paziente> {
    var body = data;
    console.log("body: ", body);
    return this.http
      .put<Paziente>(this.api + "/api/pazienti/" + data._id, body)
      .toPromise();
  }

  insert(data: Paziente): Promise<Paziente> {
    var body = data;
    return this.http
      .post<Paziente>(this.api + "/api/pazienti", body)
      .toPromise();
  }

  insertAutorizzazioneUscita(id: string, doc: DocumentoAutorizzazioneUscita): Observable<DocumentoAutorizzazioneUscita> {
    var body = doc;
    return this.http.post<DocumentoAutorizzazioneUscita>(`${this.api}/api/pazienti/autorizzazioneUscita/${id}`, body);
  }

  deleteAutorizzazioneUscita(idDoc: string) {
    return this.http.delete(`${this.api}/api/pazienti/autorizzazioneUscita/${idDoc}`);
  }

  getAutorizzazioneUscita(id: string): Observable<DocumentoAutorizzazioneUscita[]> {
    return this.http.get<DocumentoAutorizzazioneUscita[]>(`${this.api}/api/pazienti/autorizzazioneUscita/${id}`);
  }

/*   delete(paziente: Paziente): Observable<any> {
    return this.http.delete(this.api + "/api/pazienti/" + data._id);
  } */

  delete(paziente: Paziente): Observable<Paziente> {
    return this.http.delete<Paziente>(this.api + "/api/pazienti/" + paziente._id);
  }
}
