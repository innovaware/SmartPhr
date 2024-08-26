import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from 'src/environments/environment';
import { RichiestePresidi } from '../models/richiestePresidi';

@Injectable({
  providedIn: 'root'
})
export class RichiestePresidiService {

  api: string = `${environment.api}/api/richiestePresidi`;

  constructor(private http: HttpClient) { }

  async get(): Promise<RichiestePresidi[]> {
    return this.http.get<RichiestePresidi[]>(`${this.api}`).toPromise();
  }

  async getById(id: string): Promise<RichiestePresidi> {
    return this.http.get<RichiestePresidi>(`${this.api}/${id}`).toPromise();
  }

  save(data: RichiestePresidi): Promise<RichiestePresidi> {
    var body = data;
    return this.http
      .put<RichiestePresidi>(`${this.api}/${data._id}`, body)
      .toPromise();
  }

  insert(data: RichiestePresidi): Promise<RichiestePresidi> {
    var body = data;
    return this.http
      .post<RichiestePresidi>(`${this.api}`, body)
      .toPromise();
  }
}
