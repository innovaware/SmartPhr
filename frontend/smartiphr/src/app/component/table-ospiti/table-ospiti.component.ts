import { Component, Input, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Output, EventEmitter } from "@angular/core";
import { MatDialog } from "@angular/material";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Observable, Subscription } from 'rxjs';
import { DialogMessageErrorComponent } from "src/app/dialogs/dialog-message-error/dialog-message-error.component";
import { DialogPazienteComponent } from "src/app/dialogs/dialog-paziente/dialog-paziente.component";
import { DinamicButton } from "src/app/models/dinamicButton";
import { Paziente } from "src/app/models/paziente";
import { PazienteService } from "src/app/service/paziente.service";

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

  constructor() {
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

}
