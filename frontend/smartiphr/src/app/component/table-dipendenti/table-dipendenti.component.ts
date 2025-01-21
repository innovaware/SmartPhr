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
import { AuthenticationService } from "../../service/authentication.service";

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
    private AuthServ: AuthenticationService,
  ) {
    this.dipendentiService.get().then((result) => {
      if (this.AuthServ.getCurrentUser().role == "66aa1532b6f9db707c1c2010") 
      this.dipendenti = result;
      else
        this.dipendenti = result.filter(x => x.mansione != "66aa1532b6f9db707c1c2010");
      this.dataSource = new MatTableDataSource<Dipendenti>(this.dipendenti);
      this.dataSource.paginator = this.paginator;
    });

}

  @Output() deletePatientEmiter = new EventEmitter<Dipendenti>();


  deleteDipendente(row: Dipendenti) {

    if (this.deletePatientEmiter !== undefined) {
      this.deletePatientEmiter.emit(row);
    }
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
      sesso: "",
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
      width: '95%',
      maxWidth: '800px',
      height: 'auto',
      maxHeight: '90vh',
      panelClass: ['large-dialog', 'scrollable-dialog'],
      disableClose: false,
      autoFocus: true
    });
    dialogRef.backdropClick().subscribe(() => {
      dialogRef.close();  // This ensures the dialog closes on backdrop click
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.dipendentiService.get().then((resulta) => {
        if (this.AuthServ.getCurrentUser().role == "66aa1532b6f9db707c1c2010")
          this.dipendenti = resulta;
        else
          this.dipendenti = resulta.filter(x => x.mansione != "66aa1532b6f9db707c1c2010");
        this.dataSource = new MatTableDataSource<Dipendenti>(this.dipendenti);
        this.dataSource.paginator = this.paginator;
      });
    });
  }

  async show(dipendente: Dipendenti) {
    console.log("Show scheda dipendente:", dipendente);
    var dialogRef = this.dialog.open(DialogDipendenteComponent, {
      data: { dipendente: dipendente, readonly: false },
      width: '95%',
      maxWidth: '800px',
      height: 'auto',
      maxHeight: '90vh',
      panelClass: ['large-dialog', 'scrollable-dialog'],
      disableClose: false,
      autoFocus: true
    });
    dialogRef.backdropClick().subscribe(() => {
      dialogRef.close();  // This ensures the dialog closes on backdrop click
    });
  }


  cleanSearchField() {
    this.dataSource.filter = undefined;
    this.inputSearchField = undefined;
  }
}
