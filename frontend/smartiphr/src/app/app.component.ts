import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { User } from './models/user';
import { AuthenticationService } from "./service/authentication.service";
import { DebugService } from "./service/debug.service";

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
    private debugService: DebugService,
  ) {
    this.authenticationService.isAuthenticateHandler.subscribe(
      (user: User) => {
        this.isAuthenticated = user !== undefined && user !== null;
      },
      err => console.error(err)
    );

    this.authenticationService.refresh();
  }

  async logout() {
    this.authenticationService.getCurrentUserAsync().subscribe(
      (user: User) => {
        this.authenticationService.logout(user.username, user.password);
        this.route.navigate(["login"]);
      }
    )
  }

  newMessage() {
    //TODO Invio un messaggio
    console.log("Nuovo messaggio");

  }

}
