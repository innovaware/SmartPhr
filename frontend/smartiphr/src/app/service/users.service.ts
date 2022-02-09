import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from 'src/environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  api: string = environment.api;

  constructor(private http: HttpClient) {}

  async get(): Promise<User[]> {
    return this.http.get<User[]>(this.api + "/api/users").toPromise();
  }

  async getById(id: string): Promise<User[]> {
    return this.http.get<User[]>(`${this.api}/api/users/${id}`).toPromise();
  }

  save(data: User): Promise<User> {
    var body = data;
    console.log("body: ", body);
    return this.http
      .put<User>(this.api + "/api/users/" + data._id, body)
      .toPromise();
  }

  insert(data: User): Promise<User> {
    var body = data;
    console.log("INSERT body: ", body);
    return this.http
      .post<User>(this.api + "/api/users", body)
      .toPromise();
  }

  async remove(user: User) {
    return this.http.delete(`${this.api}/api/users/${user._id}`).toPromise();
  }
}
