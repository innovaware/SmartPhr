import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, Subject } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { User } from "../models/user";
import { Dipendenti } from "../models/dipendenti";

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  static KEY_CURRENTUSER = "currentUser";
  currentUser: User;
  isAuthenticateHandler: Subject<User> = new Subject<User>();

  constructor(private http: HttpClient) {
    this.load();
  }

  getCurrentUserAsync(): Observable<User> {
    return new Observable<User>((observer) => {
      this.load();
      observer.next(this.currentUser);
      observer.complete();
    });
  }

  getCurrentUser(): User {
    if (!this.currentUser) {
      this.load();
    }
    return this.currentUser;
  }

  load() {
    try {
      const userStr = localStorage.getItem(AuthenticationService.KEY_CURRENTUSER);
      this.currentUser = userStr ? JSON.parse(userStr) : null;
    } catch (e) {
      this.currentUser = null;
    }
  }

  refresh() {
    if (!this.currentUser) {
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
    return !!(this.currentUser && this.currentUser.username);
  }

  login(username: string, password: string): Observable<User> {
    const auth = btoa(`${username}:${password}`);
    const headers = new HttpHeaders()
      .set("content-type", "application/json")
      .set("Authorization", "Basic " + auth);

    return this.http
      .post<any>(`${environment.api}/api/users/authenticate`, {}, { headers })
      .pipe(
        map((user: User) => {
          this.currentUser = user;
          this.refresh();
          return this.currentUser;
        })
      );
  }

  logoutCurrentUser(currentUser?: User): Promise<boolean> {
    return new Promise((resolve) => {
      const targetUser = currentUser || this.getCurrentUser();

      if (!targetUser || !targetUser.username) {
        this.clearSession();
        resolve(true);
        return;
      }

      // Eseguiamo la chiamata di logout e puliamo la sessione in TUTTI i casi (successo o errore 500)
      this.logout(targetUser.username, targetUser.password || "").subscribe({
        next: () => {
          this.clearSession();
          resolve(true);
        },
        error: (err) => {
          console.warn("Logout lato server fallito (500/401), forzo pulizia locale:", err);
          this.clearSession();
          resolve(true);
        }
      });
    });
  }

  public clearSession() {
    this.currentUser = null;
    localStorage.removeItem(AuthenticationService.KEY_CURRENTUSER);
    this.isAuthenticateHandler.next(null);
  }

  logout(username: string, password: string): Observable<any> {
    let headers = new HttpHeaders().set("content-type", "application/json");

    if (username && password) {
      const auth = btoa(`${username}:${password}`);
      headers = headers.set("Authorization", "Basic " + auth);
    }

    return this.http.post<any>(
      `${environment.api}/api/users/logout`,
      {},
      { headers }
    );
  }

  register(userId: string, username: string, password: string, active: boolean) {
    return this.http.put<any>(`${environment.api}/api/users/${userId}`, {
      username,
      password,
      active,
    });
  }

  getInfo(userId: string) {
    return this.http.get<Dipendenti[]>(
      `${environment.api}/api/users/info/${userId}`
    );
  }
}
