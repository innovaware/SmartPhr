import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { DialogFarmacoComponent } from "src/app/dialogs/dialog-farmaco/dialog-farmaco.component";
import { Dipendenti } from "src/app/models/dipendenti";
import { Farmaci } from "src/app/models/farmaci";
import { AuthenticationService } from "src/app/service/authentication.service";
import { DipendentiService } from "src/app/service/dipendenti.service";
import { GestFarmaciService } from "src/app/service/gest-farmaci.service";
import { MessagesService } from "src/app/service/messages.service";

@Component({
  selector: 'app-gest-farmaci',
  templateUrl: './gest-farmaci.component.html',
  styleUrls: ['./gest-farmaci.component.css']
})
export class GestFarmaciComponent implements OnInit {

  displayedColumns: string[] = [
    "nome",
    "descrizione",
    "formulazione",
    "formato",
    "lotto",
    "scadenza",
    "classe",
    "action",
  ];
  dataSource: MatTableDataSource<Farmaci>;
  farmaci: Farmaci[];

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  dipendente: Dipendenti = {} as Dipendenti;
  constructor(
    public dialog: MatDialog,
    public farmaciService: GestFarmaciService,
    public dipendenteService: DipendentiService,
    public authenticationService: AuthenticationService,
    public messageService: MessagesService,
  ) {}

  ngOnInit(): void {
    this.loadUser();
  }

  ngAfterViewInit() {
    this.farmaciService.getFarmaci().then((result) => {
      this.farmaci = result;

      this.dataSource = new MatTableDataSource<Farmaci>(this.farmaci);
      this.dataSource.paginator = this.paginator;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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



  async newItem() {
    var dialogRef = undefined;

    dialogRef = this.dialog.open(DialogFarmacoComponent, {
      data: { row: new Farmaci(),  title: 'Nuovo Farmaco' },
    });

    
    if (dialogRef != undefined)
      dialogRef.afterClosed().subscribe((result) => {
        console.log("The dialog was closed");

        if (result != undefined && result) {
          result.operator = this.dipendente._id;
          result.operatorName = this.dipendente.nome + ' ' + this.dipendente.cognome;
          
          this.farmaciService
            .insert(result)
            .then((r) => {
              console.log("Update Completed. Result: ", r);
              this.farmaci.push(result);
              this.dataSource.data = this.farmaci;
            })
            .catch((err) => {
              console.error("Error update farmaco: ", err);
            });
        }
      });
  }

  async editItem(item: Farmaci) {
    var dialogRef = undefined;
    dialogRef = this.dialog.open(DialogFarmacoComponent, {
      data: { row: Farmaci.clone(item),  title: 'Modifica Farmaco' },
    });

    if (dialogRef != undefined)
      dialogRef.afterClosed().subscribe((result) => {
        console.log("The dialog was closed");
        if (result != undefined && result) {
          result.operator = this.dipendente._id;
          result.operatorName = this.dipendente.nome + ' ' + this.dipendente.cognome;


          this.farmaciService
            .update(result)
            .then((r) => {
              console.log("Update Completed. Result: ", r);

              const index = this.farmaci.indexOf(item, 0);
              if (index > -1) {
                this.farmaci.splice(index, 1);
                console.log("Removed item");
              }

              this.farmaci.push(result);
              this.dataSource.data = this.farmaci;
            })
            .catch((err) => {
              console.error("Error update farmaco: ", err);
            });
        }
      });
  }

}
