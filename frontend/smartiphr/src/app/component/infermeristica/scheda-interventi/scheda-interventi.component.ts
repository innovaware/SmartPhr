import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { MatDialog, MatPaginator, MatTableDataSource } from "@angular/material";
import { DialogInterventiComponent } from "src/app/dialogs/dialog-interventi/dialog-interventi.component";
import { CartellaClinica } from "src/app/models/cartellaClinica";
import { Diario } from "src/app/models/diario";
import { Paziente } from "src/app/models/paziente";
import { SchedaInterventi } from "src/app/models/SchedaInterventi";

@Component({
  selector: "app-scheda-interventi",
  templateUrl: "./scheda-interventi.component.html",
  styleUrls: ["./scheda-interventi.component.css"],
})
export class SchedaInterventiComponent implements OnInit {
  @Input() data: SchedaInterventi[];
  @Input() data2: SchedaInterventi;
  @Input() disable: boolean;

  displayedColumns: string[] = [
    "data",
    "diagnosi",
    "obiettivi",
    "intervento",
    "firma",
    "action",
  ];

  dataSource: MatTableDataSource<SchedaInterventi>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public dialog: MatDialog) {}

  ngOnInit() {
    console.log("SchedaInterventi: ", this.data);
    this.dataSource = new MatTableDataSource<SchedaInterventi>(this.data);
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  newItem() {
    console.log("New Item (intervento)");
    this.dialog
      .open(DialogInterventiComponent, {
        data: new SchedaInterventi(),
      })
      .afterClosed()
      .subscribe((result) => {
        if (result != undefined && result) {
          console.log("result:", result);
          this.data.push(result);
          this.dataSource.data = this.data;
        }
      });
  }

  editItem(schedaIntervento: SchedaInterventi) {
    console.log("Edit Item (intervento)");
    this.dialog
      .open(DialogInterventiComponent, {
        data: SchedaInterventi.clone(schedaIntervento),
      })
      .afterClosed()
      .subscribe((result) => {
        console.log("result:", result);
        if (result != undefined && result) {
          const data = this.data;

          const index = data.indexOf(schedaIntervento, 0);
          if (index > -1) {
            data.splice(index, 1);
            console.log("Removed item");
          }

          data.push(result);
          this.dataSource.data = this.data;
        }
      });
  }
}
