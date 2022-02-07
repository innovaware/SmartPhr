import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subject } from "rxjs";
import { AuthenticationService } from "src/app/service/authentication.service";
import { DipendentiService } from "src/app/service/dipendenti.service";
import { MessagesService } from "src/app/service/messages.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent implements OnInit {
  userId: string;
  username: string;
  password: string;
  passwordCheck: string;

  data: Subject<{
    nome: string;
    cognome: string;
    email: string;
    mansione: string;
  }>;

  constructor(
    public auth: AuthenticationService,
    public messageService: MessagesService,
    private route: ActivatedRoute
  ) {
    this.data = new Subject<{
      nome: string;
      cognome: string;
      email: string;
      mansione: string;
    }>();
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      console.log(params);

      this.userId = params.userId;
      console.log(this.userId);

      this.auth.getInfo(this.userId).subscribe(
        (info) => {
          console.log("info", info);

          this.data.next({
            nome: info[0].nome,
            cognome: info[0].cognome,
            email: info[0].email,
            mansione: info[0].mansione,
          });
        },
        (err) => {
          this.messageService.showMessageError(
            "Errore nel recuperare informazioni."
          );

          this.data.error(err);
          console.error(err);
        }
      );

      // this.dipendentiService.getById(this.userId).then((dips) => {
      //   const dip = dips[0];
      //   this.data = {
      //     nome: dip.nome,
      //     cognome: dip.cognome,
      //     email: dip.email,
      //     mansione: dip.mansione,
      //   };
      // });
    });
  }

  checkValidForm() {
    if (this.username === undefined || this.username === "") {
      this.messageService.showMessageError("Username non valida");
      return false;
    }

    if (this.password === undefined || this.password === "") {
      this.messageService.showMessageError("Password non valida");
      return false;
    }

    if (this.passwordCheck === undefined || this.passwordCheck === "") {
      this.messageService.showMessageError("Password non corretta");
      return false;
    }

    if (this.passwordCheck !== this.password) {
      this.messageService.showMessageError("Verifica la password");
      return false;
    }

    return true;
  }

  register() {
    if (this.checkValidForm()) {
      console.log("Register User");

      this.auth
        .register(this.userId, this.username, this.password, true)
        .subscribe(
          (success) => console.log(success),
          (err) => console.error(err)
        );
    }
  }
}
