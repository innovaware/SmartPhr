import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Contratto } from '../models/contratto';

@Injectable({
  providedIn: 'root'
})
export class ContrattoService {
  api: string = environment.api;

  constructor(private http: HttpClient) {}

  async getContratto(id: string): Promise<Contratto[]> {
    const headers = {
      // 'Authorization': 'Bearer ' + this.token,
      // 'x-refresh': this.refreshToken
    }

    return this.http
      .get<Contratto[]>(`${this.api}/api/contratto/consulente/${id}`, { headers })
      .toPromise();
  }

  getAll(): Observable<Contratto[]> {
    const headers = {
    }

    return this.http
      .get<Contratto[]>(`${this.api}/api/contratto`, { headers })
  }

  async insert(contratto: Contratto, id: string) {
    var body = contratto;
    return this.http.post(`${this.api}/api/contratto/consulente/${id}`, body).toPromise();
  }

  async update(contratto: Contratto) {
    var body = contratto;
    return this.http.put(this.api + "/api/contratto/" + contratto._id, body).toPromise();
  }

  async remove(contratto: Contratto) {
    return this.http.delete(`${this.api}/api/contratto/${contratto._id}`).toPromise();
  }
}
