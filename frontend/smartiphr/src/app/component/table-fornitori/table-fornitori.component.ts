import { Component, Input, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Output, EventEmitter } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Observable, Subscription } from 'rxjs';
import { DialogFornitoreComponent } from "src/app/dialogs/dialog-fornitore/dialog-fornitore.component";
import { DialogQuestionComponent } from "src/app/dialogs/dialog-question/dialog-question.component";
import { DinamicButton } from "src/app/models/dinamicButton";
import { Fornitore } from "src/app/models/fornitore";
import { FornitoreService } from "src/app/service/fornitore.service";
import { MessagesService } from 'src/app/service/messages.service';

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
  @Output() deleteFornitoreEmiter = new EventEmitter<Fornitore>();
  @Input() buttons: DinamicButton[];
  @Input() CustomButtons: DinamicButton[];
  @Input() insertFunction: any;
  @Input() showInsert: boolean;
  @Input() showAdmin: any;
  @Input() eventFornitori: Observable<Fornitore[]>;
  @Input() enableDeleting: boolean;
  @Input() enableShow: boolean;
  @Input() enableCustomButton: boolean;


  private eventsSubscription: Subscription;
  inputSearchField: string;

  displayedColumns: string[] = [
    "cognome",
    "nome",
    "codiceFiscale",
    "dataNascita",
    "indirizzo",
    "localita",
    "provincia",
    "action",
  ];
  dataSource: MatTableDataSource<Fornitore>;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  public fornitore: Fornitore[];

  constructor(
    public dialog: MatDialog,
    public messageService: MessagesService,
    public fornitoreService: FornitoreService
    ) {
      this.fornitore = [];
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
    console.log("Table Fornitori emit ");

    this.showItemEmiter.emit({ fornitore: fornitore, button: item });
  }

  //async show(fornitore: Fornitore) {
  //  console.log("Show scheda fornitore:", fornitore);
  //  var dialogRef = this.dialog.open(DialogFornitoreComponent, {
  //    data: { fornitore: fornitore, readonly: false },
  //    width: "1024px",
  //  });
  //}

  async deleteAdmin(data: Fornitore) {
    console.log("Cancella fornitore:", data);
    if (this.deleteFornitoreEmiter !== undefined) {
      this.deleteFornitoreEmiter.emit(data);
    }
  }



  cleanSearchField() {
    this.dataSource.filter = undefined;
    this.inputSearchField = undefined;
  }
}
