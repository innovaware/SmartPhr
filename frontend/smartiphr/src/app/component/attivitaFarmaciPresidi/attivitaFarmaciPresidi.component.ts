import { Component, Input, OnChanges, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { AttivitafarmacipresidiService } from "../../service/attivitafarmacipresidi.service";
import { AttivitaFarmaciPresidi } from "../../models/attivitaFarmaciPresidi";
import { Paziente } from "../../models/paziente";

@Component({
  selector: "app-attivita-F-P",
  templateUrl: "./attivitaFarmaciPresidi.component.html",
  styleUrls: ["./attivitaFarmaciPresidi.component.css"],
})
export class AttivitaFarmPresComponent implements OnInit, OnChanges {
  @Input() type: String;
  @Input() paziente: Paziente;
  @Input() ospite: Boolean;
  DisplayedColumns: string[] = ["elemento", "elementotype" ,"operazione", "quantita", "date", "operatore", "ospite"];
  DisplayedColumnsN: string[] = ["elemento" ,"operazione", "quantita", "date", "operatore"];
  
  @ViewChild("paginatorAttivita", { static: false }) paginator: MatPaginator;
  public dataSource: MatTableDataSource<AttivitaFarmaciPresidi>;
  public attivita: AttivitaFarmaciPresidi[];
  public inputSearchField: String;
  constructor(
    private AFP: AttivitafarmacipresidiService
  )
  {
    this.attivita = [];
    this.dataSource = new MatTableDataSource<AttivitaFarmaciPresidi>();
    this.getAttivita();
  }

  ngOnChanges(changes) {

    this.getAttivita();
  }

  ngOnInit() {
    this.getAttivita();
  }


  getAttivita() {
    console.log(this.type,this.ospite);
    this.attivita = [];
    this.dataSource = new MatTableDataSource<AttivitaFarmaciPresidi>();
    switch (this.type) {
      case "ArmadioFarmaci":
        this.AFP.getAllAttivitaArmadiFP().then((result: AttivitaFarmaciPresidi[]) => {
          this.attivita = result.sort((a, b) => new Date(b.dataOP).getTime() - new Date(a.dataOP).getTime());
          this.dataSource.data = this.attivita;
          this.dataSource.paginator = this.paginator;
        });
        break;
      case "Farmaci":
        this.AFP.getAllAttivitaFarmaci().then((result: AttivitaFarmaciPresidi[]) => {
          this.attivita = result.sort((a, b) => new Date(b.dataOP).getTime() - new Date(a.dataOP).getTime());
          this.dataSource.data = this.attivita;
          this.dataSource.paginator = this.paginator;
        });
        break;
      case "Presidi":
        this.AFP.getAllAttivitaPresidi().then((result: AttivitaFarmaciPresidi[]) => {
          this.attivita = result.sort((a, b) => new Date(b.dataOP).getTime() - new Date(a.dataOP).getTime());
          this.dataSource.data = this.attivita;
          this.dataSource.paginator = this.paginator;
        });
        break;
      case "ArmadioFarmaciPaziente":
        this.AFP.getAttivitaArmadiFPByPaziente(this.paziente._id).then((result: AttivitaFarmaciPresidi[]) => {
          this.attivita = result.sort((a, b) => new Date(b.dataOP).getTime() - new Date(a.dataOP).getTime());
          this.dataSource.data = this.attivita;
          this.dataSource.paginator = this.paginator;
        });
        break;
    }
  }


  cleanSearchField() {
    this.dataSource.filter = undefined;
    this.inputSearchField = undefined;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
