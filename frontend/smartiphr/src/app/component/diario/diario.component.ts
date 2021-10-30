import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatDialog, MatPaginator, MatTableDataSource } from "@angular/material";
import { DialogDiarioComponent } from "src/app/dialogs/dialog-diario/dialog-diario.component";
import { Diario } from "src/app/models/diario";
import { SchedaDiario } from "src/app/models/SchedaDiario";

export interface DiarioPisicologico {
  data: Date;
  valore: string;
  firma: string;
}

@Component({
  selector: "app-diario",
  templateUrl: "./diario.component.html",
  styleUrls: ["./diario.component.css"],
})
export class DiarioPisicoComponent implements OnInit, AfterViewInit {
  @Input() data: SchedaDiario;
  @Input() disable: boolean;

  displayedColumns: string[] = ["data", "valore", "firma", "action"];
  dataSource: MatTableDataSource<Diario>;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  constructor(public dialog: MatDialog) {}

  ngOnInit() {
    this.dataSource = new MatTableDataSource<Diario>(this.data.diario);
    this.dataSource.paginator = this.paginator;
  }

  ngAfterViewInit() {}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  newItem() {
    console.log("New Item (diario)");
    this.dialog
      .open(DialogDiarioComponent, {
        data: new Diario(),
      })
      .afterClosed()
      .subscribe((result) => {
        if (result != undefined && result) {
          console.log("result:", result);
          this.data.diario.push(result);
          this.dataSource.data = this.data.diario;
        }
      });
  }

  editItem(diario: Diario) {
    console.log("Edit item (diario)");
    this.dialog
      .open(DialogDiarioComponent, {
        data: Diario.clone(diario),
      })
      .afterClosed()
      .subscribe((result) => {
        console.log("result:", result);
        if (result != undefined && result) {
          const data = this.data.diario;

          const index = data.indexOf(diario, 0);
          if (index > -1) {
            data.splice(index, 1);
            console.log("Removed item");
          }

          data.push(result);
          this.dataSource.data = this.data.diario;
        }
      });
  }
}
