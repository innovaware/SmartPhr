import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatTableDataSource } from '@angular/material';
import { DialogRiabilitazioneDiarioComponent } from 'src/app/dialogs/dialog-riabilitazione-diario/dialog-riabilitazione-diario.component';
import { AreaRiabilitativaDiario } from 'src/app/models/AreaRiabilitativaDiario';

@Component({
  selector: 'app-area-riabilitazione-diario',
  templateUrl: './area-riabilitazione-diario.component.html',
  styleUrls: ['./area-riabilitazione-diario.component.css']
})
export class AreaRiabilitazioneDiarioComponent implements OnInit {
  @Input() data: AreaRiabilitativaDiario[];
  @Input() disable: boolean;

  dataSourceRiabilitativaDiario: MatTableDataSource<AreaRiabilitativaDiario>;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  constructor(public dialog: MatDialog) { }

  displayedColumns: string[] = [
    "data",
    "control",
    "note",
    "firma",
    "action",
  ];

  ngOnInit() {
    this.dataSourceRiabilitativaDiario = new MatTableDataSource<AreaRiabilitativaDiario>(
      this.data
    );
    this.dataSourceRiabilitativaDiario.paginator = this.paginator;
  }

  addNewDiario() {
    console.log("New Item lesione");
    this.dialog
      .open(DialogRiabilitazioneDiarioComponent, {
        data: new AreaRiabilitativaDiario(),
      })
      .afterClosed()
      .subscribe((result) => {
        if (result != undefined && result) {
          console.log("result:", result);
          this.data.push(result);
          this.dataSourceRiabilitativaDiario.paginator = this.paginator;
        }
      });
  }

}
