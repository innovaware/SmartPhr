import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { Paziente } from "./models/paziente";
import { User } from './models/user';
import { AuthenticationService } from "./service/authentication.service";
import { PazienteService } from "./service/paziente.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  title = "smartiphr";
  isAuthenticated: boolean;

  viewDate: Date = new Date();
  events = [];

  constructor(
    private authenticationService: AuthenticationService,
    private route: Router,
  ) {
    this.authenticationService.isAuthenticateHandler.subscribe(
      (user: User) => {
        this.isAuthenticated = user !== undefined;
      },
      err => console.error(err)
    );

    this.authenticationService.refresh();
  }

  async logout() {
    this.authenticationService.logout();
    this.route.navigate(["login"]);
  }

  newMessage() {
    //TODO Invio un messaggio
    console.log("Nuovo messaggio");

  }

}
