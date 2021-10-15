import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from 'src/environments/environment';
import { Turnimensili } from '../models/turnimensili';

@Injectable({
  providedIn: 'root'
})
export class TurnimensiliService {

  api: string = environment.api;

  constructor(private http: HttpClient) {}


  async getTurnimensiliByDipendente(id): Promise<Turnimensili[]> {
    return this.http.get<Turnimensili[]>(this.api + "/api/turnimensili/dipendente/" + id).toPromise();
  }


  async getTurnimensili(): Promise<Turnimensili[]> {
    return this.http.get<Turnimensili[]>(this.api + "/api/turnimensili").toPromise();
  }

  async insertTurno(turnimensili: Turnimensili) {
    var body = turnimensili;
    return this.http.post(this.api + "/api/turnimensili", body).toPromise();
  }

  async updateTurno(turnimensili: Turnimensili) {
    var body = turnimensili;
    console.log("body: ", body);
    return this.http.put(this.api + "/api/turnimensili/" + turnimensili._id, body).toPromise();
  }
}
