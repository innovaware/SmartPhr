import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { User } from './models/user';
import { AuthenticationService } from "./service/authentication.service";
import { DebugService } from "./service/debug.service";
import { Log } from "./models/log";
import { DipendentiService } from "./service/dipendenti.service";
import { MessagesService } from "./service/messages.service";
import { LogService } from "./service/log.service";
import { MatDialog } from "@angular/material/dialog";
import { NewMessageService } from "./service/newMessage.service";
import { NewMessage } from "./models/newMessage";
import { DialogNewMessageComponent } from "./dialogs/dialog-newMessage/dialog-newMessage.component";
import { Subscription } from "rxjs/internal/Subscription";
import { interval } from "rxjs/internal/observable/interval";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent  {
  title = "smartiphr";
  isAuthenticated: boolean;
  numNotifiche: number;
  viewDate: Date = new Date();
  events = [];
  private user: User;
  private timerSubscription!: Subscription;
  private alreadyExecuted: boolean = false;
  isMenuOpen: boolean = false;

  constructor(
    public dialog: MatDialog,
    private authenticationService: AuthenticationService,
    private route: Router,
    private debugService: DebugService,
    private dipendenteService: DipendentiService,
    private messageService: MessagesService,
    private newMessServ: NewMessageService,
    private logServ: LogService
  ) {
    this.numNotifiche = 0;
    this.user = new User();
    this.authenticationService.isAuthenticateHandler.subscribe(
      (user: User) => {
        this.isAuthenticated = user !== undefined && user !== null;
        this.user = user;
        console.log(user);

        newMessServ.getMessagesForDip(user.dipendenteID).subscribe((x: NewMessage[] | null) => {
          console.log(x);
          if (x) {
            if (x.filter(y => !y.letto).length>0) {
              this.numNotifiche = x.filter(y => !y.letto).length;
              const dialogRef = this.dialog.open(DialogNewMessageComponent, {
                disableClose: true,
                data: {
                  view: true,
                  auto:true
                },
                width: '90%',  // Larghezza del dialog responsiva
                maxWidth: '600px', // Larghezza massima
                height: 'auto', // Altezza automatica
                maxHeight: '90vh' // Altezza massima responsiva
              });
              dialogRef.afterClosed().subscribe(() => {
                this.numNotifiche = 0;
            });
            }
            
          } 
        });

      },
      err => console.error(err)
    );
    this.startCheckingTime();
    this.authenticationService.refresh();

    

  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  private startCheckingTime(): void {
    console.log("DENTRO START");
    if (this.timerSubscription) {
      return; // Evita duplicazioni
    }
    this.timerSubscription = interval(60000).subscribe(() => this.checknotify());
  }

  checknotify() {
    this.user = this.authenticationService.getCurrentUser();

    this.newMessServ.getMessagesForDip(this.user.dipendenteID).subscribe((x: NewMessage[] | null) => {
      console.log(x);
      if (x) {
        this.numNotifiche = x.filter(y => !y.letto).length;
      } else {
        this.numNotifiche = 0;
      }
    });
  }


  async logout() {

    this.stopCheckingTime();
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

  private stopCheckingTime(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.timerSubscription = undefined!;
    }
  }

  openNotifications() {
    const dialogRef = this.dialog.open(DialogNewMessageComponent, {
      data: {
        view: true,
      },
      width: '90%',  // Larghezza del dialog responsiva
      maxWidth: '600px', // Larghezza massima
      height: 'auto', // Altezza automatica
      maxHeight: '90vh' // Altezza massima responsiva
    });
    dialogRef.afterClosed().subscribe(() => {
      this.newMessServ.getMessagesForDip(this.authenticationService.getCurrentUser().dipendenteID).subscribe((x: NewMessage[] | null) => {
        console.log(x);
        if (x) {
          if (x.filter(y => !y.letto).length > 0) {
            this.numNotifiche = x.filter(y => !y.letto).length;
          }
          else {
            this.numNotifiche = 0;
          }
        }
      });
    });
  }

  async newMessage() {

    // Apri il dialog dopo aver ottenuto i dati
    const dialogRef = this.dialog.open(DialogNewMessageComponent, {
      data: {
       new:true,
     },
     width: '90%',  // Larghezza del dialog responsiva
     maxWidth: '600px', // Larghezza massima
     height: 'auto', // Altezza automatica
     maxHeight: '90vh' // Altezza massima responsiva
   });
  }

}
