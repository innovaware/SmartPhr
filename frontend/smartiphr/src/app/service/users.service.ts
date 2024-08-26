import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from 'src/environments/environment';
import { User } from '../models/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private api = `${environment.api}/api/users`;

  constructor(private http: HttpClient) { }

  get(): Promise<User[]> {
    return this.http.get<User[]>(this.api).toPromise();
  }

  getById(id: string): Promise<User> {
    return this.http.get<User>(`${this.api}/${id}`).toPromise();
  }

  getByDipendenteId(id: string): Promise<User> {
    return this.http.get<User>(`${this.api}/dipendente/${id}`).toPromise()
      .catch(error => {
        console.error('Errore durante il recupero del dipendente:', error);
        throw error;  // Rilancia l'errore dopo averlo gestito
      });
  }

  save(data: User): Promise<User> {
    return this.http.put<User>(`${this.api}/${data._id}`, data).toPromise();
  }

  insert(data: User): Promise<User> {
    return this.http.post<User>(this.api, data).toPromise();
  }

  remove(user: User){
    return this.http.delete(`${this.api}/${user._id}`).toPromise();
  }
}
