import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatTableDataSource } from '@angular/material';
import { CartellaClinica } from 'src/app/models/cartellaClinica';
import { Diario } from 'src/app/models/diario';
import { Paziente } from 'src/app/models/paziente';

@Component({
  selector: 'app-scheda-interventi',
  templateUrl: './scheda-interventi.component.html',
  styleUrls: ['./scheda-interventi.component.css']
})
export class SchedaInterventiComponent implements OnInit {
  @Input() data;
  @Input() disable: boolean;

  diario: Diario[];

  displayedColumns: string[] = ['data', 'diagnosi' ,'obiettivi' ,'intervento' ,'firma', 'action'];
  dataSource: MatTableDataSource<Diario>;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  constructor(
    public dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  applyFilter(event: Event) {

  }

  showDiario() {

  }

  edit(diario: Diario) {

  }

}


