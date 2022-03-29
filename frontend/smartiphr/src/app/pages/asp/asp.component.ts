import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog, MatPaginator, MatTableDataSource } from "@angular/material";
import { DialogAspComponent } from 'src/app/dialogs/dialog-asp/dialog-asp.component';
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
  data: Asp[];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public dialog: MatDialog, public aspService: AspService) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.aspService.getAsp().then((result) => {
      this.data = result;

      this.dataSource = new MatTableDataSource<Asp>(this.data);
      this.dataSource.paginator = this.paginator;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  async insert() {
    var asp: Asp = {
      cognome: "",
      nome: "",
      email: "",
      group: "",
      user: "",
    };

    var dialogRef = this.dialog.open(DialogAspComponent, {
      data: { asp: asp, readonly: false },
    });

    if (dialogRef != undefined)
      dialogRef.afterClosed().subscribe((result) => {
        console.log("The dialog was closed");
        if (result != undefined) {
          this.aspService.insertAsp(result.asp).then((r: Asp) => {
            this.data.push(r);
            this.dataSource.data = this.data;
          });
        }
      });
  }

  async show(asp: Asp) {
    console.log("Show scheda asp:", asp);
    var dialogRef = this.dialog.open(DialogAspComponent, {
      data: { asp: asp, readonly: false },
    });

    if (dialogRef != undefined)
      dialogRef.afterClosed().subscribe((result) => {
        if (result != undefined) {
          console.debug("Update asp: ", result.asp);
          this.aspService.updateAsp(result.asp).then(r=>{
            console.log("Modifica eseguita con successo");
          }).catch(err=> {
            console.error("Errore aggiornamento asp", err);
          })
        }
      });
  }
}
