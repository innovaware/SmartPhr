import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatTableDataSource } from '@angular/material';
import { DialogCvComponent } from 'src/app/dialogs/dialog-cv/dialog-cv.component';
import { Dipendenti } from 'src/app/models/dipendenti';
import { DipendentiService } from 'src/app/service/dipendenti.service';

@Component({
  selector: 'app-cv',
  templateUrl: './cv.component.html',
  styleUrls: ['./cv.component.css']
})
export class CvComponent implements OnInit {
  displayedColumns: string[] = [
    "cognome",
    "nome",
    "codiceFiscale",
    "action",
  ];

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  dataSource: MatTableDataSource<Dipendenti>;
  dipendenti: Dipendenti[];

  constructor(
    private dialog: MatDialog,
    private dipendentiService: DipendentiService
  ) {
    this.dipendenti = [];

    this.dipendentiService.get().then(
      (dips: Dipendenti[]) => {
        this.dipendenti = dips;
        this.dataSource = new MatTableDataSource<Dipendenti>(this.dipendenti);
        this.dataSource.paginator = this.paginator;
      }
    )
  }

  ngOnInit() {
  }

  async show(dipendente: Dipendenti) {
    console.log("Show scheda dipendente:", dipendente);
    var dialogRef = this.dialog.open(DialogCvComponent, {
      data: { dipendente: dipendente, readonly: false },
      width: "1024px"
    });
  }

}
