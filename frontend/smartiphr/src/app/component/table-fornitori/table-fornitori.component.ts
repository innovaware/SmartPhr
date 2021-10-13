import { Component, Input, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Output, EventEmitter } from "@angular/core";
import { MatDialog } from "@angular/material";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Observable, Subscription } from 'rxjs';
import { DialogMessageErrorComponent } from "src/app/dialogs/dialog-message-error/dialog-message-error.component";
import { DialogFornitoreComponent } from "src/app/dialogs/dialog-fornitore/dialog-fornitore.component";
import { DinamicButton } from "src/app/models/dinamicButton";
import { Fornitore } from "src/app/models/fornitore";
import { FornitoreService } from "src/app/service/fornitore.service";

@Component({
  selector: "app-table-fornitori",
  templateUrl: "./table-fornitori.component.html",
  styleUrls: ["./table-fornitori.component.css"],
})
export class TableFornitoriComponent implements OnInit, OnDestroy {
  @Output() showItemEmiter = new EventEmitter<{
    fornitore: Fornitore;
    button: DinamicButton;
  }>();
  @Input() buttons: DinamicButton[];
  @Input() insertFunction: any;
  @Input() showInsert: boolean;
  @Input() eventFornitori: Observable<Fornitore[]>;

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
  dataSource: MatTableDataSource<Fornitore>;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  constructor() {
  }

  ngOnInit() {
    this.eventsSubscription = this.eventFornitori.subscribe((p: Fornitore[]) => {
      this.dataSource = new MatTableDataSource<Fornitore>(p);
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

  call(fornitore: Fornitore, item: DinamicButton) {
    console.log("Table Ospiti emit ");

    this.showItemEmiter.emit({ fornitore: fornitore, button: item });
  }

}
