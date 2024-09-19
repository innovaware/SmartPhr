import { HttpClient } from "@angular/common/http";
import { parseTemplate } from "@angular/compiler";
import { Injectable } from "@angular/core";
import { Moment } from "moment";
import { Observable } from "rxjs";
import { flatMap, map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { CartellaClinica } from "../models/cartellaClinica";
import { Diario } from "../models/diario";
import { DocumentoAutorizzazioneUscita } from "../models/documentoAutorizzazioneUscita";
import { DocumentoEsitoStrumentale } from "../models/documentoEsitoStrumentale";
import { DocumentoPaziente } from "../models/documentoPaziente";
import { ParametriVitali } from "../models/parametriVitali";
import { Paziente } from "../models/paziente";
import { schedaPsico } from '../models/schedaPsico';

@Injectable({
  providedIn: "root",
})
export class PazienteService {
  api: string = environment.api;

  constructor(private http: HttpClient) {}


  getPazientiAsync(): Observable<Paziente[]> {
    return this.http.get<Paziente[]>(`${this.api}/api/pazienti`);
  }

  async getPazienti(): Promise<Paziente[]> {
    return this.http.get<Paziente[]>(`${this.api}/api/pazienti`).toPromise();
    //return this.http.get<Paziente[]>(`${this.api}/api/pazienti?pageSize=${pageSize}&pageNumber=${pageNumber}`)
  }

  getPazientiObservable(): Observable<Paziente[]> {
    return this.http.get<Paziente[]>(`${this.api}/api/pazienti`);
  }

  async getPaziente(id: string): Promise<Paziente> {
    return this.http
      .get<Paziente>(`${this.api}/api/pazienti/${id}`)
      .toPromise();
  }

  getPazientiByCamera(idCamera: string): Observable<Paziente[]> {
    return this.http.get<Paziente[]>(`${this.api}/api/pazienti/camera/${idCamera}`);
  }

  save(data: Paziente): Promise<Paziente> {
    var body = data;
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

  delete(paziente: Paziente): Observable<Paziente> {
    return this.http.delete<Paziente>(
      this.api + "/api/pazienti/" + paziente._id
    );
  }

  insertAutorizzazioneUscita(
    id: string,
    doc: DocumentoPaziente
  ): Observable<DocumentoPaziente> {
    var body = doc;
    return this.http.post<DocumentoPaziente>(
      `${this.api}/api/documentipazienti/autorizzazioneUscita/${id}`,
      body
    );
  }

  deleteAutorizzazioneUscita(idDoc: string) {
    return this.http.delete(
      `${this.api}/api/documentipazienti/autorizzazioneUscita/${idDoc}`
    );
  }

  getAutorizzazioneUscita(id: string): Observable<DocumentoPaziente[]> {
    return this.http.get<DocumentoPaziente[]>(
      `${this.api}/api/documentipazienti/autorizzazioneUscita/${id}`
    );
  }



  // ESITO STRUMENTALE

  insertEsitoStrumentale(
    id: string,
    doc: DocumentoPaziente
  ): Observable<DocumentoPaziente> {
    var body = doc;
    return this.http.post<DocumentoPaziente>(
      `${this.api}/api/documentipazienti/esitoStrumentale/${id}`,
      body
    );
  }

  getEsitoStrumentaleAll(): Observable<DocumentoPaziente[]> {
    return this.http.get<DocumentoPaziente[]>(
      `${this.api}/api/documentipazienti/esitoStrumentale/all`
    );
  }

  getEsitoStrumentale(id: string): Observable<DocumentoPaziente[]> {
    return this.http.get<DocumentoPaziente[]>(
      `${this.api}/api/documentipazienti/esitoStrumentale/${id}`
    );
  }

  deleteEsitoStrumentale(idDoc: string) {
    return this.http.delete(
      `${this.api}/api/documentipazienti/esitoStrumentale/${idDoc}`
    );
  }

  // PARAMETRI VITALI

  getParametriVitali(
    id: string,
    dateRif: Moment
  ): Observable<ParametriVitali[]> {
    return this.http
      .get<ParametriVitali[]>(
        `${this.api}/api/pazienti/parametriVitali/${id}/${dateRif.format(
          "YYYYMM"
        )}`
      )
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

  updateParametriVitali(
    id: string,
    data: ParametriVitali[],
    dateRif: Moment
  ): Observable<any> {
    return this.http.put<any>(
      `${this.api}/api/pazienti/parametriVitali/${id}/${dateRif.format(
        "YYYYMM"
      )}`,
      data
    );
  }

  getDocumentByType(typeDocument: string): Observable<DocumentoPaziente[]> {
    console.log("typedocument: ", typeDocument);
    switch (typeDocument) {
      case "EsitoStrumentale":
        return this.http.get<DocumentoPaziente[]>(
          `${this.api}/api/documentipazienti/esitoStrumentale/all`
        );
      case "AutorizzazioneUscita":
        return this.http.get<DocumentoPaziente[]>(
          `${this.api}/api/documentipazienti/autorizzazioneUscita/all`
        );

      case "RefertoEsameEmatochimico":
        return this.http.get<DocumentoPaziente[]>(
          `${this.api}/api/documentipazienti/refertoEmatochimico/all`
        );

      default:
        return this.http.get<DocumentoPaziente[]>(
          `${this.api}/api/documentipazienti/documentoType/${typeDocument}`
        );
    }
  }


  // SCHEDA PSICOLOGICA

  updateschedaPsicologica(
    id: string,
    data: schedaPsico,
  ): Observable<any> {
    return this.http.put<any>(
      `${this.api}/api/pazienti/schedaPsicologica/${id}`,
      data
    );
  }
}
