import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from 'src/environments/environment';
import { Consulenti } from '../models/consulenti';

@Injectable({
  providedIn: "root",
})
export class ConsulentiService {

  api: string = environment.api;

  constructor(private http: HttpClient) {}

  async getConsulenti(): Promise<Consulenti[]> {
    return this.http.get<Consulenti[]>(this.api + "/api/consulenti").toPromise();
  }
}
