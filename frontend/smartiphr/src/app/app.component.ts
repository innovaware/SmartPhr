import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { User } from './models/user';
import { AuthenticationService } from "./service/authentication.service";
import { DebugService } from "./service/debug.service";
import { Log } from "./models/log";
import { DipendentiService } from "./service/dipendenti.service";
import { MessagesService } from "./service/messages.service";
import { LogService } from "./service/log.service";

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
    private dipendenteService: DipendentiService,
    private messageService: MessagesService,
    private logServ: LogService
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
    console.log("Funzione logout chiamata!"); // Debug iniziale
    try {
      let log: Log = new Log();
      log.className = "Logout";
      log.operazione = "Logout";
      log.data = new Date();
      console.log("Log inizializzato:", log); // Verifica il log

      // Ottieni l'utente corrente
      const user = await this.authenticationService.getCurrentUser();
      console.log("Utente corrente:", user); // Debug utente

      if (!user || !user.dipendenteID) {
        this.messageService.showMessageError("Utente non valido.");
        return;
      }

      // Ottieni i dettagli del dipendente
      const dipendente = await this.dipendenteService.getByIdUser(user.dipendenteID);
      console.log("Dipendente ottenuto:", dipendente); // Debug dipendente

      if (dipendente && dipendente[0]) {
        log.operatore = `${dipendente[0].nome} ${dipendente[0].cognome}`;
      } else {
        this.messageService.showMessageError("Dipendente non trovato.");
        return;
      }
      log.operatoreID = user.dipendenteID;

      // Salva il log
      console.log("Log da salvare:", log); // Verifica log finale
      await this.logServ.addLog(log);

      // Logout dell'utente
      console.log("Effettuando logout...");
      await this.authenticationService.logoutCurrentUser(user);

      // Naviga alla pagina di login
      console.log("Navigando alla pagina di login...");
      this.route.navigate(["login"]);
    } catch (error) {
      console.error("Errore durante il logout:", error); // Log dettagliato
      this.messageService.showMessageError(
        `Errore durante il logout: ${error?.message || "sconosciuto"}`
      );
    }
  }





  newMessage() {
    //TODO Invio un messaggio
    console.log("Nuovo messaggio");

  }

}
