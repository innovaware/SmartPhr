import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from 'src/environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  api: string = `${environment.api}/api/users`;

  constructor(private http: HttpClient) {}

  async get(): Promise<User[]> {
    return this.http.get<User[]>(`${this.api}`).toPromise();
  }

  async getById(id: string): Promise<User> {
    return this.http.get<User>(`${this.api}/${id}`).toPromise();
  }

  save(data: User): Promise<User> {
    var body = data;
    console.log("body: ", body);
    return this.http
      .put<User>(`${this.api}/${data._id}`, body)
      .toPromise();
  }

  insert(data: User): Promise<User> {
    var body = data;
    console.log("INSERT body: ", body);
    return this.http
      .post<User>(`${this.api}`, body)
      .toPromise();
  }

  async remove(user: User) {
    return this.http.delete(`${this.api}/${user._id}`).toPromise();
  }
}
