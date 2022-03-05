import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DebugService {
  variables: {};

  constructor() {
    this.variables = {};
  }

  appendVariable(key: string, object: Subject<any> | Observable<any>, description?: string) {
    const variable = {
      key,
      object,
      description
    };
    this.variables[key] = variable;

    object.subscribe((v) => {
      this.variables[key].value = v;
      console.log("v", v);

    });
  }

  removeVariable(key: string) {
    const object = this.variables[key].object;
    object.source.unsubscribe();

    delete(this.variables[key]);
  }

  getVariables() {
    return this.variables;
  }

  getValue(key: string) {
    return this.variables[key].value;
  }
}
