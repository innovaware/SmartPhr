import { AfterViewInit, Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Evento } from 'src/app/models/evento';
import { MessagesService } from '../../service/messages.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator/paginator';
import { DialogQuestionComponent } from '../dialog-question/dialog-question.component';
import { EventiService } from '../../service/eventi.service';
import { ScrollingVisibility } from '@angular/cdk/overlay';
import { UserInfo } from '../../models/userInfo';

import * as moment from "moment";

@Component({
  selector: 'app-dialog-event',
  templateUrl: './dialog-event.component.html',
  styleUrls: ['./dialog-event.component.css']
})
export class DialogEventComponent implements OnInit, AfterViewInit {
  @Input() disable: boolean = false;  // Inizializzazione con valori di default
  @Input() isNew: boolean = true;  // Inizializzazione con valori di default
  time: string;  // Usa stringa per l'input di tempo
  visible: Boolean;
  displayedColumns: string[] = ['data', 'orario', 'descrizione', 'autore', 'tipo', 'update', 'delete'];
  dataSource = new MatTableDataSource<Evento>();

  @ViewChild("paginator", { static: false }) paginator: MatPaginator;
  constructor(
    public dialog: MatDialog,
    private eventServ: EventiService,
    private messageServ: MessagesService,
    public dialogRef: MatDialogRef<DialogEventComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      item: Evento,
      items: Evento[],
      create: Boolean,
      edit: Boolean,
      user: UserInfo,
      tipo: String,
      old: Boolean,
    }
  ) {
    this.data.items = this.data.items || []; // Assicurati che sia sempre un array
    if (!data.create) {
      this.dataSource = new MatTableDataSource<Evento>();
      this.dataSource.data = data.items || [];
    }
    console.log("item: ", data.item);
    this.visible = false;
    if (this.data.edit) this.visible = data.item.visibile;
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  ngOnInit() {
    if (!this.data.item) {
      this.data.item = new Evento(); // Assicurati che l'data.item non sia undefined
    }
    // Inizializza la variabile time se l'data.item esiste
    if (this.data.item.data) {
      const date = new Date(this.data.item.data); // Converti in Date per sicurezza
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      this.time = `${hours}:${minutes}`;
    } else {
      // Se data non è definito, inizializzalo con un valore predefinito
      this.data.item.data = new Date();
      this.time = '00:00'; // Orario predefinito
    }
  }

  save() {
    if (
      this.data.item.descrizione == undefined ||
      this.data.item.descrizione == null ||
      this.data.item.descrizione.trim() === ""
    ) {
      this.messageServ.showMessageError("Inserire la descrizione");
      return;
    }

    const [hours, minutes] = this.time.split(':').map(Number);

    // Assicurati che `this.data.item.data` sia un oggetto Date
    if (this.data.item.data) {
      // Converte in Date se non lo è già
      this.data.item.data = this.data.item.data instanceof Date
        ? this.data.item.data
        : new Date(this.data.item.data);

      // Imposta ore e minuti
      this.data.item.data.setHours(hours);
      this.data.item.data.setMinutes(minutes);
    }

    // Aggiorna la proprietà visibile
    this.data.item.visibile = this.visible;

    // Chiudi il dialog e restituisci l'oggetto aggiornato
    this.dialogRef.close(this.data.item);
  }


  async updateEvento(evento: Evento) {
    const dialogRef = this.dialog.open(DialogEventComponent, {
      data: {
        item: { ...evento }, // Passa una copia per evitare modifiche dirette
        create: true,
        edit: true,
      },
    });

    if (!dialogRef) return;

    dialogRef.afterClosed().subscribe(async (result) => {
      if (!result) {
        console.log('Dialog chiusa senza salvare o dati non validi.');
        return; // Uscire subito se il dialog è stato chiuso senza salvare
      }

      try {
        // Verifica e normalizzazione dei dati
        const resultData = result.data instanceof Date ? result.data : new Date(result.data);
        if (isNaN(resultData.getTime())) {
          return; // Se la data è invalida, usciamo
        }

        const eventoData = evento.data instanceof Date ? evento.data : new Date(evento.data);

        // Controlla se ci sono modifiche nei campi dell'evento
        const isModified =
          result.descrizione?.trim() !== evento.descrizione ||
          resultData.getTime() !== eventoData.getTime() ||
          result.visibile !== evento.visibile;

        if (isModified) {
          const index = this.data.items.indexOf(evento);

          if (index !== -1) {
            // Aggiorna l'evento nella lista locale
            this.data.items[index] = { ...result, data: resultData };

            // Ordina e aggiorna la tabella
            this.dataSource.data = this.data.items.sort(
              (a, b) => new Date(a.data).getTime() - new Date(b.data).getTime()
            );
            this.dataSource.paginator = this.paginator;

            // Effettua l'aggiornamento remoto
            const response = await this.eventServ.updateEvento(result);
            console.log('Evento aggiornato con successo:', response);
            this.messageServ.showMessage('Evento aggiornato con successo');
          }
        }
      } catch (error) {
        console.error("Errore durante l'aggiornamento dell'evento:", error);
        this.messageServ.showMessage('Errore durante l\'aggiornamento dell\'evento');
      } 
    });

    // Aggiorna la lista degli eventi dal server
    await this.refreshEventList(evento);
  }

  /**
   * Aggiorna la lista degli eventi.
   * @param evento Evento di riferimento per il giorno/tipo.
   */
  private async refreshEventList(evento: Evento) {
    try {
      const items: Evento[] = this.data.tipo
        ? await this.eventServ.getEventsByDayType(moment(evento.data), this.data.tipo, this.data.user)
        : await this.eventServ.getEventsByDay(moment(evento.data), this.data.user);

      this.dataSource.data = items.sort(
        (a, b) => new Date(a.data).getTime() - new Date(b.data).getTime()
      );
      this.dataSource.paginator = this.paginator;
    } catch (error) {
      console.error("Errore durante l'aggiornamento della lista degli eventi:", error);
    }
  }





  async deleteEvento(evento: Evento) {
    const dialogData = {
      data: { message: "Vuoi eliminare l'evento " + evento.descrizione + "?" }
    };

    const result = await this.dialog.open(DialogQuestionComponent, dialogData).afterClosed().toPromise();

    if (!result) {
      this.messageServ.showMessageError(`Eliminazione annullata`);
      return;
    }

    try {
      const index = this.data.items.indexOf(evento);
      if (index > -1) {
        this.data.items.splice(index, 1);
        this.dataSource.data = this.data.items;
        this.dataSource.paginator = this.paginator;

        const response = await this.eventServ.deleteEvento(evento).then();
      }
    }
    catch (error) {
      console.error(`Errore durante la cancellazione: ${error}`);
      this.messageServ.showMessageError(`Errore durante l'Eliminazione': ${error}`);
    }
  }

  public inputSearchField;
  cleanSearchField() {
    this.dataSource.filter = undefined;
    this.inputSearchField = undefined;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
