import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog, MatPaginator, MatTableDataSource } from "@angular/material";
import { DialogStanzaComponent } from "src/app/dialogs/dialog-stanza/dialog-stanza.component";
import { Stanza } from "src/app/models/stanza";
import { StanzeService } from "src/app/service/stanze.service";

@Component({
  selector: "app-gest-stanze",
  templateUrl: "./gest-stanze.component.html",
  styleUrls: ["./gest-stanze.component.css"],
})
export class GestStanzeComponent implements OnInit {
  displayedColumns: string[] = [
    "numero",
    "descrizione",
    "piano",
    "Sanif",
    "Letti",
    "Armadio",
    "Igiene",
    "action",
  ];
  dataSource: MatTableDataSource<Stanza>;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  constructor(public dialog: MatDialog, public stanzeService: StanzeService) {
    this.stanzeService.getStanze().then((result) => {
      let stanze: Stanza[] = result;

      this.dataSource = new MatTableDataSource<Stanza>(stanze);
    });
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  show(stanza: Stanza) {
    const dialogRef = this.dialog.open(DialogStanzaComponent, {
      data: stanza,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed");
      //  this.animal = result;
    });
  }

  insert() {
    console.log("Insert");
    const dialogRef = this.dialog.open(DialogStanzaComponent, {
      data: {
        numero: 1,
        descrizione: "",
        piano: 1,
        statusSanif: 0,
        statusLetti: 0,
        statusArmadio: 0,
        statusIgiene: 0,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== true) {
        let data = this.dataSource.data;
        data.push(result);
        this.dataSource.data = data;
      }
    });
  }
}
