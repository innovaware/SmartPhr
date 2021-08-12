import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatTableDataSource } from '@angular/material';
import { CartellaClinica } from 'src/app/models/cartellaClinica';
import { Diario } from 'src/app/models/diario';
import { Paziente } from 'src/app/models/paziente';

@Component({
  selector: 'app-visite-specialistiche',
  templateUrl: './visite-specialistiche.component.html',
  styleUrls: ['./visite-specialistiche.component.css']
})
export class VisiteSpecialisticheComponent implements OnInit {
  @Input() data;
  @Input() disable: boolean;

  diario: Diario[];

  displayedColumns: string[] = ['data', 'valore' ,'firma', 'action'];
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


