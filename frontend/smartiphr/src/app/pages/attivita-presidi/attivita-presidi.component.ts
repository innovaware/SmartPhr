import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { DialogFarmacoComponent } from "src/app/dialogs/dialog-farmaco/dialog-farmaco.component";
import { AttivitaFarmaciPresidi } from "src/app/models/attivitaFarmaciPresidi";
import { AttivitafarmacipresidiService } from "src/app/service/attivitafarmacipresidi.service";

@Component({
  selector: 'app-attivita-presidi',
  templateUrl: './attivita-presidi.component.html',
  styleUrls: ['./attivita-presidi.component.css']
})
export class AttivitaPresidiComponent implements OnInit {

  displayedColumns: string[] = [
    "nome",
    "qty",
    "data",
    "operator"
  ];
  dataSource: MatTableDataSource<AttivitaFarmaciPresidi>;
  attvita: AttivitaFarmaciPresidi[];

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  constructor(
    public dialog: MatDialog,
    public service: AttivitafarmacipresidiService
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.service.getAllAttivitaPresidi().then((result) => {
      this.attvita = result;

      this.dataSource = new MatTableDataSource<AttivitaFarmaciPresidi>(this.attvita);
      this.dataSource.paginator = this.paginator;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
