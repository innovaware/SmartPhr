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
import { CartellaClinica } from "src/app/models/cartellaClinica";
import { DialogMessageErrorComponent } from "src/app/dialogs/dialog-message-error/dialog-message-error.component";
import { CartellaclinicaService } from "src/app/service/cartellaclinica.service";

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
  @Output() deletePatientEmiter = new EventEmitter<Paziente>();

  @Input() buttons: DinamicButton[];
  @Input() CustomButtons: DinamicButton[];

  @Input() insertFunction: any;
  @Input() showPatient: any;
  //@Input() deletePatient: any;

  @Input() eventPazienti: Observable<Paziente[]>;

  @Input() showInsert: boolean;
  @Input() enableDeleting: boolean;
  @Input() enableShow: boolean;
  @Input() enableCustomButton: boolean;


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
    public pazienteService: PazienteService,
    public cartellaclinicaService: CartellaclinicaService,
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
    if (this.eventsSubscription != undefined) {
      this.eventsSubscription.unsubscribe();
    }
  }

  ngAfterViewInit() {}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  async deletePatient(paziente: Paziente) {
    console.log("Delete patient:", paziente);

    if (this.deletePatientEmiter !== undefined) {
      this.deletePatientEmiter.emit(paziente);
    }
  }

}
