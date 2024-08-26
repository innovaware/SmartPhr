import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Consulenti } from '../models/consulenti';

@Injectable({
  providedIn: "root",
})
export class ConsulentiService {

  api: string = environment.api;

  constructor(private http: HttpClient) {}

  async getConsulenti(): Promise<Consulenti[]> {
    return this.http.get<Consulenti[]>(this.api + "/api/consulenti").toPromise();
  }
  async getById(id:String): Promise<Consulenti> {
    return this.http.get<Consulenti>(this.api + "/api/consulenti/"+id).toPromise();
  }

  insert(consulente: Consulenti): Observable<Consulenti> {
    var body = consulente;
    return this.http.post<Consulenti>(this.api + "/api/consulenti", body);
  }

  update(consulente: Consulenti): Observable<Consulenti> {
    var body = consulente;
    return this.http.put<Consulenti>(this.api + "/api/consulenti/" + consulente._id, body);
  }

  delete(consulente: Consulenti): Observable<Consulenti> {
    return this.http.delete<Consulenti>(this.api + "/api/consulenti/" + consulente._id);
  }
}
