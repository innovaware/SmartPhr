import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from 'src/environments/environment';
import { Materiali } from '../models/materiali';

@Injectable({
  providedIn: 'root'
})
export class MaterialiService {

  api: string = `${environment.api}/api/materiali`;

  constructor(private http: HttpClient) { }

  async get(): Promise<Materiali[]> {
    return this.http.get<Materiali[]>(`${this.api}`).toPromise();
  }
  async getByType(type: String): Promise<Materiali[]> {
    return this.http.get<Materiali[]>(`${this.api}/type/${type}`).toPromise();
  }

  async getById(id: string): Promise<Materiali> {
    return this.http.get<Materiali>(`${this.api}/${id}`).toPromise();
  }
}
