import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { windowTime } from 'rxjs/operators';
import { User } from "src/app/models/user";
import { AuthenticationService } from "src/app/service/authentication.service";
import { MessagesService } from "src/app/service/messages.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  messageError: string;
  username: string;
  password: string;
  LastYear: string;

  constructor(
    private route: Router,
    public auth: AuthenticationService
  ) {
    this.messageError = "";
    this.LastYear = "© 2020-" + (new Date()).getFullYear();
  }

  ngOnInit() {}

  async access() {
    this.messageError = "";
    if (this.username === undefined || this.username === "") {
      //this.messageService.showMessageError("Username non valida");
      this.messageError = "Username non valida";
      return;
    }

    if (this.password === undefined || this.password === "") {
      //this.messageService.showMessageError("Password non valida");
      this.messageError = "Username non valida";
      return;
    }
    this.auth.login(this.username, this.password).subscribe(
      
      (user: User) => {
        this.route.navigate(["/"]).then(x=> {
          window.location.reload();
        });
      },
      (err) => {
        console.error("Error login");
        this.messageError = "Errore in fase di login";
      }
    );

  }
}
