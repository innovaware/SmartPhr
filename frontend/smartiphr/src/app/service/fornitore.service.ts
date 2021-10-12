import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Fornitore } from '../models/fornitore';

@Injectable({
  providedIn: "root",
})
export class FornitoreService {

  api: string = environment.api;

  constructor(private http: HttpClient) {}

  async getFornitori(): Promise<Fornitore[]> {
    return this.http.get<Fornitore[]>(this.api + "/api/fornitori").toPromise();
  }

  async getFornitore(id: string): Promise<Fornitore[]> {
    return this.http.get<Fornitore[]>(`${this.api}/api/fornitori/${id}`).toPromise();
  }

  save(data: Fornitore): Promise<Fornitore> {
    var body = data;
    console.log("body: ", body);
    return this.http
      .put<Fornitore>(this.api + "/api/fornitori/" + data._id, body)
      .toPromise();
  }

  insert(data: Fornitore): Promise<Fornitore> {
    var body = data;
    return this.http
      .post<Fornitore>(this.api + "/api/fornitori", body)
      .toPromise();
  }

  delete(data: Fornitore): Observable<any> {
    return this.http
    .delete(this.api + "/api/fornitori/" + data._id);
  }
}
