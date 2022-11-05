import { Injectable } from '@angular/core';

import { Observable } from "rxjs";
import { environment } from 'src/environments/environment';
import { HttpClient } from "@angular/common/http";
import { CucinaMenuPersonalizzato } from '../models/CucinaMenuPersonalizzato';
import { MenuGeneraleView } from '../models/MenuGeneraleView';
import { DocumentoControlloTamponi } from '../models/DocumentoControlloTamponi';
import { DocumentoAutoControllo } from '../models/DocumentoAutoControllo';

@Injectable({
  providedIn: 'root'
})
export class CucinaService {
  api: string = environment.api;

  constructor(private http: HttpClient) { }

  getByPaziente(idPaziente: string): Observable<CucinaMenuPersonalizzato[]> {
    return this.http.get<CucinaMenuPersonalizzato[]>(`${this.api}/api/cucina/paziente/${idPaziente}`);
  }

  getAll(): Observable<CucinaMenuPersonalizzato[]> {
    return this.http.get<CucinaMenuPersonalizzato[]>(`${this.api}/api/cucina`);
  }

  get(id: string): Observable<CucinaMenuPersonalizzato> {
    return this.http.get<CucinaMenuPersonalizzato>(`${this.api}/api/cucina/${id}`);
  }

  update(menuPersonalizzato: CucinaMenuPersonalizzato) {
    console.log("Update menu personalizzato:", menuPersonalizzato);
    return this.http.put<CucinaMenuPersonalizzato>(`${this.api}/api/cucina/${menuPersonalizzato._id}`, menuPersonalizzato);
  }

  add(menuPersonalizzato: CucinaMenuPersonalizzato) {
    console.log("Inserimento menu personalizzato:", menuPersonalizzato);
    return this.http.post<CucinaMenuPersonalizzato>(`${this.api}/api/cucina`, menuPersonalizzato);
  }

  remove(menuPersonalizzato: CucinaMenuPersonalizzato) {
    console.log("Eliminazione menu personalizzato:", menuPersonalizzato);
    return this.http.delete<CucinaMenuPersonalizzato>(`${this.api}/api/cucina/${menuPersonalizzato._id}`);
  }

  getMenuGenerale(type: number, week: number, year: number): Observable<MenuGeneraleView[]> {
    return this.http.get<MenuGeneraleView[]>(`${this.api}/api/cucina/generale?type=${type}&week=${week}&year=${year}`);
  }

  addMenuGenerale(menuGenerale: MenuGeneraleView) {
    menuGenerale.year = menuGenerale.dataStartRif.getFullYear();
    menuGenerale.dataInsert = new Date();
    console.log("Inserimento menu Generale:", menuGenerale);
    return this.http.post<MenuGeneraleView>(`${this.api}/api/cucina/generale`, menuGenerale);
  }

  updateMenuGenerale(menuGenerale: MenuGeneraleView) {
    menuGenerale.year = menuGenerale.dataStartRif.getFullYear();
    console.log("Update menu Generale:", menuGenerale);
    return this.http.put<MenuGeneraleView>(`${this.api}/api/cucina/generale/${menuGenerale._id}`, menuGenerale);
  }

  /// Documento controllo tamponi

  getDocumentiControlloTamponi(): Observable<DocumentoControlloTamponi[]> {
    return this.http.get<DocumentoControlloTamponi[]>(`${this.api}/api/cucina/documenti/getAll`);
  }

  addDocumentControlloTamponi(documentoControlloTamponi: DocumentoControlloTamponi):  Observable<DocumentoControlloTamponi> {
    console.log("Inserimento Documento Controllo Tamponi", documentoControlloTamponi);
    return this.http.post<DocumentoControlloTamponi>(`${this.api}/api/cucina/documenti/`, documentoControlloTamponi);
  }

  deleteDocumentoControlloTamponi(documentoControlloTamponi: DocumentoControlloTamponi) {
    console.log("Eliminazione documento controllo tamponi", documentoControlloTamponi);
    return this.http.delete<DocumentoControlloTamponi>(`${this.api}/api/cucina/documenti/${documentoControlloTamponi._id}`);
  }


  /// Documento auto controllo

  getDocumentoAutoControllo(): Observable<DocumentoAutoControllo[]> {
    return this.http.get<DocumentoControlloTamponi[]>(`${this.api}/api/cucina/autocontrollo/getAll`);
  }

  addDocumentoAutoControllo(documentoAutoControllo: DocumentoAutoControllo):  Observable<DocumentoControlloTamponi> {
    console.log("Inserimento Documento Auto controllo", documentoAutoControllo);
    return this.http.post<DocumentoAutoControllo>(`${this.api}/api/cucina/autocontrollo/`, documentoAutoControllo);
  }

  deleteDocumentoAutoControllo(documentoAutoControllo: DocumentoAutoControllo) {
    console.log("Eliminazione documento auto controllo", documentoAutoControllo);
    return this.http.delete<DocumentoAutoControllo>(`${this.api}/api/cucina/autocontrollo/${documentoAutoControllo._id}`);
  }

}
