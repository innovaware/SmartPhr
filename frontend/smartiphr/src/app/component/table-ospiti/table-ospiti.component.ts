import { Component, Input, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Output, EventEmitter } from "@angular/core";
import { MatDialog } from "@angular/material";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Observable, Subscription } from 'rxjs';
import { DialogPazienteComponent } from "src/app/dialogs/dialog-paziente/dialog-paziente.component";
import { DialogQuestionComponent } from "src/app/dialogs/dialog-question/dialog-question.component";
import { DinamicButton } from "src/app/models/dinamicButton";
import { Paziente } from "src/app/models/paziente";
import { PazienteService } from "src/app/service/paziente.service";
import { MessagesService } from 'src/app/service/messages.service';

@Component({
  selector: "app-table-ospiti",
  templateUrl: "./table-ospiti.component.html",
  styleUrls: ["./table-ospiti.component.css"],
})
export class TableOspitiComponent implements OnInit, OnDestroy {
  @Output() showItemEmiter = new EventEmitter<{
    paziente: Paziente;
    button: DinamicButton;
  }>();
  @Input() buttons: DinamicButton[];
  @Input() insertFunction: any;
  @Input() showInsert: boolean;
  @Input() eventPazienti: Observable<Paziente[]>;

  private eventsSubscription: Subscription;

  displayedColumns: string[] = [
    "cognome",
    "nome",
    "dataNascita",
    "indirizzo",
    "localita",
    "provincia",
    "action",
  ];
  dataSource: MatTableDataSource<Paziente>;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  public data: Paziente[];

  constructor(
    public dialog: MatDialog,
    public messageService: MessagesService,
    public pazienteService: PazienteService
    ) {
      this.data = [];
    }

  ngOnInit() {
    this.eventsSubscription = this.eventPazienti.subscribe((p: Paziente[]) => {
      this.dataSource = new MatTableDataSource<Paziente>(p);
      this.dataSource.paginator = this.paginator;
    });
  }

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }

  ngAfterViewInit() {}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  call(paziente: Paziente, item: DinamicButton) {
    console.log("Table Ospiti emit ");

    this.showItemEmiter.emit({ paziente: paziente, button: item });
  }

  async show(paziente: Paziente) {
    console.log("Show scheda paziente:", paziente);
    var dialogRef = this.dialog.open(DialogPazienteComponent, {
      data: { paziente: paziente, readonly: false },
      width: "1024px",
    });
  }

  async deletePaziente(paziente: Paziente) {
    console.log("Cancella paziente:", paziente);

    this.dialog
      .open(DialogQuestionComponent, {
        data: { message: "Cancellare il paziente?" },
        //width: "600px",
      })
      .afterClosed()
      .subscribe((result) => {
        if (result == true) {
          this.pazienteService
            .delete(paziente)
            .then(() => {
              console.log("Eliminazione eseguita con successo", result);
              const index = this.data.indexOf(paziente);
              if (index > -1) {
                this.data.splice(index, 1);
              }
              this.dataSource.data = this.data;
              //this.dataSource.paginator = this.paginator;
            }),
            (err) => {
              console.error("Errore nell'eliminazione", err);
            };
        } else {
          console.log("Cancellazione paziente annullata");
          this.messageService.showMessageError("Cancellazione paziente Annullata");
        }
      });
  }

}
