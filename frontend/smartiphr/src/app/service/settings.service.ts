import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Settings } from "../models/settings";

@Injectable({
  providedIn: "root",
})
export class SettingsService {

  api: string = environment.api;

  constructor(private http: HttpClient) { }

  async getSettings(): Promise<Settings> {
    return this.http.get<Settings>(this.api + "/api/settings").toPromise();
  }

  async updateSettings(Settings: Settings) {
    var body = Settings;
    return this.http.put(this.api + "/api/settings/" + Settings._id, body).toPromise();
  }

  private handleError(error: any): Observable<never> {
    console.error('Si è verificato un errore:', error); // Log dell'errore
    return throwError(error.message || 'Errore del server');
  }
}
