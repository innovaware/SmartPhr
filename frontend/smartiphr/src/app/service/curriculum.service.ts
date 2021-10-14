import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Curriculum } from '../models/curriculum';

@Injectable({
  providedIn: 'root'
})
export class CurriculumService {
  api: string = environment.api;

  constructor(private http: HttpClient) {}

   get(id: string):  Observable<Curriculum[]>  {
    return this.http
      .get<Curriculum[]>(`${this.api}/api/curriculum/dipendente/${id}`);
  }

   insert(curriculum: Curriculum, id: string) {
    var body = curriculum;
    return this.http.post(`${this.api}/api/curriculum/dipendente/${id}`, body);
  }

   update(curriculum: Curriculum) {
    var body = curriculum;
    console.log("body: ", body);
    return this.http.put(this.api + "/api/curriculum/" + curriculum._id, body);
  }

   remove(curriculum: Curriculum) {
    return this.http.delete(`${this.api}/api/curriculum/${curriculum._id}`);
  }
}
