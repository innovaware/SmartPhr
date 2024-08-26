import { AfterViewInit, Component, Input, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { DialogRiabilitazioneLesioneComponent } from "src/app/dialogs/dialog-riabilitazione-lesione/dialog-riabilitazione-lesione.component";
import { AreaRiabilitativa } from "src/app/models/AreaRiabilitativa";
import { AreaRiabilitativaLesioni } from "src/app/models/AreaRiabilitativaLesioni";
import { TestRiabilitativo } from "../../models/testRiabilitativo";
import { Paziente } from "../../models/paziente";
import { TestRiabilitativoService } from "../../service/testRiabilitativo.service";
import { DialogTestRiabilitativoComponent } from "../../dialogs/dialog-test/dialog-test.component";

@Component({
  selector: "app-area-riabilitativa",
  templateUrl: "./area-riabilitativa.component.html",
  styleUrls: ["./area-riabilitativa.component.css"],
})
export class AreaRiabilitativaComponent implements OnInit, AfterViewInit {
  @Input() data: AreaRiabilitativa;
  @Input() disable: boolean;
  @Input() paziente: Paziente;
  pazienteId: String;
  displayTestColumns: string[] = ["Data", "FIM", "Tinetti", "Barthel","action"];
  dataSourceTest: MatTableDataSource<TestRiabilitativo>;
  @ViewChild("TestPaginator", { static: false }) testPaginator: MatPaginator;
  testRiabilitativi: TestRiabilitativo[];


  displayedColumns: string[] = [
    "datalesioneEvento",
    "tipogia",
    "parteCorpo",
    "action",
  ];

  dataSourceAnamnesiRiabilitativa: MatTableDataSource<AreaRiabilitativaLesioni>;

  @ViewChild("paginatorLesioni", {static: false}) paginator: MatPaginator;
  public ariaRiabilitativaLesioni: AreaRiabilitativaLesioni[];

  constructor(public dialog: MatDialog,
    public testService: TestRiabilitativoService
  ) {
    this.testRiabilitativi = [];
    this.dataSourceTest = new MatTableDataSource<TestRiabilitativo>();
  }

  ngOnInit() {
    this.ariaRiabilitativaLesioni = this.data.lesioni;
    this.dataSourceAnamnesiRiabilitativa = new MatTableDataSource<AreaRiabilitativaLesioni>(
      this.ariaRiabilitativaLesioni
    );
    this.dataSourceAnamnesiRiabilitativa.paginator = this.paginator;
    
    if (this.data == undefined) {
      this.data = new AreaRiabilitativa();
    }
    this.testRiabilitativi = [];
    this.dataSourceTest = new MatTableDataSource<TestRiabilitativo>();
    this.pazienteId = this.paziente._id;
    this.getTest();
  }

  ngAfterViewInit() {
    this.dataSourceAnamnesiRiabilitativa.paginator = this.paginator;
  }

  addNewLesione() {
    this.dialog
      .open(DialogRiabilitazioneLesioneComponent, {
        data: new AreaRiabilitativaLesioni(),
      })
      .afterClosed()
      .subscribe((result) => {
        if (result != undefined && result) {
          this.ariaRiabilitativaLesioni.push(result);
          this.dataSourceAnamnesiRiabilitativa.data = this.ariaRiabilitativaLesioni;
          this.dataSourceAnamnesiRiabilitativa.paginator = this.paginator;
          this.data.lesioni = this.ariaRiabilitativaLesioni;
        }
      });
  }

  getTest() {
    this.testService.getTestRiabilitativiByPaziente(this.pazienteId).subscribe((res) => {
      this.testRiabilitativi = res;
      this.dataSourceTest.data = res;
      this.dataSourceTest.paginator = this.testPaginator;
    });
  }

  addTest() {
    const dialogRef = this.dialog.open(DialogTestRiabilitativoComponent, {
      data: {
        pazienteId: this.pazienteId
      },
      width: "512px",
      height: "382px"
    }).afterClosed().subscribe((result) => {
      this.getTest();
    });;
  }
}

