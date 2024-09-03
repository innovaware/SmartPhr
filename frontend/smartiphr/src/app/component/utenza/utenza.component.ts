import { Component, Input, OnInit } from "@angular/core";
import { Dipendenti } from "../../models/dipendenti";
import { User } from "../../models/user";
import { DipendentiService } from "../../service/dipendenti.service";
import { AuthenticationService } from "../../service/authentication.service";
import { UsersService } from "../../service/users.service";
import { MessagesService } from "../../service/messages.service";

@Component({
  selector: "app-utenza",
  templateUrl: "./utenza.component.html",
  styleUrls: ["./utenza.component.css"],
})
export class UtenzaComponent implements OnInit {

  //@Input() dipendente: Dipendenti;
  @Input() utente: User;
  @Input() admin: Boolean;
  disable: Boolean;

  public uploading: boolean;
  public uploadingCred: boolean;
  public errorCred: boolean;
  confirmpassword: String;
  password: String;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  //utente: User;

  constructor(
    public messageService: MessagesService,
    public dipendenteService: DipendentiService,
    public authenticationService: AuthenticationService,
    public usersService: UsersService) {
    this.disable = this.admin ? false : true;
   // this.utente = new User();
    //this.loadUserCred();
  }

  ngOnInit() {
   // this.utente = new User();
    //this.loadUserCred();

    this.disable = this.admin ? false : true;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  ngOnChange() {
  }

  saveCred() {
    if (this.admin) {
      this.utente.password = this.password.valueOf();
      this.usersService
        .save(this.utente)
        .then((x) => {
          this.errorCred = false;
          this.uploadingCred = true;
          setInterval(() => {
            this.uploadingCred = false;
          }, 3000);
          this.messageService.showMessage("Salvataggio Effettuato");
        })
        .catch((err) => {
          this.messageService.showMessageError(
            "Errore salvataggio utente (" + err["status"] + ")"
          );
          this.uploadingCred = false;
        });
      return;
    }
    if (this.confirmpassword == this.password) {
      this.utente.password = this.password.valueOf();
      this.usersService
        .save(this.utente)
        .then((x) => {
          this.errorCred = false;
          this.uploadingCred = true;
          setInterval(() => {
            this.uploadingCred = false;
          }, 3000);
          this.messageService.showMessage("Salvataggio Effettuato");
        })
        .catch((err) => {
          this.messageService.showMessageError(
            "Errore salvataggio utente (" + err["status"] + ")"
          );
          this.uploadingCred = false;
        });
    }
    else {
      this.errorCred = true;
      this.messageService.showMessageError("Le due password non corrispondono");
    }
  }

  //loadUserCred() {
  //  console.log("get cred user for ", this.dipendente);
  //  this.usersService
  //    .getByDipendenteId(this.dipendente._id)
  //    .then((x) => {
  //      console.log("utente: " + JSON.stringify(x));
  //      this.utente = x;
  //    })
  //    .catch((err) => {
  //      this.messageService.showMessageError(
  //        "Errore Caricamento dipendente (" + err["status"] + ")"
  //      );
  //    });
  //}

}
