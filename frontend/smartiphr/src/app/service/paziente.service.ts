import { HttpClient } from "@angular/common/http";
import { parseTemplate } from '@angular/compiler';
import { Injectable } from "@angular/core";
import { Moment } from 'moment';
import { Observable } from "rxjs";
import { flatMap, map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { CartellaClinica } from "../models/cartellaClinica";
import { Diario } from "../models/diario";
import { DocumentoAutorizzazioneUscita } from "../models/documentoAutorizzazioneUscita";
import { DocumentoEsitoStrumentale } from "../models/documentoEsitoStrumentale";
import { ParametriVitali } from "../models/parametriVitali";
import { Paziente } from "../models/paziente";

@Injectable({
  providedIn: "root",
})
export class PazienteService {
  api: string = environment.api;

  constructor(private http: HttpClient) {}

  async getPazienti(): Promise<Paziente[]> {
    return this.http.get<Paziente[]>(`${this.api}/api/pazienti`).toPromise();
    //return this.http.get<Paziente[]>(`${this.api}/api/pazienti?pageSize=${pageSize}&pageNumber=${pageNumber}`)
  }

  async getPaziente(id: string): Promise<Paziente[]> {
    return this.http
      .get<Paziente[]>(`${this.api}/api/pazienti/${id}`)
      .toPromise();
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

  insertAutorizzazioneUscita(
    id: string,
    doc: DocumentoAutorizzazioneUscita
  ): Observable<DocumentoAutorizzazioneUscita> {
    var body = doc;
    return this.http.post<DocumentoAutorizzazioneUscita>(
      `${this.api}/api/pazienti/autorizzazioneUscita/${id}`,
      body
    );
  }

  deleteAutorizzazioneUscita(idDoc: string) {
    return this.http.delete(
      `${this.api}/api/pazienti/autorizzazioneUscita/${idDoc}`
    );
  }

  getAutorizzazioneUscita(
    id: string
  ): Observable<DocumentoAutorizzazioneUscita[]> {
    return this.http.get<DocumentoAutorizzazioneUscita[]>(
      `${this.api}/api/pazienti/autorizzazioneUscita/${id}`
    );
  }

  delete(paziente: Paziente): Observable<Paziente> {
    return this.http.delete<Paziente>(
      this.api + "/api/pazienti/" + paziente._id
    );
  }

  // ESITO STRUMENTALE

  insertEsitoStrumentale(
    id: string,
    doc: DocumentoEsitoStrumentale
  ): Observable<DocumentoEsitoStrumentale> {
    var body = doc;
    return this.http.post<DocumentoEsitoStrumentale>(
      `${this.api}/api/pazienti/esitoStrumentale/${id}`,
      body
    );
  }

  getEsitoStrumentale(id: string): Observable<DocumentoEsitoStrumentale[]> {
    return this.http.get<DocumentoEsitoStrumentale[]>(
      `${this.api}/api/pazienti/esitoStrumentale/${id}`
    );
  }

  deleteEsitoStrumentale(idDoc: string) {
    return this.http.delete(
      `${this.api}/api/pazienti/esitoStrumentale/${idDoc}`
    );
  }

  // PARAMETRI VITALI

  getParametriVitali(id: string, dateRif: Moment): Observable<ParametriVitali[]> {
    return this.http
      .get<ParametriVitali[]>(`${this.api}/api/pazienti/parametriVitali/${id}/${dateRif.format('YYYYMM')}`)
      .pipe(
        flatMap((x) => x),
        map((x) => x["data"]),
        map((v) => {
          return v.map((param) => {
            const pa = param.pa.map((item) => {
              return { x: new Date(item.x), y: item.y, modify: item.modify };
            });
            const tc = param.tc.map((item) => {
              return { x: new Date(item.x), y: item.y, modify: item.modify };
            });
            const spo2 = param.spo2.map((item) => {
              return { x: new Date(item.x), y: item.y, modify: item.modify };
            });
            const diurisi = param.diurisi.map((item) => {
              return { x: new Date(item.x), y: item.y, modify: item.modify };
            });
            const glic = param.glic.map((item) => {
              return { x: new Date(item.x), y: item.y, modify: item.modify };
            });
            const annotazioni = param.annotazioni;

            return {
              gg: param.gg,
              pa: pa,
              tc: tc,
              spo2: spo2,
              diurisi: diurisi,
              glic: glic,
              annotazioni: annotazioni,
            };
          });
        })
      );
  }

  updateParametriVitali(id: string, data: ParametriVitali[], dateRif: Moment): Observable<any> {
    return this.http.put<any>(
      `${this.api}/api/pazienti/parametriVitali/${id}/${dateRif.format('YYYYMM')}`,
      data
    );
  }
}
