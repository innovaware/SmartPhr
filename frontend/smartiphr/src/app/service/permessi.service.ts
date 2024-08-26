import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from 'src/environments/environment';
import { Permessi } from '../models/permessi';


@Injectable({
  providedIn: 'root'
})
export class PermessiService {

  api: string = environment.api;

  constructor(private http: HttpClient) {}


  getPermessiByDipendente(id): Observable<Permessi[]> {
    return this.http.get<Permessi[]>(this.api + "/api/permessi/dipendente/" + id);
  }

  getPermessiByDipendenteID(id): Promise<Permessi[]> {
    return this.http.get<Permessi[]>(this.api + "/api/permessi/dipendente/" + id).toPromise();
  }

  async getPermessi(): Promise<Permessi[]> {
    return this.http.get<Permessi[]>(this.api + "/api/permessi").toPromise();
  }

  async insertPermesso(permessi: Permessi) {
    var body = permessi;
    return this.http.post(this.api + "/api/permessi", body).toPromise();
  }

  async updatePermesso(permessi: Permessi) {
    var body = permessi;
    return this.http.put(this.api + "/api/permessi/" + permessi._id, body).toPromise();
  }

  async remove(permesso: Permessi) {
    return this.http.delete(this.api + "/api/permessi/" + permesso._id).toPromise();
  }
}
