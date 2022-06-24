import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { DialogFarmacoComponent } from "src/app/dialogs/dialog-farmaco/dialog-farmaco.component";
import { AttivitaFarmaciPresidi } from "src/app/models/attivitaFarmaciPresidi";
import { AttivitafarmacipresidiService } from "src/app/service/attivitafarmacipresidi.service";

@Component({
  selector: 'app-attivita-farmaci',
  templateUrl: './attivita-farmaci.component.html',
  styleUrls: ['./attivita-farmaci.component.css']
})
export class AttivitaFarmaciComponent implements OnInit {

  displayedColumns: string[] = [
    "nome",
    "qty",
    "data",
    "operator"
  ];
  dataSource: MatTableDataSource<AttivitaFarmaciPresidi>;
  dataSourcePresidi: MatTableDataSource<AttivitaFarmaciPresidi>;
  attivita: AttivitaFarmaciPresidi[];
  attivitaPresidi: AttivitaFarmaciPresidi[];

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatPaginator, {static: false}) paginatorPresidi: MatPaginator;

  constructor(
    public dialog: MatDialog,
    public service: AttivitafarmacipresidiService
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.service.getAllAttivitaFarmaci().then((result) => {
      this.attivita = result;

      this.dataSource = new MatTableDataSource<AttivitaFarmaciPresidi>(this.attivita);
      this.dataSource.paginator = this.paginator;
    });


    this.service.getAllAttivitaPresidi().then((result) => {
      this.attivitaPresidi = result;

      this.dataSourcePresidi = new MatTableDataSource<AttivitaFarmaciPresidi>(this.attivitaPresidi);
      this.dataSourcePresidi.paginator = this.paginatorPresidi;
    });



  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  applyFilterPresidi(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourcePresidi.filter = filterValue.trim().toLowerCase();
  }


}
