import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatTableDataSource } from '@angular/material';
import { DialogDiarioComponent } from 'src/app/dialogs/dialog-diario/dialog-diario.component';
import { Diario } from 'src/app/models/diario';
import { Paziente } from 'src/app/models/paziente';


export interface DiarioPisicologico {
  data: Date;
  valore: string;
  firma: string;
}

@Component({
  selector: 'app-diario-pisico',
  templateUrl: './diario-pisico.component.html',
  styleUrls: ['./diario-pisico.component.css']
})
export class DiarioPisicoComponent implements OnInit, AfterViewInit {
  @Input() data: Paziente;

  displayedColumns: string[] = ['data', 'valore' ,'firma', 'action'];
  dataSource: MatTableDataSource<DiarioPisicologico>;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  constructor(
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<DiarioPisicologico>(this.data.schedaPisico.diario);

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  showDiario() {
    console.log("show diario");
    const dialogRef = this.dialog.open(DialogDiarioComponent, {
      data: { data: new Date(), firma: "", valore:""}
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("result:", result);
      this.data.schedaPisico.diario.push(result);
      this.dataSource.data = this.data.schedaPisico.diario;
    });
  }

  edit(diario: Diario) {
    console.log("edit diario");
    const dialogRef = this.dialog.open(DialogDiarioComponent, {
      data: diario
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("result:", result);
      //this.data.schedaPisico.diario.push(result);
      this.dataSource.data = this.data.schedaPisico.diario;
    });
  }

}


