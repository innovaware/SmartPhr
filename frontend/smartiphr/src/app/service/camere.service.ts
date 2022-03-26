import { Injectable } from '@angular/core';

import { Observable } from "rxjs";
import { environment } from 'src/environments/environment';
import { HttpClient } from "@angular/common/http";
import { Camere } from '../models/camere';
import { filter, flatMap, map, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CamereService {
  api: string = environment.api;

  constructor(private http: HttpClient) { }

  get(selectedPiano: string): Observable<Camere[]> {
      return this.http.get<Camere[]>(`${this.api}/api/camera/${selectedPiano}`)
  }

  update(camera: Camere) {
    camera.geometry = JSON.stringify(camera.geometryObject);
    return this.http.put<Camere>(`${this.api}/api/camera/${camera._id}`, camera);
  }

  add(camera: Camere) {
    camera.geometry = JSON.stringify(camera.geometryObject);
    return this.http.post<Camere>(`${this.api}/api/camera`, camera);
  }

  remove(camera: Camere) {
    camera.geometry = JSON.stringify(camera.geometryObject);
    return this.http.delete<Camere>(`${this.api}/api/camera/${camera._id}`);
  }

}
