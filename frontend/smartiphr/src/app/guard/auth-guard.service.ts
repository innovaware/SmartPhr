import { Injectable } from "@angular/core";
import { Router, CanActivate } from "@angular/router";
import { User } from "../models/user";
import { AuthenticationService } from "../service/authentication.service";

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(public auth: AuthenticationService, public router: Router) {}
  canActivate(): boolean {
    //console.log('Guard:', this.auth);

    if (!this.auth.isAuthenticated()) {
      this.router.navigate(["login"]);

      return false;
    }
    return true;
  }
}
