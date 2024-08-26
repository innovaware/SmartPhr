import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DialogRiabilitazioneDiarioComponent } from 'src/app/dialogs/dialog-riabilitazione-diario/dialog-riabilitazione-diario.component';
import { AreaRiabilitativaDiario } from 'src/app/models/AreaRiabilitativaDiario';

@Component({
  selector: 'app-area-riabilitazione-diario',
  templateUrl: './area-riabilitazione-diario.component.html',
  styleUrls: ['./area-riabilitazione-diario.component.css']
})
export class AreaRiabilitazioneDiarioComponent implements OnInit, AfterViewInit {
  @Input() data: AreaRiabilitativaDiario[];
  @Input() disable: boolean;

  dataSourceRiabilitativaDiario: MatTableDataSource<AreaRiabilitativaDiario>;

  @ViewChild("paginatorDiarioRiabilitativo", {static: false}) paginator: MatPaginator;

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

  ngAfterViewInit() {
    this.dataSourceRiabilitativaDiario.paginator = this.paginator;
  }

  addNewDiario() {
    this.dialog
      .open(DialogRiabilitazioneDiarioComponent, {
        data: new AreaRiabilitativaDiario(),
      })
      .afterClosed()
      .subscribe((result) => {
        if (result != undefined && result) {
          this.data.push(result);
          this.dataSourceRiabilitativaDiario.paginator = this.paginator;
        }
      });
  }

}
