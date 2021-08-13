import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog, MatPaginator, MatTableDataSource } from "@angular/material";
import { DialogConsulenteComponent } from 'src/app/dialogs/dialog-consulente/dialog-consulente.component';
import { Consulenti } from "src/app/models/consulenti";
import { ConsulentiService } from "src/app/service/consulenti.service";

@Component({
  selector: "app-consulenti",
  templateUrl: "./consulenti.component.html",
  styleUrls: ["./consulenti.component.css"],
})
export class ConsulentiComponent implements OnInit {
  displayedColumns: string[] = ["cognome", "nome", "email", "user", "action"];
  dataSource: MatTableDataSource<Consulenti>;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  data: Consulenti[];

  constructor(
    public dialog: MatDialog,
    public consulentiService: ConsulentiService
  ) {
    this.data = [];
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.consulentiService.getConsulenti().then((result) => {
      let consulenti: Consulenti[] = result;

      this.dataSource = new MatTableDataSource<Consulenti>(consulenti);
      this.dataSource.paginator = this.paginator;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  async insert() {
    var consulente: Consulenti = {
      cognome: "",
      nome: "",
      email: "",
      group: "",
      user: "",
    };

    var dialogRef = this.dialog.open(DialogConsulenteComponent, {
      data: { consulente: consulente, readonly: false },
    });

    if (dialogRef != undefined)
      dialogRef.afterClosed().subscribe((result) => {
        console.log("The dialog was closed");
        if (result != undefined) {
          this.consulentiService.insertConsulenti(result.consulente).then((r: Consulenti) => {
            this.data.push(r);
            this.dataSource.data = this.data;
          });
        }
      });
  }

  async show(consulente: Consulenti) {
    console.log("Show scheda consulente:", consulente);
    var dialogRef = this.dialog.open(DialogConsulenteComponent, {
      data: { consulente: consulente, readonly: false },
    });

    if (dialogRef != undefined)
      dialogRef.afterClosed().subscribe((result) => {
        if (result != undefined) {
          console.debug("Update consulente: ", result.consulente);
          this.consulentiService.updateConsulenti(result.consulente).then(r=>{
            console.log("Modifica eseguita con successo");
          }).catch(err=> {
            console.error("Errore aggiornamento consulente", err);
          })
        }
      });
  }
}
