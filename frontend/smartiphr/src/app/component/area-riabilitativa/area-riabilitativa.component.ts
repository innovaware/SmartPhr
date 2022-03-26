import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { MatDialog, MatPaginator, MatTableDataSource } from "@angular/material";
import { DialogRiabilitazioneLesioneComponent } from "src/app/dialogs/dialog-riabilitazione-lesione/dialog-riabilitazione-lesione.component";
import { AreaRiabilitativa } from "src/app/models/AreaRiabilitativa";
import { AreaRiabilitativaLesioni } from "src/app/models/AreaRiabilitativaLesioni";

@Component({
  selector: "app-area-riabilitativa",
  templateUrl: "./area-riabilitativa.component.html",
  styleUrls: ["./area-riabilitativa.component.css"],
})
export class AreaRiabilitativaComponent implements OnInit {
  @Input() data: AreaRiabilitativa;
  @Input() disable: boolean;

  displayedColumns: string[] = [
    "datalesioneEvento",
    "tipogia",
    "parteCorpo",
    "action",
  ];

  dataSourceAnamnesiRiabilitativa: MatTableDataSource<AreaRiabilitativaLesioni>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  public ariaRiabilitativaLesioni: AreaRiabilitativaLesioni[];

  constructor(public dialog: MatDialog) {

  }

  ngOnInit() {
    this.ariaRiabilitativaLesioni = this.data.lesioni;
    this.dataSourceAnamnesiRiabilitativa = new MatTableDataSource<AreaRiabilitativaLesioni>(
      this.ariaRiabilitativaLesioni
    );
    this.dataSourceAnamnesiRiabilitativa.paginator = this.paginator;

    console.log(this.data);

    if (this.data == undefined) {
      this.data = new AreaRiabilitativa();
    }
  }

  addNewLesione() {
    console.log("New Item lesione");
    this.dialog
      .open(DialogRiabilitazioneLesioneComponent, {
        data: new AreaRiabilitativaLesioni(),
      })
      .afterClosed()
      .subscribe((result) => {
        if (result != undefined && result) {
          console.log("result:", result);
          this.ariaRiabilitativaLesioni.push(result);
          this.dataSourceAnamnesiRiabilitativa.data = this.ariaRiabilitativaLesioni;
          this.dataSourceAnamnesiRiabilitativa.paginator = this.paginator;
          this.data.lesioni = this.ariaRiabilitativaLesioni;
        }
      });
  }
}
