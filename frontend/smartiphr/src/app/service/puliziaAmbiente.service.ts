import { Injectable } from '@angular/core';

import { Observable } from "rxjs";
import { environment } from 'src/environments/environment';
import { HttpClient } from "@angular/common/http";
import { PuliziaAmbiente } from '../models/puliziaAmbienti';

@Injectable({
  providedIn: 'root'
})
export class PuliziaAmbienteService {
  api: string = environment.api;

  constructor(private http: HttpClient) { }

  get(id: string): Observable<PuliziaAmbiente> {
    return this.http.get<PuliziaAmbiente>(`${this.api}/api/puliziaAmbiente/${id}`);
  }

  update(puliziaAmbiente: PuliziaAmbiente) {
    console.log("Update puliziaAmbiente:", puliziaAmbiente);

    return this.http.put<PuliziaAmbiente>(`${this.api}/api/puliziaAmbiente/${puliziaAmbiente._id}`, puliziaAmbiente);
  }

  add(puliziaAmbiente: PuliziaAmbiente) {
    console.log("Inserimento puliziaAmbiente:", puliziaAmbiente);

    return this.http.post<PuliziaAmbiente>(`${this.api}/api/puliziaAmbiente`, puliziaAmbiente);
  }

  remove(puliziaAmbiente: PuliziaAmbiente) {
    console.log("Eliminazione puliziaAmbiente:", puliziaAmbiente);
    return this.http.delete<PuliziaAmbiente>(`${this.api}/api/puliziaAmbiente/${puliziaAmbiente._id}`);
  }

}
