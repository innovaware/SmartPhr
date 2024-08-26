import { Component, Input, OnChanges, OnInit, ViewChild } from "@angular/core";
import { Output, EventEmitter } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { DialogMessageErrorComponent } from "src/app/dialogs/dialog-message-error/dialog-message-error.component";
import { Dipendenti } from "src/app/models/dipendenti";
import { Presenze } from "src/app/models/presenze";
import { PresenzeService } from "src/app/service/presenze.service";
import { MessagesService } from "../../service/messages.service";
import { DipendentiService } from "../../service/dipendenti.service";

@Component({
  selector: "app-presenze",
  templateUrl: "./presenze.component.html",
  styleUrls: ["./presenze.component.css"],
})
export class PresenzeComponent implements OnInit, OnChanges {
  @Input() data: Dipendenti;
  @Input() dipendente: Dipendenti;
  @Input() disable: boolean;
  @Input() isExternal: boolean;

  @Output() showItemEmiter = new EventEmitter<{
    presenze: Presenze;
    button: string;
  }>();
  @Input() buttons: string[];
  @Input() showInsert: boolean;

  displayedColumns: string[] = [
    "data",
    "inizioturno",
    "fineturno",
    "tipoTurno",
    "note",
    "action",
  ];

  dataSource: MatTableDataSource<Presenze>;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  public presenze: Presenze[];
  public addingIngresso: boolean;
  public addingUscita: boolean;
  public newPresenza: Presenze;
  constructor(
    public messageService: MessagesService,
    public presenzeService: PresenzeService,
    public dipendenteService: DipendentiService
  ) {
    this.presenze = [];
    this.newPresenza = new Presenze();
  }
  dateDiffInDays(a, b) {
    var _MS_PER_ANNO = 1000 * 60 * 60 * 24;
    var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / _MS_PER_ANNO);
  }

  ngOnChanges(changes) {
    if (this.data && this.data._id) {
      this.presenzeService.getPresenzeByDipendenteID(this.data._id).then((result) => {
        this.presenze = result;
        this.presenze.sort((a, b) => {
          const dateA = new Date(a.data);
          const dateB = new Date(b.data);
          return dateB.getTime() - dateA.getTime();
        });
        this.dataSource = new MatTableDataSource<Presenze>(this.presenze);
        this.dataSource.paginator = this.paginator;
        if (this.presenze.length != 0) {
          this.newPresenza = this.presenze[0];
          if (this.newPresenza.oraFine == "" && this.dateDiffInDays(new Date(), new Date(this.newPresenza.data)) == 0) {
            this.addingIngresso = false;
            this.addingUscita = true;
          }
          else {
            this.addingIngresso = true;
            this.addingUscita = false;

          }
        }
        else {
          this.addingIngresso = true;
          this.addingUscita = false;
          
        }
      });
    }
    else {
      this.presenzeService.getPresenzeByDipendenteID(this.data._id).then((result) => {
        this.presenze = result;
        this.presenze.sort((a, b) => {
          const dateA = new Date(a.data);
          const dateB = new Date(b.data);
          return dateB.getTime() - dateA.getTime();
        });
        this.dataSource = new MatTableDataSource<Presenze>(this.presenze);
        this.dataSource.paginator = this.paginator;
        if (this.presenze.length != 0) {
          this.newPresenza = this.presenze[0];
          if (this.newPresenza.oraFine == "" && this.dateDiffInDays(new Date(), new Date(this.newPresenza.data)) == 0) {
            this.addingIngresso = false;
            this.addingUscita = true;
          }
          else {
            this.addingIngresso = true;
            this.addingUscita = false;
          }
        }
        else {
          this.addingIngresso = true;
          this.addingUscita = false;
        }
      });
    }
  }


  ngOnInit() {

    this.newPresenza = new Presenze();
  }

  addIngresso() {
    this.newPresenza = new Presenze();
    this.newPresenza.data = new Date();
    this.newPresenza.oraInizio =
      ((new Date()).getHours() < 10 ? "0" + (new Date()).getHours() : (new Date()).getHours()) + ":"
      + ((new Date()).getMinutes() < 10 ? "0" + (new Date()).getMinutes() : (new Date()).getMinutes())
      + ":" + ((new Date()).getSeconds() < 10 ? "0" + (new Date()).getSeconds() : (new Date()).getSeconds());
    if ((new Date()).getHours() >= 6 && (new Date()).getHours() < 14) {
      this.newPresenza.turno = "Mattina";
    }
    else {
      if ((new Date()).getHours() >= 14 && (new Date()).getHours() < 22) {
        this.newPresenza.turno = "Pomeriggio";
      }
      else {
        this.newPresenza.turno = "Notte";
      }
    }
    this.newPresenza.user = this.data._id;
    this.newPresenza.mansione = this.data.mansione;
    this.presenzeService
      .insertPresenza(this.newPresenza)
      .then((result: Presenze) => {
        this.presenze.push(result);
        this.presenze.sort((a, b) => {
          const dateA = new Date(a.data);
          const dateB = new Date(b.data);
          return dateB.getTime() - dateA.getTime();
        });
        this.dataSource.data = this.presenze;
        this.addingIngresso = false;
        this.addingUscita = true;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore Inserimento presenza");
        console.error(err);
      });
  }

  addUscita() {
    this.newPresenza = this.presenze[0];
    this.newPresenza.oraFine =
      ((new Date()).getHours() < 10 ? "0" + (new Date()).getHours() : (new Date()).getHours()) + ":"
      + ((new Date()).getMinutes() < 10 ? "0" + (new Date()).getMinutes() : (new Date()).getMinutes())
      + ":" + ((new Date()).getSeconds() < 10 ? "0" + (new Date()).getSeconds() : (new Date()).getSeconds());
    this.presenzeService
      .updatePresenza(this.newPresenza)
      .then((result: Presenze) => {
        const index = this.presenze.indexOf(this.newPresenza);
        this.presenze[index] = this.newPresenza;
        this.addingIngresso = true;
        this.addingUscita = false;
        this.presenze.sort((a, b) => {
          const dateA = new Date(a.data);
          const dateB = new Date(b.data);
          return dateB.getTime() - dateA.getTime();
        });
        this.dataSource.data = this.presenze;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore modifica stato Presenze");
        console.error(err);
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  async addNote(giorno: Presenze) {
    this.presenzeService
      .updatePresenza(giorno)
      .then((result: Presenze) => {
        const index = this.presenze.indexOf(giorno);
        this.presenze[index] = giorno;
        this.presenze.sort((a, b) => {
          const dateA = new Date(a.data);
          const dateB = new Date(b.data);
          return dateB.getTime() - dateA.getTime();
        });
        this.dataSource.data = this.presenze;
      })
      .catch((err) => {
        this.messageService.showMessageError("Errore modifica stato Presenze");
        console.error(err);
      });
  }

  call(presenze: Presenze, item: string) {
    this.showItemEmiter.emit({ presenze: presenze, button: item });
  }
}
