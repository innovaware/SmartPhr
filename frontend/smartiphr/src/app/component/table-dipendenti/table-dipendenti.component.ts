import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { Output, EventEmitter } from "@angular/core";
import { MatDialog } from "@angular/material";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Observable, Subscription } from 'rxjs';
import { DialogMessageErrorComponent } from 'src/app/dialogs/dialog-message-error/dialog-message-error.component';
import { DialogDipendenteComponent } from "src/app/dialogs/dialog-dipendente/dialog-dipendente.component";
import { DialogQuestionComponent } from "src/app/dialogs/dialog-question/dialog-question.component";
import { Dipendenti } from "src/app/models/dipendenti";
import { DipendentiService } from "src/app/service/dipendenti.service";
import { MessagesService } from 'src/app/service/messages.service';
import { User } from "src/app/models/user";
import { UsersService } from "src/app/service/users.service";

@Component({
  selector: 'app-table-dipendenti',
  templateUrl: './table-dipendenti.component.html',
  styleUrls: ['./table-dipendenti.component.css']
})
export class TableDipendentiComponent implements OnInit {


  @Output() showItemEmiter = new EventEmitter<{
    dipendente: Dipendenti;
    button: string;
  }>();

  @Input() buttons: string[];
  @Input() showInsert: boolean;

  @Input() eventDipendente: Observable<Dipendenti[]>;
  @Input() showDipendente: any;
  @Input() enableShow: boolean;
  @Input() enableDeleting: boolean;

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




delete(row: Dipendenti,i){
  const index = i;
  console.log("Dipendente da cancellare index: ", index);
  if (window.confirm("Sei sicuro di voler eliminare questo dipendente?")) {
    this.dipendentiService
    .remove(row)
    .then((x) => {
      console.log("Dipendente cancellato");
      
      
        if (index > -1) {
          this.dipendenti.splice(index, 1);
        }

        this.dataSource.data = this.dipendenti;
    })
    .catch((err) => {
      this.messageService.showMessageError(
        "Errore nella cancellazione Dipendente"
      );
      console.error(err);
    });
  }
}

ngOnInit() {
  this.eventsSubscription = this.eventDipendente.subscribe((p: Dipendenti[]) => {
    this.dataSource = new MatTableDataSource<Dipendenti>(p);
    this.dataSource.paginator = this.paginator;
  });
}

ngOnDestroy() {
  this.eventsSubscription.unsubscribe();
}

  ngAfterViewInit() { }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  call(dipendente: Dipendenti, item: string) {
    this.showItemEmiter.emit({ dipendente: dipendente, button: item });


  }



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
      provinciaResidenza: "",
      titoloStudio: "",
      mansione: "",
      contratto: "",
      email: "",
      telefono: "",

      user: "",
      group: "",
      accettatoRegolamento: false
    };

    const dialogRef = this.dialog.open(DialogDipendenteComponent, {
      data: { dipendente: dipendente, readonly: true, newItem: true },
    });



    dialogRef.afterClosed().subscribe((result) => {
      console.log("result insert dipendente", result);
      if (result !== false && result !== undefined) {
        this.dipendentiService
          .insert(result)
          .then((x) => {

             //CREAZIONE UTENTE SUCCESSIVA ALLA CREAZIONE DIPENDENDETE

         /* var newUser : User = { 
            role:result.mansione,
            active : false
         }; 

         console.log("Save newUser: " + JSON.stringify(newUser));
              this.usersService
              .insert(newUser)
              .then((y) => {
                console.log("Save User: ", y);
              })
              .catch((err) => {
                this.messageService.showMessageError(
                  "Errore Inserimento dipendente (" + err["status"] + ")"
                );
              });*/

              
            let data = this.dataSource.data;
            data.push(result);
            this.dataSource.data = data;
          })
          .catch((err) => {
            this.messageService.showMessageError("Errore Inserimento Dipendente (" + err['status'] + ")");
          });
      }
    });
  }

  async show(dipendente: Dipendenti) {

    console.log("Show scheda dipendente:", dipendente);
    var dialogRef = this.dialog.open(DialogDipendenteComponent, {
      data: { dipendente: dipendente, readonly: false },
      width: "1024px",
    });
  }


  async deleteDipendente(dipendente: Dipendenti) {
    console.log("Cancella dipendente:", dipendente);

    this.dialog
      .open(DialogQuestionComponent, {
        data: { message: "Cancellare il dipendente?" },
        //width: "600px",
      })
      .afterClosed()
      .subscribe((result) => {
        if (result == true) {
          this.dipendentiService
            .remove(dipendente)
            .then(() => {
              console.log("Eliminazione eseguita con successo", result);
              const index = this.dipendenti.indexOf(dipendente);
              if (index > -1) {
                this.dipendenti.splice(index, 1);
              }
              this.dataSource.data = this.dipendenti;
              //this.dataSource.paginator = this.paginator;
            }),
            (err) => {
              console.error("Errore nell'eliminazione", err);
            };
        } else {
          console.log("Cancellazione dipendente annullata");
          this.messageService.showMessageError("Cancellazione dipendente Annullata");
        }
      });
  }


}
