import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { User } from "../models/user";
import { id } from "date-fns/locale";
import { Dipendenti } from "../models/dipendenti";

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  static KEY_CURRENTUSER = "currentUser";
  currentUser: User;
  isAuthenticateHandler: Subject<User>;

  constructor(private http: HttpClient) {
    this.load();
    this.isAuthenticateHandler = new Subject<User>();
  }

  getCurrentUserAsync(): Observable<User> {
    return new Observable<User>((observer) => {
      this.load();
      observer.next(this.currentUser);
    });
  }

  load() {
    this.currentUser = JSON.parse(
      localStorage.getItem(AuthenticationService.KEY_CURRENTUSER)
    );
  }

  refresh() {
    if (this.currentUser === undefined) {
      localStorage.removeItem(AuthenticationService.KEY_CURRENTUSER);
    } else {
      localStorage.setItem(
        AuthenticationService.KEY_CURRENTUSER,
        JSON.stringify(this.currentUser)
      );
    }

    this.isAuthenticateHandler.next(this.currentUser);
  }

  isAuthenticated(): boolean {
    this.load();
    return (
      this.currentUser != undefined &&
      this.currentUser.username != undefined &&
      this.currentUser.password != undefined
    );
  }

  login(username: string, password: string): Observable<User> {
    const auth = btoa(`${username}:${password}`);
    const body = {};

    const headers_object = new HttpHeaders();
    headers_object.append("Content-Type", "application/json");
    headers_object.append("Authorization", `Basic ${auth}`);

    const headers = new HttpHeaders()
      .set("content-type", "application/json")
      .set("Authorization", "Basic " + auth)
      .set("Access-Control-Allow-Origin", "*");

    const httpOptions = {
      headers: headers,
    };

    return this.http
      .post<any>(`${environment.api}/api/users/authenticate`, body, httpOptions)
      .pipe(
        map((user: User) => {
          this.currentUser = user;
          this.refresh();
          return this.currentUser;
        })
      );
  }

  logoutCurrentUser(currentUser: User) {
    return this.logout(currentUser.username, currentUser.password);
  }

  logout(username: string, password: string): Observable<User> {
    console.log("logout");
    const auth = btoa(`${username}:${password}`);
    const body = {};

    const headers_object = new HttpHeaders();
    headers_object.append("Content-Type", "application/json");
    headers_object.append("Authorization", `Basic ${auth}`);

    const headers = new HttpHeaders()
      .set("content-type", "application/json")
      .set("Authorization", "Basic " + auth)
      .set("Access-Control-Allow-Origin", "*");

    const httpOptions = {
      headers: headers,
    };

    this.currentUser = undefined;
    this.refresh();

    return this.http.post<any>(
      `${environment.api}/api/users/logout`,
      body,
      httpOptions
    );
  }

  register(
    userId: string,
    username: string,
    password: string,
    active: boolean
  ) {
    return this.http.put<any>(`${environment.api}/api/users/${userId}`, {
      username: username,
      password: password,
      active: active,
    });
  }

  getInfo(userId: string) {
    return this.http.get<Dipendenti[]>(
      `${environment.api}/api/users/info/${userId}`
    );
  }
}
