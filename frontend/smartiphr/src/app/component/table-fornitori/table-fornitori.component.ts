import { Component, Input, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Output, EventEmitter } from "@angular/core";
import { MatDialog } from "@angular/material";
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
  @Input() buttons: DinamicButton[];
  @Input() insertFunction: any;
  @Input() showInsert: boolean;
  @Input() eventFornitori: Observable<Fornitore[]>;

  private eventsSubscription: Subscription;

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

  async show(fornitore: Fornitore) {
    console.log("Show scheda fornitore:", fornitore);
    var dialogRef = this.dialog.open(DialogFornitoreComponent, {
      data: { fornitore: fornitore, readonly: false },
      width: "1024px",
    });
  }

  async deleteFornitore(fornitore: Fornitore) {
    console.log("Cancella fornitore:", fornitore);

    this.dialog
      .open(DialogQuestionComponent, {
        data: { message: "Cancellare il fornitore?" },
        //width: "600px",
      })
      .afterClosed()
      .subscribe((result) => {
        if (result == true) {
          this.fornitoreService
            .delete(fornitore)
            .then((x) => {
              console.log("Fornitore cancellato");
              const index = this.fornitore.indexOf(fornitore);
              console.log("Fornitore cancellato index: ", index);
              if (index > -1) {
                this.fornitore.splice(index, 1);
              }
              this.dataSource.data = this.fornitore;
              //this.dataSource.paginator = this.paginator;
            })
            .catch((err) => {
              this.messageService.showMessageError("Errore nella cancellazione Fornitore");
        console.error(err);
            });
        } else {
          console.log("Cancellazione fornitore annullata");
          this.messageService.showMessageError("Cancellazione fornitore Annullata");
        }
      });
  }

}
