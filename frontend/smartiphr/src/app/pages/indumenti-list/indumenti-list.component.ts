import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { map } from 'rxjs/operators';
import { IndumentiComponent } from 'src/app/dialogs/indumenti/indumenti.component';
import { Paziente } from 'src/app/models/paziente';
import { MessagesService } from 'src/app/service/messages.service';
import { PazienteService } from 'src/app/service/paziente.service';

@Component({
  selector: 'app-indumenti-list',
  templateUrl: './indumenti-list.component.html',
  styleUrls: ['./indumenti-list.component.css']
})
export class IndumentiListComponent implements OnInit {

  displayedColumns: string[] = [
    "cognome",
    "nome",
    "codiceFiscale",
    "dataNascita",
    "action",
  ];
  dataSourcePazienti: MatTableDataSource<Paziente>;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  constructor(
    public dialog: MatDialog,
    public messageService: MessagesService,
    public pazienteService: PazienteService,
  ) {

    console.log("INIT DataSource Indumenti");
    this.pazienteService.getPazientiAsync()
        .pipe(
          map((paz: Paziente[])=> {
            return paz.filter(p=> p.idCamera !== undefined && p.idCamera !== null)
          })
        )
        .subscribe(
      (pazienti: Paziente[]) => {
        this.dataSourcePazienti = new MatTableDataSource(pazienti);
        this.dataSourcePazienti.paginator = this.paginator;
      }
    );

  }

  ngOnInit(): void {
  }


  showClothing(paziente: Paziente) {
    var dialogRef = this.dialog.open(IndumentiComponent, {
      data: { paziente: paziente },
      width: "1024px",
      height: "768px"
    });
  }
}
