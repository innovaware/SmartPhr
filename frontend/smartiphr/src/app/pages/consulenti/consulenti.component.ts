import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog, MatPaginator, MatTableDataSource } from "@angular/material";
import { Consulenti } from "src/app/models/consulenti";
import { ConsulentiService } from "src/app/service/consulenti.service";

@Component({
  selector: "app-consulenti",
  templateUrl: "./consulenti.component.html",
  styleUrls: ["./consulenti.component.css"],
})
export class ConsulentiComponent implements OnInit {
  displayedColumns: string[] = ["cognome", "nome", "email", "user", "action"];
  dataSource: MatTableDataSource<Consulenti>;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  constructor(
    public dialog: MatDialog,
    public utentiService: ConsulentiService
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.utentiService.getConsulenti().then((result) => {
      let utenti: Consulenti[] = result;

      this.dataSource = new MatTableDataSource<Consulenti>(utenti);
      this.dataSource.paginator = this.paginator;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
