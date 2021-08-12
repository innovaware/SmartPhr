import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog, MatPaginator, MatTableDataSource } from "@angular/material";
import { Fornitori } from "src/app/models/fornitori";
import { FornitoriService } from "src/app/service/fornitori.service";

@Component({
  selector: "app-fornitori",
  templateUrl: "./fornitori.component.html",
  styleUrls: ["./fornitori.component.css"],
})
export class FornitoriComponent implements OnInit {
  displayedColumns: string[] = ["cognome", "nome", "email", "user", "action"];
  dataSource: MatTableDataSource<Fornitori>;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  constructor(
    public dialog: MatDialog,
    public fornitoriService: FornitoriService
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.fornitoriService.getFornitori().then((result) => {
      let utenti: Fornitori[] = result;

      this.dataSource = new MatTableDataSource<Fornitori>(utenti);
      this.dataSource.paginator = this.paginator;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
