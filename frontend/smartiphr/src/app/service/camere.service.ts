import { Injectable } from '@angular/core';

import { Observable } from "rxjs";
import { environment } from 'src/environments/environment';
import { HttpClient } from "@angular/common/http";
import { Camere } from '../models/camere';

@Injectable({
  providedIn: 'root'
})
export class CamereService {
  api: string = environment.api;

  constructor(private http: HttpClient) { }

  get(): Observable<Camere[]> {
      return this.http.get<Camere[]>(`${this.api}/api/camera`);
  }
}
