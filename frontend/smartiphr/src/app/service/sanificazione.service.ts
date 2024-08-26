import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RegistroSanificazione } from '../models/RegistroSanificazione';

@Injectable({
  providedIn: 'root'
})
export class SanificazioneService {
  api: string = environment.api;

  constructor(
    private http: HttpClient
  ) { }

  //TODO Inserire l'intervallo di ricerca
  getRegistro(): Observable<RegistroSanificazione[]> {
    return this.http.get<RegistroSanificazione[]>(this.api + "/api/sanificazione/registro");
  }
}
