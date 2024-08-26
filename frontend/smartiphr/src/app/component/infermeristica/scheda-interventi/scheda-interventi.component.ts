import { Component, Input, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { DialogInterventiComponent } from "src/app/dialogs/dialog-interventi/dialog-interventi.component";
import { SchedaInterventi } from "src/app/models/SchedaInterventi";

@Component({
  selector: "app-scheda-interventi",
  templateUrl: "./scheda-interventi.component.html",
  styleUrls: ["./scheda-interventi.component.css"],
})
export class SchedaInterventiComponent implements OnInit, AfterViewInit {
  @Input() data: SchedaInterventi[];
  @Input() data2: SchedaInterventi;
  @Input() disable: boolean;

  displayedColumns: string[] = [
    "data",
    "diagnosi",
    "obiettivi",
    "intervento",
    "valutazione",
    "firma",
    "action",
  ];

  dataSource: MatTableDataSource<SchedaInterventi>;
  @ViewChild("paginatorSchedaInverventi", { static: false }) paginator: MatPaginator;

  constructor(public dialog: MatDialog) {
    this.dataSource = new MatTableDataSource<SchedaInterventi>();
  }

  ngOnInit() {
    console.log("SchedaInterventi: ", this.data);
    this.dataSource.data = this.data;
  }

  ngAfterViewInit() {
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
          this.data.push(result);
          this.dataSource.data = this.data;
          this.dataSource.paginator = this.paginator;
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
        if (result != undefined && result) {
          const data = this.data;

          const index = data.indexOf(schedaIntervento, 0);
          if (index > -1) {
            data.splice(index, 1);
            console.log("Removed item");
          }

          data.push(result);
          this.dataSource.data = this.data;
          this.dataSource.paginator = this.paginator;
        }
      });
  }
}
