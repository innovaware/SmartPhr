import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
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

  constructor() { }

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

}


