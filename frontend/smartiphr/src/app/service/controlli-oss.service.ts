import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from 'src/environments/environment';
import { ControlliOSS } from '../models/controlliOSS';

@Injectable({
  providedIn: 'root'
})
export class ControlliOSSService {

  api: string = environment.api;

  constructor(private http: HttpClient) {}


  async getAll(): Promise<ControlliOSS[]> {

    const headers = {
      // 'Authorization': 'Bearer ' + this.token,
      // 'x-refresh': this.refreshToken
    }

    return this.http
      .get<ControlliOSS[]>(this.api + "/api/armadiocontrolli", { headers })
      .toPromise();
  }


  async getAttivitaByPaziente(id): Promise<ControlliOSS[]> {

    const headers = {
      // 'Authorization': 'Bearer ' + this.token,
      // 'x-refresh': this.refreshToken
    }

    return this.http
      .get<ControlliOSS[]>(this.api + "/api/armadiocontrolli/paziente/" + id, { headers })
      .toPromise();
  }


  async insert(controllo: ControlliOSS) {
    var body = controllo;
    return this.http.post(this.api + "/api/armadiocontrolli", body).toPromise();
  }


  async update(controllo: ControlliOSS) {
    var body = controllo;
    console.log("body: ", body);
    return this.http.put(this.api + "/api/armadiocontrolli/" + controllo._id, body).toPromise();
  }
}
