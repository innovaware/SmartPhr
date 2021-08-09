import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatTableDataSource } from '@angular/material';
import { Utenti } from 'src/app/models/utenti';
import { UtentiService } from 'src/app/service/utenti.service';

@Component({
  selector: 'app-gest-utenti',
  templateUrl: './gest-utenti.component.html',
  styleUrls: ['./gest-utenti.component.css']
})
export class GestUtentiComponent implements OnInit {

  displayedColumns: string[] = [
    "cognome",
    "nome",
    "email",
    "user",
    "action",
  ];
  dataSource: MatTableDataSource<Utenti>;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  constructor(
    public dialog: MatDialog,
    public utentiService: UtentiService
    ) {

    this.utentiService.getUtenti().then( (result)=>{
      let utenti: Utenti[] = result;

      this.dataSource = new MatTableDataSource<Utenti>(utenti);
    });
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


}
