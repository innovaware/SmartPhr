import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { User } from "../models/user";

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  currentUser: User;

  constructor(private http: HttpClient) {
    this.currentUser = JSON.parse(localStorage.getItem("currentUser"))
  }

  public get currentUserValue(): User {
    this.currentUser = JSON.parse(localStorage.getItem("currentUser"))
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    const currentUser: User = this.currentUserValue; //JSON.parse(localStorage.getItem("currentUser"));
    return currentUser != undefined &&
      currentUser.username != undefined &&
      currentUser.password != undefined;
  }

  login(username: string, password: string) {
    return this.http
      .post<any>(`${environment.api}/users/authenticate`, {
        username,
        password,
      })
      .pipe(
        map((user) => {
          // store user details and basic auth credentials in local storage to keep user logged in between page refreshes
          user.authdata = window.btoa(username + ":" + password);
          localStorage.setItem("currentUser", JSON.stringify(user));
          this.currentUser = user
          return user;
        })
      );
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem("currentUser");
    this.currentUser = undefined;
  }
}
