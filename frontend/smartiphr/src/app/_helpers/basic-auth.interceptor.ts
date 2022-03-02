import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from "@angular/common/http";
import { User } from "../models/user";

import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { Router } from "@angular/router";
import { AuthenticationService } from "../service/authentication.service";

@Injectable()
export class BasicAuthInterceptor implements HttpInterceptor {
  constructor(
    private authenticationService: AuthenticationService,
    private route: Router
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    if (this.authenticationService.isAuthenticated()) {
      const currentUser: User = this.authenticationService.currentUser;
      if (currentUser) {
        const auth = btoa(`${currentUser.username}:${currentUser.password}`);
        request = request.clone({
          setHeaders: {
            Authorization: `Basic ${auth}`,
          },
        });
      } else {
        this.route.navigate(["/"]);
      }
    }

    // return next.handle(request);
    return next.handle(request).pipe(
      tap(
        (event) => {},
        (error) => {
          if (error instanceof HttpErrorResponse) {
            if (error.status === 401) {
              //this.authenticationService.logout();
              this.route.navigate(["/"]);
            }
          }
        }
      )
    );

    // return next.handle(request).do((event: HttpEvent<any>) => {
    //   if (event instanceof HttpResponse) {
    //   }
    // }, (err: any) => {
    //   if (err instanceof HttpErrorResponse) {
    //     if (err.status === 401) {
    //         this.router.navigate(['login']);
    //     }
    //   }
    // });
  }
}
