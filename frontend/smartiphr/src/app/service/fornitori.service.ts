import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from 'src/environments/environment';
import { Fornitori } from '../models/fornitori';

@Injectable({
  providedIn: "root",
})
export class FornitoriService {

  api: string = environment.api;

  constructor(private http: HttpClient) {}

  async getFornitori(): Promise<Fornitori[]> {
    return this.http.get<Fornitori[]>(this.api + "/api/fornitori").toPromise();
  }
}
