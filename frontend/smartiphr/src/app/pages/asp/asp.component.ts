import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog, MatPaginator, MatTableDataSource } from "@angular/material";
import { Asp } from "src/app/models/asp";
import { AspService } from "src/app/service/asp.service";

@Component({
  selector: "app-asp",
  templateUrl: "./asp.component.html",
  styleUrls: ["./asp.component.css"],
})
export class AspComponent implements OnInit {
  displayedColumns: string[] = ["cognome", "nome", "email", "user", "action"];
  dataSource: MatTableDataSource<Asp>;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  constructor(public dialog: MatDialog, public aspService: AspService) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.aspService.getAsp().then((result) => {
      let asp: Asp[] = result;

      this.dataSource = new MatTableDataSource<Asp>(asp);
      this.dataSource.paginator = this.paginator;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
