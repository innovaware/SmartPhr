import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MessagesService } from 'src/app/service/messages.service';
import { Dipendenti } from '../../models/dipendenti';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { NewMessage } from '../../models/newMessage';
import { MansioniService } from '../../service/mansioni.service';
import { DipendentiService } from '../../service/dipendenti.service';
import { AuthenticationService } from '../../service/authentication.service';
import { Mansione } from '../../models/mansione';
import { NewMessageService } from '../../service/newMessage.service';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { User } from '../../models/user';

@Component({
  selector: 'app-dialog-newMessage',
  templateUrl: './dialog-newMessage.component.html',
  styleUrls: ['./dialog-newMessage.component.css']
})
export class DialogNewMessageComponent implements OnInit {

  mess: NewMessage;
  dipendente: Dipendenti;
  mansioni: Mansione[] = [];
  dipendenti: Dipendenti[];
  destinatari: Dipendenti[];
  user: User;
  DestinatariMansioni: String[];
  messaggi: NewMessage[];
  type: String = "dip";
  dataSource: MatTableDataSource<NewMessage>;
  DisplayedColumns: string[] = ["data","mittente","oggetto", "action"];
  @ViewChild("paginatorMessaggi", { static: false }) paginator: MatPaginator;
  constructor(
    public dialog: MatDialog,
    private newMessServ: NewMessageService,
    private mansServ: MansioniService,
    private dipServ: DipendentiService,
    private authServ: AuthenticationService,
    private messageService: MessagesService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
        new: Boolean,
        view: Boolean,
        read: Boolean,
        auto: Boolean,
        messaggio: NewMessage,
    }) {
    this.user = new User();
    if (data.new) {
      this.mess = new NewMessage();
      this.destinatari = [];
      this.DestinatariMansioni = [];
      this.loadUser();
      this.getMansioni();
      this.getDipendenti();
    }
    if (data.view) {
      this.messaggi = [];
      this.dataSource = new MatTableDataSource<NewMessage>();
      this.getMessages();
    }
  }
  // Funzione di confronto per il mat-select
  compareDipendenti(dip1: Dipendenti, dip2: Dipendenti): boolean {
    return dip1 && dip2 ? dip1._id === dip2._id : dip1 === dip2;
  }

  ngOnInit(): void {
  }

  async invia() {
    // Verifica che ci siano destinatari selezionati
    if ((!this.destinatari || this.destinatari.length === 0) && (!this.DestinatariMansioni || this.DestinatariMansioni.length === 0)) {
      this.messageService.showMessageError('Seleziona almeno un destinatario');
      return;
    }

    // Verifica che oggetto e corpo del messaggio siano compilati
    if (!this.mess.oggetto || !this.mess.corpo) {
      this.messageService.showMessageError('Compila tutti i campi obbligatori');
      return;
    }
    console.log(this.type);
    if (this.type == "dip") {
      try {
        // Recupera l'utente corrente e i suoi dati
        const user = this.authServ.getCurrentUser();
        const mittente = await this.dipServ.getByIdUser(user.dipendenteID);

        // Per ogni destinatario, crea e invia un nuovo messaggio
        for (const destinatario of this.destinatari) {
          const nuovoMessaggio = new NewMessage();

          // Dati del mittente
          nuovoMessaggio.mittenteId = user.dipendenteID;
          nuovoMessaggio.mittente = mittente[0].nome + ' ' + mittente[0].cognome;

          // Dati del destinatario
          nuovoMessaggio.destinatarioId = destinatario._id;
          nuovoMessaggio.destinatario = destinatario.nome + ' ' + destinatario.cognome;

          // Contenuto del messaggio
          nuovoMessaggio.oggetto = this.mess.oggetto;
          nuovoMessaggio.corpo = this.mess.corpo;

          // Campi di default
          nuovoMessaggio.letto = false;
          nuovoMessaggio.data = new Date();

          console.log('Invio messaggio:', nuovoMessaggio); // Per debug

          // Invia il messaggio utilizzando il service
          await this.newMessServ.add(nuovoMessaggio).toPromise();
        }

        if (this.destinatari.length > 1) // Mostra messaggio di successo
          this.messageService.showMessage('Messaggi inviati con successo');
        else // Mostra messaggio di successo
          this.messageService.showMessage('Messaggio inviato con successo');

      } catch (error) {
        console.error('Errore durante l\'invio dei messaggi:', error);
        this.messageService.showMessageError(
          `Errore durante l'invio dei messaggi (${error.status})`
        );
      }
      return;
    }
    if (this.type == "man") {
      try {
        // Recupera l'utente corrente e i suoi dati
        const user = this.authServ.getCurrentUser();
        const mittente = await this.dipServ.getByIdUser(user.dipendenteID);

        // Per ogni destinatario, crea e invia un nuovo messaggio
        for (const mansioni of this.DestinatariMansioni) {
          const nuovoMessaggio = new NewMessage();

          // Dati del mittente
          nuovoMessaggio.mittenteId = user.dipendenteID;
          nuovoMessaggio.mittente = mittente[0].nome + ' ' + mittente[0].cognome;

          

          // Contenuto del messaggio
          nuovoMessaggio.oggetto = this.mess.oggetto;
          nuovoMessaggio.corpo = this.mess.corpo;

          // Campi di default
          nuovoMessaggio.letto = false;
          nuovoMessaggio.data = new Date();

          for (const destinatario of this.dipendenti) {
            if (destinatario.mansione == mansioni) {
              console.log('Invio messaggio:', nuovoMessaggio); // Per debug
              // Dati del destinatario
              nuovoMessaggio.destinatarioId = destinatario._id;
              nuovoMessaggio.destinatario = destinatario.nome + ' ' + destinatario.cognome;
              // Invia il messaggio utilizzando il service
              await this.newMessServ.add(nuovoMessaggio).toPromise();
            }
          }
        }

        if (this.destinatari.length > 1) // Mostra messaggio di successo
          this.messageService.showMessage('Messaggi inviati con successo');
        else // Mostra messaggio di successo
          this.messageService.showMessage('Messaggio inviato con successo');

      } catch (error) {
        console.error('Errore durante l\'invio dei messaggi:', error);
        this.messageService.showMessageError(
          `Errore durante l'invio dei messaggi (${error.status})`
        );
      }
      return;
      return;
    }

  }

  onTabChange(event: MatTabChangeEvent) {
    // Cambia il tipo in base all'indice della scheda selezionata
    if (event.index === 0) {
      this.type = 'dip'; // Scheda "Invia a Singoli destinatari"
    } else if (event.index === 1) {
      this.type = 'man'; // Scheda "Altro Tipo di Invio"
    }
    console.log(this.type);
  }

  loadUser() {
    this.user = new User();
    this.dipendente = new Dipendenti();
    this.authServ.getCurrentUserAsync().subscribe((user) => {
      console.log("get dipendente");
      this.dipServ
        .getByIdUser(user.dipendenteID)
        .then((x) => {

          this.dipendente = x[0];
          this.user = user;
        })
        .catch((err) => {
          this.messageService.showMessageError(
            "Errore Caricamento dipendente (" + err["status"] + ")"
          );
        });
    });
  }

  async getMansioni() {
    this.mansioni = [];
    try {
      const mansioni = await this.mansServ.get();
      this.mansioni = mansioni.filter(x => x.codice != "SA");
    } catch (err) {
      this.messageService.showMessageError(
        `Errore Caricamento mansione (${err["status"]})`
      );
    }
  }

  async getDipendenti() {
    this.dipendenti = [];
    try {
      const dip = await this.dipServ.get();
      this.dipendenti = dip.filter(x => x.mansione != "66aa1532b6f9db707c1c2010");
    } catch (err) {
      this.messageService.showMessageError(
        `Errore Caricamento dipendenti (${err["status"]})`
      );
    }
  }

  async getMessages() {
    this.messaggi = [];
    try {
      this.messaggi = await this.newMessServ.getMessagesForDip(this.authServ.getCurrentUser().dipendenteID).toPromise();
      this.dataSource.data = this.messaggi.sort(
        (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
      );
      this.dataSource.paginator = this.paginator;
      if (this.messaggi.filter(x => !x.letto).length == 0) this.data.auto = false;
    }
    catch (error) {
      this.messageService.showMessageError(error);
    }
  }

  async readMessage(row: NewMessage) {
    const dialogRef = this.dialog.open(DialogNewMessageComponent, {
      data: {
        read: true,
        messaggio: row,
        auto:false,
      },
      width: '90%',  // Larghezza del dialog responsiva
      maxWidth: '600px', // Larghezza massima
      height: 'auto', // Altezza automatica
      maxHeight: '90vh' // Altezza massima responsiva
    });
    dialogRef.afterClosed().subscribe(async () => {
      const index = this.messaggi.indexOf(row);
      console.log(index);
      console.log(row);
      if (index > -1) {
        row.letto = true;
        this.messaggi[index] = row;
        console.log(row);
        await this.newMessServ.Update(row).toPromise();
        this.getMessages();
      }
    });
  }
}
