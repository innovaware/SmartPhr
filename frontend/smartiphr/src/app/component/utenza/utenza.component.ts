import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
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

  constructor(
    public messageService: MessagesService,
    public dipendenteService: DipendentiService,
    public authenticationService: AuthenticationService,
    public usersService: UsersService,
    private router: Router
  ) {
    this.disable = this.admin ? false : true;
  }

  ngOnInit() {
    this.disable = this.admin ? false : true;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  saveCred() {
    const loggedUser = this.authenticationService.getCurrentUser();

    // Controlla se si sta modificando la propria utenza personale
    const isSelfUpdate = loggedUser && this.utente &&
      ((loggedUser._id && loggedUser._id === this.utente._id) ||
        (loggedUser.username && loggedUser.username === this.utente.username));

    // CASO A: Modifica effettuata da un Admin O per conto di un ALTRO dipendente (es. Dialog Dipendenti)
    if (this.admin || !isSelfUpdate) {
      if (this.password) {
        this.utente.password = this.password.valueOf();
      }
      this.usersService
        .save(this.utente)
        .then(() => {
          this.errorCred = false;
          this.uploadingCred = true;
          setTimeout(() => {
            this.uploadingCred = false;
          }, 3000);
          this.messageService.showMessage("Salvataggio Effettuato");
        })
        .catch((err) => {
          this.messageService.showMessageError(
            "Errore salvataggio utente (" + (err?.status || "sconosciuto") + ")"
          );
          this.uploadingCred = false;
        });
      return;
    }

    // CASO B: L'utente sta cambiando le PROPRIE credenziali
    if (this.confirmpassword == this.password) {
      if (this.password) {
        this.utente.password = this.password.valueOf();
      }

      this.usersService
        .save(this.utente)
        .then(async () => {
          this.errorCred = false;

          this.messageService.showMessage(
            "Password aggiornata con successo. È necessario effettuare nuovamente il login."
          );

          // Esegue il logout ed elimina la sessione locale per evitare errori 500 successivi
          await this.authenticationService.logoutCurrentUser(this.utente);

          setTimeout(() => {
            this.router.navigate(["login"]);
          }, 1200);
        })
        .catch((err) => {
          this.messageService.showMessageError(
            "Errore salvataggio utente (" + (err?.status || "sconosciuto") + ")"
          );
          this.uploadingCred = false;
        });
    } else {
      this.errorCred = true;
      this.messageService.showMessageError("Le due password non corrispondono");
    }
  }
}
