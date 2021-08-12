import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from 'src/environments/environment';
import { Asp } from '../models/asp';

@Injectable({
  providedIn: "root",
})
export class AspService {

  api: string = environment.api;

  constructor(private http: HttpClient) {}

  async getAsp(): Promise<Asp[]> {
    return this.http.get<Asp[]>(this.api + "/api/asp").toPromise();
  }
}
