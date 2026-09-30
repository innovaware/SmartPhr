import { AfterViewInit, Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Evento } from 'src/app/models/evento';
import { MessagesService } from '../../service/messages.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator/paginator';
import { DialogQuestionComponent } from '../dialog-question/dialog-question.component';
import { EventiService } from '../../service/eventi.service';
import { UserInfo } from '../../models/userInfo';

import * as moment from "moment";

@Component({
  selector: 'app-dialog-event',
  templateUrl: './dialog-event.component.html',
  styleUrls: ['./dialog-event.component.css']
})
export class DialogEventComponent implements OnInit, AfterViewInit {
  @Input() disable: boolean = false;
  @Input() isNew: boolean = true;
  time: string;
  visible: Boolean;

  minDate: Date = new Date(); // Data minima selezionabile (oggi)
  minTime: string | null = null; // Orario minimo dinamico

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
    this.data.items = this.data.items || [];
    if (!data.create) {
      this.dataSource = new MatTableDataSource<Evento>();
      this.dataSource.data = data.items || [];
    }
    this.visible = false;
    if (this.data.edit) this.visible = data.item.visibile;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    // Imposta le ore a 00:00:00 per consentire la selezione del giorno odierno nel datepicker
    this.minDate.setHours(0, 0, 0, 0);

    if (!this.data.item) {
      this.data.item = new Evento();
    }

    if (this.data.item.data) {
      const date = new Date(this.data.item.data);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      this.time = `${hours}:${minutes}`;
    } else {
      this.data.item.data = new Date();
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      this.time = `${hours}:${minutes}`;
    }

    // Calcola l'orario minimo iniziale
    this.updateMinTime();
  }

  /**
   * Aggiorna la variabile `minTime` in base alla data selezionata:
   * Se la data è oggi, limita l'orario minimo all'orario attuale.
   * Se la data è futura, non inserisce alcun limite.
   */
  updateMinTime() {
    if (this.data.edit) {
      this.minTime = null;
      return;
    }

    const selectedDate = this.data.item.data ? new Date(this.data.item.data) : new Date();
    const today = new Date();

    if (
      selectedDate.getFullYear() === today.getFullYear() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getDate() === today.getDate()
    ) {
      const hours = today.getHours().toString().padStart(2, '0');
      const minutes = today.getMinutes().toString().padStart(2, '0');
      this.minTime = `${hours}:${minutes}`;
    } else {
      this.minTime = null;
    }
  }

  onDateChange() {
    this.updateMinTime();
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

    if (!this.time) {
      this.messageServ.showMessageError("Inserire l'orario");
      return;
    }

    const [hours, minutes] = this.time.split(':').map(Number);

    if (this.data.item.data) {
      this.data.item.data = this.data.item.data instanceof Date
        ? this.data.item.data
        : new Date(this.data.item.data);

      this.data.item.data.setHours(hours);
      this.data.item.data.setMinutes(minutes);
    }

    // Controllo Blocco Data e Orario Passati
    if (!this.data.edit && this.data.item.data < new Date()) {
      this.messageServ.showMessageError("Non è possibile creare un evento in una data o orario passato.");
      return;
    }

    this.data.item.visibile = this.visible;
    this.dialogRef.close(this.data.item);
  }

  async updateEvento(evento: Evento) {
    const dialogRef = this.dialog.open(DialogEventComponent, {
      data: {
        item: { ...evento },
        create: true,
        edit: true,
      },
    });

    if (!dialogRef) return;

    dialogRef.afterClosed().subscribe(async (result) => {
      if (!result) return;

      try {
        const resultData = result.data instanceof Date ? result.data : new Date(result.data);
        if (isNaN(resultData.getTime())) return;

        const eventoData = evento.data instanceof Date ? evento.data : new Date(evento.data);

        const isModified =
          result.descrizione?.trim() !== evento.descrizione ||
          resultData.getTime() !== eventoData.getTime() ||
          result.visibile !== evento.visibile;

        if (isModified) {
          const index = this.data.items.indexOf(evento);

          if (index !== -1) {
            this.data.items[index] = { ...result, data: resultData };

            this.dataSource.data = this.data.items.sort(
              (a, b) => new Date(a.data).getTime() - new Date(b.data).getTime()
            );
            this.dataSource.paginator = this.paginator;

            const response = await this.eventServ.updateEvento(result);
            this.messageServ.showMessage('Evento aggiornato con successo');
          }
        }
      } catch (error) {
        console.error("Errore durante l'aggiornamento dell'evento:", error);
        this.messageServ.showMessage('Errore durante l\'aggiornamento dell\'evento');
      }
    });

    await this.refreshEventList(evento);
  }

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

        await this.eventServ.deleteEvento(evento);
      }
    }
    catch (error) {
      console.error(`Errore durante la cancellazione: ${error}`);
      this.messageServ.showMessageError(`Errore durante l'Eliminazione: ${error}`);
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
