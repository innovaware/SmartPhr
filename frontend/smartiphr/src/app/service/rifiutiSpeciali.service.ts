import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from 'src/environments/environment';
import { RifiutiSpeciali } from '../models/rifiutiSpeciali';

@Injectable({
  providedIn: 'root'
})
export class RifiutiSpecialiService {

  api: string = `${environment.api}/api/rifiutiSpeciali`;

  constructor(private http: HttpClient) { }

  async get(): Promise<RifiutiSpeciali[]> {
    return this.http.get<RifiutiSpeciali[]>(`${this.api}`).toPromise();
  }

  async getByYear(anno: Number): Promise<RifiutiSpeciali> {
    return this.http.get<RifiutiSpeciali>(`${this.api}/${anno}`).toPromise();
  }

  save(data: RifiutiSpeciali): Promise<RifiutiSpeciali> {
    var body = data;
    return this.http
      .put<RifiutiSpeciali>(`${this.api}/${data._id}`, body)
      .toPromise();
  }

  insert(data: RifiutiSpeciali): Promise<RifiutiSpeciali> {
    var body = data;
    return this.http
      .post<RifiutiSpeciali>(`${this.api}`, body)
      .toPromise();
  }
}
