import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog, MatPaginator, MatTableDataSource } from "@angular/material";
import { Farmaci } from "src/app/models/farmaci";
import { FarmaciService } from "src/app/service/farmaci.service";

@Component({
  selector: "app-farmaci",
  templateUrl: "./farmaci.component.html",
  styleUrls: ["./farmaci.component.css"],
})
export class FarmaciComponent implements OnInit {
  displayedColumns: string[] = [
    "nome",
    "descrizione",
    "formato",
    "dose",
    "qty",
    "codice_interno",
    "action",
  ];
  dataSource: MatTableDataSource<Farmaci>;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  constructor(
    public dialog: MatDialog,
    public farmaciService: FarmaciService
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.farmaciService.getFarmaci().then((result) => {
      let utenti: Farmaci[] = result;

      this.dataSource = new MatTableDataSource<Farmaci>(utenti);
      this.dataSource.paginator = this.paginator;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
