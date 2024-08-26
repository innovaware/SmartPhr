import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { Output, EventEmitter } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Observable, Subject, Subscription } from 'rxjs';
import { DialogMessageErrorComponent } from 'src/app/dialogs/dialog-message-error/dialog-message-error.component';
import { DialogDipendenteComponent } from "src/app/dialogs/dialog-dipendente/dialog-dipendente.component";
import { DialogQuestionComponent } from "src/app/dialogs/dialog-question/dialog-question.component";
import { Dipendenti } from "src/app/models/dipendenti";
import { DipendentiService } from "src/app/service/dipendenti.service";
import { MessagesService } from 'src/app/service/messages.service';
import { User } from "src/app/models/user";
import { UsersService } from "src/app/service/users.service";
import { DinamicButton } from "../../models/dinamicButton";

@Component({
  selector: 'app-table-dipendenti',
  templateUrl: './table-dipendenti.component.html',
  styleUrls: ['./table-dipendenti.component.css']
})
export class TableDipendentiComponent implements OnInit {


  @Output() showItemEmiter = new EventEmitter<{
    dipendente: Dipendenti;
    button: DinamicButton;
  }>();

  @Input() buttons: string[];
  @Input() showInsert: boolean;
  @Input() CustomButtons: DinamicButton[];
  @Input() insertFunction: any;

  @Input() eventDipendente: Observable<Dipendenti[]>;
  @Input() showDipendente: any;
  @Input() enableShow: boolean;
  @Input() enableDeleting: boolean;
  @Input() enableCustomButton: boolean;


  inputSearchField: string;
  private eventsSubscription: Subscription;

  displayedColumns: string[] = [
    "cognome",
    "nome",
    "cf",
    "dataNascita",
    "indirizzo",
    "localita",
    "provincia",
    "action",
  ];


  dataSource: MatTableDataSource<Dipendenti>;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  public dipendenti: Dipendenti[];

  constructor(
    public dialog: MatDialog,
    public messageService: MessagesService,
    public dipendentiService: DipendentiService,
    public usersService: UsersService,
  ) {
    this.dipendentiService.get().then((result) => {
      this.dipendenti = result;

      this.dataSource = new MatTableDataSource<Dipendenti>(this.dipendenti);
      this.dataSource.paginator = this.paginator;
    });

}

  @Output() deletePatientEmiter = new EventEmitter<Dipendenti>();


  deleteDipendente(row: Dipendenti) {

    if (this.deletePatientEmiter !== undefined) {
      this.deletePatientEmiter.emit(row);
    }
  //const index = i;
  //console.log("Dipendente da cancellare index: ", index);
  //if (window.confirm("Sei sicuro di voler eliminare questo dipendente?")) {
  //  this.dipendentiService
  //  .remove(row)
  //  .then((x) => {
  //    console.log("Dipendente cancellato");
      
      
  //      if (index > -1) {
  //        this.dipendenti.splice(index, 1);
  //      }

  //      this.dataSource.data = this.dipendenti;
  //  })
  //  .catch((err) => {
  //    this.messageService.showMessageError(
  //      "Errore nella cancellazione Dipendente"
  //    );
  //    console.error(err);
  //  });
  //}
}

ngOnInit() {
  this.eventsSubscription = this.eventDipendente.subscribe((p: Dipendenti[]) => {
    this.dataSource = new MatTableDataSource<Dipendenti>(p);
    this.dataSource.paginator = this.paginator;
  });
}

ngOnDestroy() {
  if (this.eventsSubscription != undefined) {
    this.eventsSubscription.unsubscribe();
  }
}

  ngAfterViewInit()
  {
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  

  eventsSubject: Subject<Dipendenti[]> = new Subject<Dipendenti[]>();

  insert() {
    console.log("Insert");
    let dipendente: Dipendenti = {
      cognome: "",
      nome: "",
      cf: "",
      indirizzoNascita: "",
      comuneNascita: "",
      provinciaNascita: "",
      dataNascita: undefined,
      indirizzoResidenza: "",
      comuneResidenza: "",
      //luogoResidenza: "",
      sesso:"",
      provinciaResidenza: "",
      titoloStudio: "",
      mansione: "",
      contratto: "",
      email: "",
      telefono: "",
      DataCreazione: undefined,
      DataEliminazione: undefined,
      DataUltimaModifica: undefined,
      cancellato: false,
      user: "",
      group: "",
      accettatoRegolamento: false
    };

    const dialogRef = this.dialog.open(DialogDipendenteComponent, {
      data: { dipendente: dipendente, readonly: false, newItem: true },
    });

    dialogRef.afterClosed().subscribe((result) => {
      
      this.dipendentiService.get().then((resulta) => {
        this.dipendenti = resulta;
        this.dataSource = new MatTableDataSource<Dipendenti>(this.dipendenti);
        this.dataSource.paginator = this.paginator;
      });

      //if (dialogRef != undefined)
      //  dialogRef.afterClosed().subscribe((result) => {
      //    console.log("The dialog was closed");
      //    if (result != undefined) {
      //      this.dipendenti.push(result);
      //      this.dataSource.data = this.dipendenti;
      //      console.log("Inserito consulente", result);
      //    }
      //  });
      //else {
      //  this.dipendentiService.get().then((paz: Dipendenti[]) => {
      //    this.dipendenti = paz;
      //    this.eventsSubject.next(this.dipendenti);
      //  });
      //}
    });

  }

  async show(dipendente: Dipendenti) {

    console.log("Show scheda dipendente:", dipendente);
    var dialogRef = this.dialog.open(DialogDipendenteComponent, {
      data: { dipendente: dipendente, readonly: false },
      width: "1024px",
    });
  }


  //async deleteDipendente(dipendente: Dipendenti) {
  //  console.log("Cancella dipendente:", dipendente);

  //  this.dialog
  //    .open(DialogQuestionComponent, {
  //      data: { message: "Cancellare il dipendente?" },
  //      //width: "600px",
  //    })
  //    .afterClosed()
  //    .subscribe((result) => {
  //      if (result == true) {
  //        this.dipendentiService
  //          .remove(dipendente)
  //          .then(() => {
  //            console.log("Eliminazione eseguita con successo", result);
  //            const index = this.dipendenti.indexOf(dipendente);
  //            if (index > -1) {
  //              this.dipendenti.splice(index, 1);
  //            }
  //            this.dataSource.data = this.dipendenti;
  //            //this.dataSource.paginator = this.paginator;
  //          }),
  //          (err) => {
  //            console.error("Errore nell'eliminazione", err);
  //          };
  //      } else {
  //        console.log("Cancellazione dipendente annullata");
  //        this.messageService.showMessageError("Cancellazione dipendente Annullata");
  //      }
  //    });
  //}

  cleanSearchField() {
    this.dataSource.filter = undefined;
    this.inputSearchField = undefined;
  }
}
