import { AfterViewInit, Component, Input, OnChanges, OnInit, ViewChild } from "@angular/core";
import { PazienteService } from "src/app/service/paziente.service";
import { SchedaTerapeuticaService } from "../../service/schedaTerapeutica.service";
import { ItemsArray, SchedaTerapeutica } from "../../models/schedaTerapeutica";
import { Paziente } from "../../models/paziente";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { DataSource } from "@angular/cdk/collections";
import { MatDialog } from '@angular/material/dialog';
import { DialogSchedaTerapeuticaComponent } from "../../dialogs/dialog-schedaTerapeutica/dialog-schedaTerapeutica.component";


@Component({
  selector: "app-scheda-terapeutica",
  templateUrl: "./scheda-terapeutica.component.html",
  styleUrls: ["./scheda-terapeutica.component.css"],
})

export class SchedaTerapeuticaComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() id: string; //Id paziente
  @Input() inLettura: boolean;

  currentDate: moment.Moment;
  maxDate: string;
  disable: boolean = true;
  paziente: Paziente;
  DisplayedColumns: string[] = ["dataInizio", "terapiaOrale", "fasceOrarie", "dataFine", "note", "action"];
  public dataSourceOrale: MatTableDataSource<ItemsArray>;
  public dataSourceIMEVSC: MatTableDataSource<ItemsArray>;
  public dataSourceEstemporanea: MatTableDataSource<ItemsArray>;
  public orali: ItemsArray[];
  public IMEVSC: ItemsArray[];
  public Estemporanea: ItemsArray[];
  private scheda: SchedaTerapeutica;
  @ViewChild("paginatorOrale", { static: false }) paginatorO: MatPaginator;
  @ViewChild("paginatorImevsc", { static: false }) paginatorI: MatPaginator;
  @ViewChild("paginatorEstemporanea", { static: false }) paginatorE: MatPaginator;
  constructor(
    public dialog: MatDialog,
    public pazienteService: PazienteService,
    private schedaServ: SchedaTerapeuticaService
  ) {
    this.scheda = new SchedaTerapeutica();
    this.paziente = new Paziente();
    this.dataSourceOrale = new MatTableDataSource<ItemsArray>();
    this.dataSourceIMEVSC = new MatTableDataSource<ItemsArray>();
    this.dataSourceEstemporanea = new MatTableDataSource<ItemsArray>();
    this.orali = [];
    this.IMEVSC = [];
    this.Estemporanea = [];

    pazienteService.getPaziente(this.id).then((x: Paziente) => {
      this.paziente = x[0];
    });

    this.getDati();
  }

  ngOnInit() {

    this.dataSourceOrale = new MatTableDataSource<ItemsArray>();
    this.dataSourceIMEVSC = new MatTableDataSource<ItemsArray>();
    this.dataSourceEstemporanea = new MatTableDataSource<ItemsArray>();
    this.orali = [];
    this.IMEVSC = [];
    this.Estemporanea = [];
    this.getDati();
  }

  ngOnChanges() {
    this.dataSourceOrale = new MatTableDataSource<ItemsArray>();
    this.dataSourceIMEVSC = new MatTableDataSource<ItemsArray>();
    this.dataSourceEstemporanea = new MatTableDataSource<ItemsArray>();
    this.orali = [];
    this.IMEVSC = [];
    this.Estemporanea = [];
    this.getDati();
  }

  ngAfterViewInit() {
    this.dataSourceOrale = new MatTableDataSource<ItemsArray>();
    this.dataSourceIMEVSC = new MatTableDataSource<ItemsArray>();
    this.dataSourceEstemporanea = new MatTableDataSource<ItemsArray>();
    this.orali = [];
    this.IMEVSC = [];
    this.Estemporanea = [];
    this.getDati();
  }

  add(type: string) {
    const dialogRef = this.dialog.open(DialogSchedaTerapeuticaComponent, {
      data: {
        scheda: this.scheda,
        paziente: this.paziente,
        id: this.id,
        type: type,
        edit: false
      },
      width: "800px",
      height: "550px"
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getDati();
    });
  }

  edit(row: ItemsArray, type: String) {
    const dialogRef = this.dialog.open(DialogSchedaTerapeuticaComponent, {
      data: {
        scheda: this.scheda,
        paziente: this.paziente,
        type: type,
        id: this.id,
        edit: true,
        item: row
      },
      width: "800px",
      height: "550px"
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getDati();
    });
  }

  async getDati() {
    this.dataSourceOrale = new MatTableDataSource<ItemsArray>();
    this.scheda = await this.schedaServ.getByPaziente(this.id);
    console.log(this.scheda);
    this.orali = this.scheda.Orale;
    this.dataSourceOrale.data = this.orali;
    this.dataSourceOrale.paginator = this.paginatorO;

    this.IMEVSC = this.scheda.IMEVSC;
    this.dataSourceIMEVSC.data = this.IMEVSC;
    this.dataSourceIMEVSC.paginator = this.paginatorI;

    this.Estemporanea = this.scheda.Estemporanea;
    this.dataSourceEstemporanea.data = this.Estemporanea;
    this.dataSourceEstemporanea.paginator = this.paginatorE;
  }

}
