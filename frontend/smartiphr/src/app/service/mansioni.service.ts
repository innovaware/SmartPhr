import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from 'src/environments/environment';
import { Mansione } from '../models/mansione';

@Injectable({
  providedIn: 'root'
})
export class MansioniService {

  api: string = `${environment.api}/api/mansioni`;

  constructor(private http: HttpClient) {}

  async get(): Promise<Mansione[]> {
    return this.http.get<Mansione[]>(`${this.api}`).toPromise();
  }

  async getById(id: string): Promise<Mansione> {
    return this.http.get<Mansione>(`${this.api}/${id}`).toPromise();
  }

  save(data: Mansione): Promise<Mansione> {
    var body = data;
    return this.http
      .put<Mansione>(`${this.api}/${data._id}`, body)
      .toPromise();
  }

  insert(data: Mansione): Promise<Mansione> {
    var body = data;
    return this.http
      .post<Mansione>(`${this.api}`, body)
      .toPromise();
  }

  async remove(data: Mansione) {
    return this.http.delete(`${this.api}/${data._id}`).toPromise();
  }
}
