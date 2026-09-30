import { Injectable } from "@angular/core";
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";
import { AuthenticationService } from "../service/authentication.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        // Se il server risponde con 401 Unauthorized o 500 per le API di autenticazione/utente
        if (err.status === 401 || (err.status === 500 && request.url.includes("/api/users"))) {
          console.warn("Sessione non valida o corrotta. Reset automatico e reindirizzamento al login.");
          this.authService.clearSession();
          this.router.navigate(["login"]);
        }
        return throwError(err);
      })
    );
  }
}
