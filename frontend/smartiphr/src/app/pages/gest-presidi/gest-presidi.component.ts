import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { DialogPresidioComponent } from "src/app/dialogs/dialog-presidio/dialog-presidio.component";
import { Dipendenti } from "src/app/models/dipendenti";
import { Presidi } from "src/app/models/presidi";
import { AuthenticationService } from "src/app/service/authentication.service";
import { DipendentiService } from "src/app/service/dipendenti.service";
import { GestPresidiService } from "src/app/service/gest-presidi.service";
import { MessagesService } from "src/app/service/messages.service";
@Component({
  selector: 'app-gest-presidi',
  templateUrl: './gest-presidi.component.html',
  styleUrls: ['./gest-presidi.component.css']
})
export class GestPresidiComponent implements OnInit {

  displayedColumns: string[] = [
    "nome",
    "descrizione",
    "qtyTot",
    "qty",
    "giacenza",
    "taglia",
    "action",
  ];
  dataSource: MatTableDataSource<Presidi>;
  presidi: Presidi[];

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  dipendente: Dipendenti = {} as Dipendenti;
  constructor(
    public dialog: MatDialog,
    public presidiService: GestPresidiService,
    public dipendenteService: DipendentiService,
    public authenticationService: AuthenticationService,
    public messageService: MessagesService,
  ) {}

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser() {
    this.authenticationService.getCurrentUserAsync().subscribe((user) => {
      console.log("get dipendente");
      this.dipendenteService
        .getByIdUser(user._id)
        .then((x) => {
          console.log("dipendente: " + JSON.stringify(x[0]));
          this.dipendente = x[0];

        })
        .catch((err) => {
          this.messageService.showMessageError(
            "Errore Caricamento dipendente (" + err["status"] + ")"
          );
        });
    });
  }



  ngAfterViewInit() {
    this.presidiService.getPresidi().then((result) => {
      this.presidi = result;

      this.dataSource = new MatTableDataSource<Presidi>(this.presidi);
      this.dataSource.paginator = this.paginator;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  async newItem() {
    var dialogRef = undefined;

    dialogRef = this.dialog.open(DialogPresidioComponent, {
      data: { row: new Presidi(),  title: 'Nuovo Presidio' },
    });

    if (dialogRef != undefined)
      dialogRef.afterClosed().subscribe((result) => {
        console.log("The dialog was closed");

        if (result != undefined && result) {

          result.operator = this.dipendente._id;
          result.operatorName = this.dipendente.nome + ' ' + this.dipendente.cognome;


          this.presidiService
            .insert(result)
            .then((r) => {
              console.log("Update Completed. Result: ", r);
              this.presidi.push(result);
              this.dataSource.data = this.presidi;
            })
            .catch((err) => {
              console.error("Error update farmaco: ", err);
            });
        }
      });
  }

  async editItem(item: Presidi) {
    var dialogRef = undefined;
    dialogRef = this.dialog.open(DialogPresidioComponent, {
      data: { row: Presidi.clone(item),  title: 'Modifica Presidio' },
    });

    if (dialogRef != undefined)
      dialogRef.afterClosed().subscribe((result) => {
        console.log("The dialog was closed");
        if (result != undefined && result) {

          result.operator = this.dipendente._id;
          result.operatorName = this.dipendente.nome + ' ' + this.dipendente.cognome;


          this.presidiService
            .update(result)
            .then((r) => {
              console.log("Update Completed. Result: ", r);

              const index = this.presidi.indexOf(item, 0);
              if (index > -1) {
                this.presidi.splice(index, 1);
                console.log("Removed item");
              }

              this.presidi.push(result);
              this.dataSource.data = this.presidi;
            })
            .catch((err) => {
              console.error("Error update farmaco: ", err);
            });
        }
      });
  }


}
