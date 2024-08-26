import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { RichiestePresidi } from '../../models/richiestePresidi';
import { RichiestePresidiService } from '../../service/richiestePresidi.service';
import { Dipendenti } from '../../models/dipendenti';
import { DataSource } from '@angular/cdk/collections';
import { DialogRichiestaPresidiComponent } from '../../dialogs/dialog-richiesta/dialog-richiesta.component';

@Component({
  selector: 'app-richiestePresidi',
  templateUrl: './richiestePresidi.component.html',
  styleUrls: ['./richiestePresidi.component.css']
})
export class RichiestaPresidiComponent implements OnInit {

  @Input() dipendente: Dipendenti;
  @Input() Admin: Boolean;
  @Input() type: String;

  public inputSearchField;
  dataSource: MatTableDataSource<RichiestePresidi> = new MatTableDataSource<RichiestePresidi>();
  displayedColumns: string[] = ['utente', 'name', 'type', 'quantita', 'status', 'dataRichiesta', 'dataAcquisto', 'dataConsegna', 'note', 'action'];
  public stack: RichiestePresidi[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public dialog: MatDialog,
    private RichiestePresidiService: RichiestePresidiService,
  ) {
    this.stack = [];
    this.dataSource = new MatTableDataSource<RichiestePresidi>();
  }

  ngOnInit() {
    this.stack = [];
    this.dataSource = new MatTableDataSource<RichiestePresidi>();
    this.loadRichiestePresidi();
  }

  loadRichiestePresidi() {
    this.RichiestePresidiService.get()
      .then(
        (result: RichiestePresidi[]) => {
          if (!this.Admin) {
            result = result.filter(x => x.type == this.type);
          }
          this.stack = result;
          this.dataSource.data = result;
          this.dataSource.paginator = this.paginator;
        },
        (error) => {
          console.error('Error fetching data:', error);
        }
      );
  }

  AddRichiesta() {
    const dialogRef = this.dialog.open(DialogRichiestaPresidiComponent, {
      data: {
        dipendente: this.dipendente,
        type: this.type
      },
      //width: "512px",
      //height: "382px"
    });

    dialogRef.afterClosed().subscribe(() => {
      this.loadRichiestePresidi(); // Ricarica i dati dopo la chiusura del dialogo
    });
  }
  AnnullaRichiesta(row: RichiestePresidi) {
    row.status = "Annullato";
    row.dataAnnullamento = new Date();
    this.RichiestePresidiService.save(row).then(() => {

      this.loadRichiestePresidi();
    });
  }

  Acquista(row: RichiestePresidi) {
    row.status = "Acquistato";
    row.dataAcquisto = new Date();
    this.RichiestePresidiService.save(row).then(() => {

      this.loadRichiestePresidi();
    });
  }

  Consegna(row: RichiestePresidi) {
    row.status = "Consegnato";
    row.dataConsegna = new Date();
    this.RichiestePresidiService.save(row).then(() => {

      this.loadRichiestePresidi();
    });
  }


  cleanSearchField() {
    this.dataSource.filter = undefined;
    this.inputSearchField = undefined;


  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
