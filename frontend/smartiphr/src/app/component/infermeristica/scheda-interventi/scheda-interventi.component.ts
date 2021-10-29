import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatTableDataSource } from '@angular/material';
import { CartellaClinica } from 'src/app/models/cartellaClinica';
import { Diario } from 'src/app/models/diario';
import { Paziente } from 'src/app/models/paziente';
import { SchedaInterventi } from 'src/app/models/SchedaInterventi';

@Component({
  selector: 'app-scheda-interventi',
  templateUrl: './scheda-interventi.component.html',
  styleUrls: ['./scheda-interventi.component.css']
})
export class SchedaInterventiComponent implements OnInit {
  @Input() data: SchedaInterventi[];
  @Input() disable: boolean;


  displayedColumns: string[] = ['data', 'diagnosi' ,'obiettivi' ,'intervento' ,'firma', 'action'];

  dataSource: MatTableDataSource<SchedaInterventi>;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  constructor(
    public dialog: MatDialog
  ) {
    this.dataSource = new MatTableDataSource<SchedaInterventi>(this.data);
    this.dataSource.paginator = this.paginator;
  }

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


