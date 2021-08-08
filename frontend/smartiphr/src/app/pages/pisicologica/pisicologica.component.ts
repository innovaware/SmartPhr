import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { DialogPisicologicaComponent } from "src/app/dialogs/dialog-pisicologica/dialog-pisicologica.component";
import { Diario } from 'src/app/models/diario';
import { Paziente } from "src/app/models/paziente";

@Component({
  selector: "app-pisicologica",
  templateUrl: "./pisicologica.component.html",
  styleUrls: ["./pisicologica.component.css"],
})
export class PisicologicaComponent implements OnInit {

  constructor(public dialog: MatDialog) {
  }

  ngOnInit() {
  }


  show(paziente: Paziente) {
    const dialogRef = this.dialog.open(DialogPisicologicaComponent, {
      data: paziente
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed");
      //  this.animal = result;
    });
  }
}


