import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Asp } from "../models/asp";
import { Documento } from '../models/documento';

@Injectable({
  providedIn: "root",
})
export class UploadService {
  api: string = environment.api;

  constructor(private http: HttpClient) {}

  async uploadDocument(body: FormData) {
    let params = new HttpParams();

    const options = {
      params: params,
      reportProgress: true,
    };

    //const req = new HttpRequest('POST', url, formData, options);
    //return this.http.request(req);
    return this.http.post(this.api + "/api/upload", body, options).toPromise();
  }

}
