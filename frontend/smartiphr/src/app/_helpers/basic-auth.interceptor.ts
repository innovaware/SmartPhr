import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthenticationService } from "../service/authentication.service";
import { User } from "../models/user";

@Injectable()
export class BasicAuthInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // add authorization header with basic auth credentials if available
    //this.authenticationService.currentUserValue;
    const currentUser: User = {
      group: "",
      username: "dan",
      password: "dan",
      active: true,
    };
    console.debug("intercept currentUser: ", currentUser);

    //TODO TEMP

    if (currentUser) {
      const auth = btoa(`${currentUser.username}:${currentUser.password}`);
      request = request.clone({
        setHeaders: {
          Authorization: `Basic ${auth}`,
        },
      });
    }

    return next.handle(request);
  }
}
