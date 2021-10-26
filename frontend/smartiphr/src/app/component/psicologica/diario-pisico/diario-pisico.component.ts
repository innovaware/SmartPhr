import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatDialog, MatPaginator, MatTableDataSource } from "@angular/material";
import { DialogDiarioComponent } from "src/app/dialogs/dialog-diario/dialog-diario.component";
import { CartellaClinica } from "src/app/models/cartellaClinica";
import { Diario } from "src/app/models/diario";
import { Paziente } from "src/app/models/paziente";

export interface DiarioPisicologico {
  data: Date;
  valore: string;
  firma: string;
}

@Component({
  selector: "app-diario-pisico",
  templateUrl: "./diario-pisico.component.html",
  styleUrls: ["./diario-pisico.component.css"],
})
export class DiarioPisicoComponent implements OnInit, AfterViewInit {
  @Input() paziente: Paziente;
  @Input() disable: boolean;

  diario: Diario[];

  displayedColumns: string[] = ["data", "valore", "firma", "action"];
  dataSource: MatTableDataSource<Diario>;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  constructor(public dialog: MatDialog) {}

  ngOnInit() {
    /*if (this.paziente.cartellaClinica != undefined) {
      this.diario = this.paziente.cartellaClinica.sort(
        (a: CartellaClinica, b: CartellaClinica) => {
          return a.data.getTime() - b.data.getTime();
        }
      )[0].schedaPisico.diario;
    } else {
      this.diario = [];
    }*/

    console.log("Diario", this.diario);
    this.dataSource = new MatTableDataSource<Diario>(this.diario);
    this.dataSource.paginator = this.paginator;
  }

  ngAfterViewInit() {}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  showDiario() {
    console.log("show diario");
    const dialogRef = this.dialog.open(DialogDiarioComponent, {
      data: { data: new Date(), firma: "", valore: "" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("result:", result);
      this.diario.push(result);
      this.dataSource.data = this.diario;
    });
  }

  edit(diario: Diario) {
    console.log("edit diario");
    const dialogRef = this.dialog.open(DialogDiarioComponent, {
      data: diario,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("result:", result);
      //this.data.schedaPisico.diario.push(result);
      this.dataSource.data = this.diario;
    });
  }
}
