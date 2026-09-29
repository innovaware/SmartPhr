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
export class AppComponent {
  title = "smartiphr";
  isAuthenticated: boolean = false;
  numNotifiche: number = 0;
  viewDate: Date = new Date();
  events = [];
  private user: User = new User();
  private timerSubscription!: Subscription;
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
    this.authenticationService.isAuthenticateHandler.subscribe(
      (user: User) => {
        this.isAuthenticated = user !== undefined && user !== null;
        this.user = user;

        if (this.isAuthenticated && user?.dipendenteID) {
          newMessServ.getMessagesForDip(user.dipendenteID).subscribe((x: NewMessage[] | null) => {
            if (x) {
              if (x.filter(y => !y.letto).length > 0) {
                this.numNotifiche = x.filter(y => !y.letto).length;
                const dialogRef = this.dialog.open(DialogNewMessageComponent, {
                  disableClose: true,
                  data: {
                    view: true,
                    auto: true
                  },
                  width: '90%',
                  maxWidth: '600px',
                  height: 'auto',
                  maxHeight: '90vh'
                });
                dialogRef.afterClosed().subscribe(() => {
                  this.numNotifiche = 0;
                });
              }
            }
          });
        }
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
    if (this.timerSubscription) {
      return;
    }
    this.timerSubscription = interval(60000).subscribe(() => this.checknotify());
  }

  checknotify() {
    this.user = this.authenticationService.getCurrentUser();
    if (this.user?.dipendenteID) {
      this.newMessServ.getMessagesForDip(this.user.dipendenteID).subscribe((x: NewMessage[] | null) => {
        if (x) {
          this.numNotifiche = x.filter(y => !y.letto).length;
        } else {
          this.numNotifiche = 0;
        }
      });
    }
  }

  async logout() {
    this.stopCheckingTime();
    try {
      let log: Log = new Log();
      log.className = "Logout";
      log.operazione = "Logout";
      log.data = new Date();

      const user = await this.authenticationService.getCurrentUser();

      if (!user || !user.dipendenteID) {
        this.messageService.showMessageError("Utente non valido.");
        return;
      }

      const dipendente = await this.dipendenteService.getByIdUser(user.dipendenteID);

      if (dipendente && dipendente[0]) {
        log.operatore = `${dipendente[0].nome} ${dipendente[0].cognome}`;
      } else {
        this.messageService.showMessageError("Dipendente non trovato.");
        return;
      }
      log.operatoreID = user.dipendenteID;

      await this.logServ.addLog(log);
      await this.authenticationService.logoutCurrentUser(user);
      this.route.navigate(["login"]);
    } catch (error: any) {
      console.error("Errore durante il logout:", error);
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
      width: '90%',
      maxWidth: '600px',
      height: 'auto',
      maxHeight: '90vh'
    });

    dialogRef.afterClosed().subscribe(() => {
      const user = this.authenticationService.getCurrentUser();
      if (user?.dipendenteID) {
        this.newMessServ.getMessagesForDip(user.dipendenteID).subscribe((x: NewMessage[] | null) => {
          if (x) {
            this.numNotifiche = x.filter(y => !y.letto).length;
          } else {
            this.numNotifiche = 0;
          }
        });
      }
    });
  }

  async newMessage() {
    this.dialog.open(DialogNewMessageComponent, {
      data: {
        new: true,
      },
      width: '90%',
      maxWidth: '600px',
      height: 'auto',
      maxHeight: '90vh'
    });
  }
}
