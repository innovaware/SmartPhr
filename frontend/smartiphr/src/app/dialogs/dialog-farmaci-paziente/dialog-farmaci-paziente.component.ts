import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { DialogFarmacoComponent } from "src/app/dialogs/dialog-farmaco/dialog-farmaco.component";
import { Farmaci } from "src/app/models/farmaci";
import { GestFarmaciService } from "src/app/service/gest-farmaci.service";
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

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;


  constructor(
    public dialog: MatDialog,
    public farmaciService: GestFarmaciService
  ) {}

  ngOnInit() {}


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


  async newItem() {
    var dialogRef = undefined;

    dialogRef = this.dialog.open(DialogFarmacoPazienteComponent, {
      data: { row: new Farmaci(),  title: 'Assegna Farmaco' },
    });

    if (dialogRef != undefined)
      dialogRef.afterClosed().subscribe((result) => {
        console.log("The dialog was closed");

        if (result != undefined && result) {
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
