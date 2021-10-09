import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog, MatPaginator, MatTableDataSource } from "@angular/material";
import { DialogFornitoriComponent } from 'src/app/dialogs/dialog-fornitori/dialog-fornitori.component';
import { Fornitori } from "src/app/models/fornitori";
import { FornitoriService } from "src/app/service/fornitori.service";

@Component({
  selector: "app-fornitori",
  templateUrl: "./fornitori.component.html",
  styleUrls: ["./fornitori.component.css"],
})
export class FornitoriComponent implements OnInit {
  displayedColumns: string[] = ["cognome", "nome", "email", "user", "action"];
  dataSource: MatTableDataSource<Fornitori>;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  data: Fornitori[];

  constructor(
    public dialog: MatDialog,
    public fornitoriService: FornitoriService
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.fornitoriService.getFornitori().then((result) => {
      this.data = result;

      this.dataSource = new MatTableDataSource<Fornitori>(this.data);
      this.dataSource.paginator = this.paginator;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  async insert() {
    var fornitore: Fornitori = {
      cognome: "",
      nome: "",
      email: "",
      codiceFiscale: "",
      dataNascita: new Date(),
      luogoNascita: "",
      comuneNascita: "",
      provinciaNascita: "",
      indirizzoNascita: "",
      indirizzoResidenza: "",
      comuneResidenza: "",
      provinciaResidenza: "",
      mansione: "",
      tipoContratto: "",
      telefono: "",
    };

    var dialogRef = this.dialog.open(DialogFornitoriComponent, {
      data: { fornitore: fornitore, readonly: false },
    });

    if (dialogRef != undefined)
      dialogRef.afterClosed().subscribe((result) => {
        console.log("The dialog was closed", result);
        if (result != undefined) {
          this.fornitoriService.insert(result.fornitore).then((r: Fornitori) => {
            this.data.push(r);
            this.dataSource.data = this.data;
          });
        }
      });
  }

  async show(fornitore: Fornitori) {
    console.log("Show scheda fornitore:", fornitore);
    var dialogRef = this.dialog.open(DialogFornitoriComponent, {
      data: { fornitore: fornitore, readonly: false },
    });

    if (dialogRef != undefined)
      dialogRef.afterClosed().subscribe((result) => {
        if (result != undefined) {
          console.debug("Update fornitore: ", result.fornitore);
          this.fornitoriService.save(result.fornitore).then(r=>{
            console.log("Modifica eseguita con successo");
          }).catch(err=> {
            console.error("Errore aggiornamento fornitore", err);
          })
        }
      });
  }
}
