import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { environment } from "src/environments/environment";
import { Menu } from '../models/menu';

@Injectable({
  providedIn: "root",
})
export class MenuService {
  api: string = environment.api;

  constructor(private http: HttpClient) {}

  getMenu(): Observable<Menu[]> {
    return this.http
      .get<Menu[]>(`${this.api}/api/menu`);
  }
  getMenuAccess(): Observable<Menu[]> {
    return this.http
      .get<Menu[]>(`${this.api}/api/menu/access`);
  }

  update(menu: Menu): Observable<Menu> {
    return this.http
      .put<Menu>(`${this.api}/api/menu/${menu._id}`, menu);
  }

}
