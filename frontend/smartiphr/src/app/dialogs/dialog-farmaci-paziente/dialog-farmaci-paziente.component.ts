import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { DialogFarmacoComponent } from "src/app/dialogs/dialog-farmaco/dialog-farmaco.component";
import { Farmaci } from "src/app/models/farmaci";
import { Paziente } from "src/app/models/paziente";
import { AuthenticationService } from "src/app/service/authentication.service";
import { DipendentiService } from "src/app/service/dipendenti.service";
import { GestFarmaciService } from "src/app/service/gest-farmaci.service";
import { MessagesService } from "src/app/service/messages.service";
import { DialogFarmacoPazienteComponent } from "../dialog-farmaco-paziente/dialog-farmaco-paziente.component";
@Component({
  selector: 'app-dialog-farmaci-paziente',
  templateUrl: './dialog-farmaci-paziente.component.html',
  styleUrls: ['./dialog-farmaci-paziente.component.css']
})
export class DialogFarmaciPazienteComponent implements OnInit {

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
  allFarmaci: Farmaci[];

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  constructor(
    public dialog: MatDialog,
    public farmaciService: GestFarmaciService,
    public dipendenteService: DipendentiService,
    public authenticationService: AuthenticationService,
    public messageService: MessagesService,
    @Inject(MAT_DIALOG_DATA) public data: { paziente: Paziente  }
  ) {}

  ngOnInit() {
    this.loadFarmaci();
  }


  loadFarmaci(){
    this.farmaciService.getFarmaci().then((result) => {
      this.allFarmaci = result;
    });


    this.farmaciService.getFarmaciByPaziente(this.data.paziente._id).then((result) => {
      this.farmaci = result;

      this.dataSource = new MatTableDataSource<Farmaci>(this.farmaci);
      this.dataSource.paginator = this.paginator;
    });
  }

  ngAfterViewInit() {
    this.loadFarmaci();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  async newItem() {
    var dialogRef = undefined;

    dialogRef = this.dialog.open(DialogFarmacoPazienteComponent, {
      data: { row: new Farmaci(),  title: 'Assegna Farmaco' },
    });

    if (dialogRef != undefined)
      dialogRef.afterClosed().subscribe((result) => {
        console.log("The dialog was closed");

        if (result != undefined && result) {

          console.log("result: " + JSON.stringify(result));
          var farmaco = this.allFarmaci.filter(x => x._id === result._id);
          console.log("farmaco: " + JSON.stringify(farmaco));

          result.nome = farmaco[0].nome;
          result.descrizione = farmaco[0].descrizione;
          result.formato = farmaco[0].formato;
          result.dose = farmaco[0].dose;
          result.codice_interno = farmaco[0].codice_interno;
          result.classe = farmaco[0].classe;
          result.scadenza = farmaco[0].scadenza;
          result.formulazione = farmaco[0].formulazione;
          result.paziente = this.data.paziente._id;
          result.pazienteName = this.data.paziente.nome + ' ' +  this.data.paziente.cognome;


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
    dialogRef = this.dialog.open(DialogFarmacoPazienteComponent, {
      data: { row: Farmaci.clone(item),  title: 'Modifica Farmaco Assegnato' },
    });

    if (dialogRef != undefined)
      dialogRef.afterClosed().subscribe((result) => {
        console.log("The dialog was closed");
        if (result != undefined && result) {
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
