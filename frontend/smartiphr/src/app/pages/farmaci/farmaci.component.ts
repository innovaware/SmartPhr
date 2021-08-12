import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog, MatPaginator, MatTableDataSource } from "@angular/material";
import { DialogFarmacoComponent } from "src/app/dialogs/dialog-farmaco/dialog-farmaco.component";
import { Farmaci } from "src/app/models/farmaci";
import { FarmaciService } from "src/app/service/farmaci.service";

@Component({
  selector: "app-farmaci",
  templateUrl: "./farmaci.component.html",
  styleUrls: ["./farmaci.component.css"],
})
export class FarmaciComponent implements OnInit {
  displayedColumns: string[] = [
    "nome",
    "descrizione",
    "formato",
    "dose",
    "qty",
    "codice_interno",
    "action",
  ];
  dataSource: MatTableDataSource<Farmaci>;
  farmaci: Farmaci[];

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  constructor(
    public dialog: MatDialog,
    public farmaciService: FarmaciService
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

  async newFarmaco() {
    var dialogRef = undefined;
    var farmaco: Farmaci = {
      descrizione: "",
      codice_interno: "",
      dose: "",
      formato: "",
      nome: "",
      qty: 1,
    };
    dialogRef = this.dialog.open(DialogFarmacoComponent, {
      data: farmaco,
    });

    if (dialogRef != undefined)
      dialogRef.afterClosed().subscribe((result) => {
        console.log("The dialog was closed");

        if (result != undefined) {
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

  async show(item: Farmaci) {
    var dialogRef = undefined;
    dialogRef = this.dialog.open(DialogFarmacoComponent, {
      data: item,
    });

    if (dialogRef != undefined)
      dialogRef.afterClosed().subscribe((result) => {
        console.log("The dialog was closed");
        if (result != undefined) {
          this.farmaciService
            .update(result)
            .then((r) => {
              console.log("Update Completed. Result: ", r);
            })
            .catch((err) => {
              console.error("Error update farmaco: ", err);
            });
        }
      });
  }
}
