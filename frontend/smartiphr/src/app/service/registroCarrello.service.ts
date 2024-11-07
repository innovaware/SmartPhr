import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of, throwError } from "rxjs";
import { environment } from 'src/environments/environment';
import { catchError, tap } from "rxjs/operators";
import { RegistroCarrello } from "../models/registroCarrello";

@Injectable({
  providedIn: 'root'
})
export class RegistroCarrelloService {

  api: string = environment.api;

  constructor(private http: HttpClient) { }


  get(): Promise<RegistroCarrello[]> {
    return this.http.get<RegistroCarrello[]>(`${this.api}/api/registroCarrello/`).toPromise();
  }

  getById(id: String): Promise<RegistroCarrello> {
    return this.http.get<RegistroCarrello>(`${this.api}/api/registroCarrello/${id}`).toPromise();
  }

  getByType(type: String): Promise<RegistroCarrello[]> {
    return this.http.get<RegistroCarrello[]>(`${this.api}/api/registroCarrello/type/${type}`).toPromise();
  }

  add(body: RegistroCarrello) {
    const headers = {
      // 'Authorization': 'Bearer ' + this.token,
      // 'x-refresh': this.refreshToken
    }
    return this.http
      .post<RegistroCarrello>(this.api + "/api/registroCarrello/", body)
      .toPromise();
  }

}
