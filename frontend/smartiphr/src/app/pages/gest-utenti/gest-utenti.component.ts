import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog, MatPaginator, MatTableDataSource } from "@angular/material";
import { DialogDipendenteComponent } from "src/app/dialogs/dialog-dipendente/dialog-dipendente.component";
import { Dipendenti } from "src/app/models/dipendenti";
import { DipendentiService } from "src/app/service/dipendenti.service";

@Component({
  selector: "app-gest-utenti",
  templateUrl: "./gest-utenti.component.html",
  styleUrls: ["./gest-utenti.component.css"],
})
export class GestUtentiComponent implements OnInit {
  displayedColumns: string[] = ["cognome", "nome", "email", "user", "action"];
  dataSource: MatTableDataSource<Dipendenti>;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  data: Dipendenti[];

  constructor(
    public dialog: MatDialog,
    public utentiService: DipendentiService
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.utentiService.getDipendenti().then((result) => {
      this.data = result;

      this.dataSource = new MatTableDataSource<Dipendenti>(this.data);
      this.dataSource.paginator = this.paginator;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  async insert() {
    var dipendente: Dipendenti = {
      cognome: "",
      nome: "",
      email: "",
      cf: "",
      indirizzoNascita: "",
      luogoNascita: "",
      provinciaNascita: "",
      dataNascita: null,
      indirizzoResidenza: "",
      luogoResidenza: "",
      provinciaResidenza: "",
      titoloStudio: "",
      mansione: "",
      contratto: "",
      telefono: "",
      group: "",
      user: "",
    };

    var dialogRef = this.dialog.open(DialogDipendenteComponent, {
      data: { dipendente: dipendente, readonly: false },
    });

    if (dialogRef != undefined)
      dialogRef.afterClosed().subscribe((result) => {
        console.log("The dialog was closed");
        if (result != undefined) {
          this.utentiService.insertDipendente(result.dipendente).then((r: Dipendenti) => {
            this.data.push(r);
            this.dataSource.data = this.data;
          });
        }
      });
  }

  async show(dipendente: Dipendenti) {
    console.log("Show scheda dipendente:", dipendente);
    var dialogRef = this.dialog.open(DialogDipendenteComponent, {
      data: { dipendente: dipendente, readonly: false },
    });

    if (dialogRef != undefined)
      dialogRef.afterClosed().subscribe((result) => {
        if (result != undefined) {
          console.debug("Update dipendente: ", result.dipendente);
          this.utentiService.updateDipendete(result.dipendente).then(r=>{
            console.log("Modifica eseguita con successo");
          }).catch(err=> {
            console.error("Errore aggiornamento dipendente", err);
          })
        }
      });
  }
}
