import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog, MatPaginator, MatTableDataSource } from "@angular/material";
import { DialogConsulenteComponent } from "src/app/dialogs/dialog-consulente/dialog-consulente.component";
import { DialogQuestionComponent } from "src/app/dialogs/dialog-question/dialog-question.component";
import { Consulenti } from "src/app/models/consulenti";
import { ConsulentiService } from "src/app/service/consulenti.service";
import { MessagesService } from 'src/app/service/messages.service';

@Component({
  selector: "app-consulenti",
  templateUrl: "./consulenti.component.html",
  styleUrls: ["./consulenti.component.css"],
})
export class ConsulentiComponent implements OnInit {
  displayedColumns: string[] = [
    "cognome",
    "nome",
    "codiceFiscale",
    "dataNascita",
    "indirizzoNascita",
    "comuneNascita",
    "provinciaNascita",
    "action",
  ];

  dataSource: MatTableDataSource<Consulenti>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  data: Consulenti[];

  constructor(
    public dialog: MatDialog,
    public messageService: MessagesService,
    public consulentiService: ConsulentiService
  ) {
    this.data = [];
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.consulentiService.getConsulenti().then((result) => {
      this.data = result;
      this.dataSource = new MatTableDataSource<Consulenti>(this.data);
      this.dataSource.paginator = this.paginator;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  async insert() {
    var consulente: Consulenti = new Consulenti();

    var dialogRef = this.dialog.open(DialogConsulenteComponent, {
      data: {
        consulente: consulente,
        isNew: true,
        readonly: false,
      },
    });

    if (dialogRef != undefined)
      dialogRef.afterClosed().subscribe((result) => {
        console.log("The dialog was closed");
        if (result != undefined) {
          this.data.push(result);
          this.dataSource.data = this.data;
          console.log("Inserito consulente", result);
        }
      });
  }

  async show(consulente: Consulenti) {
    console.log("Show scheda consulente:", consulente);
    var dialogRef = this.dialog.open(DialogConsulenteComponent, {
      data: { consulente: consulente, readonly: false },
      width: "1024px",
    });
  }

  async deleteConsulente(consulente: Consulenti) {
    console.log("Cancella consulente:", consulente);

    this.dialog
      .open(DialogQuestionComponent, {
        data: { message: "Cancellare il consulente?" },
        //width: "600px",
      })
      .afterClosed()
      .subscribe((result) => {
        if (result == true) {
          this.consulentiService
            .delete(consulente)
            .subscribe((result: Consulenti) => {
              console.log("Eliminazione eseguita con successo", result);
              const index = this.data.indexOf(consulente, 0);
              if (index > -1) {
                this.data.splice(index, 1);
              }
              this.dataSource = new MatTableDataSource<Consulenti>(this.data);
              this.dataSource.paginator = this.paginator;
            }),
            (err) => {
              console.error("Errore nell'eliminazione", err);
            };
        } else {
          console.log("Cancellazione consulente annullata");
          this.messageService.showMessageError("Cancellazione consulente Annullata");
        }
      });
  }
}
