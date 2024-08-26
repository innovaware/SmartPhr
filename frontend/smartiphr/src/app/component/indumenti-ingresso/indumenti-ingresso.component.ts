import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { IndumentiIngresso } from '../../models/indumentiIngresso';
import { IndumentiIngressoService } from '../../service/indumentiIngresso.service';
import { DialogIndumentiIngressoComponent } from '../../dialogs/dialog-indumento-ingresso/dialog-indumento-ingresso.component';

@Component({
  selector: 'app-indumenti-ingresso',
  templateUrl: './indumenti-ingresso.component.html',
  styleUrls: ['./indumenti-ingresso.component.css']
})
export class IndumentiIngressoComponent implements OnInit {

  @Input() data: any; // Cambia il tipo di input come necessario

  dataSource: MatTableDataSource<IndumentiIngresso> = new MatTableDataSource<IndumentiIngresso>();
  displayedColumns: string[] = ['name', 'quantity', 'datecaricamento', 'conforme', 'richiesto', 'noninelenco', 'note', 'action'];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public dialog: MatDialog,
    private indumentiIngressoService: IndumentiIngressoService,
  ) { }

  ngOnInit() {
    this.loadIndumentiIngresso();
  }

  loadIndumentiIngresso() {
    this.indumentiIngressoService.getIndumentiIngressoByPaziente(this.data._id)
      .subscribe(
        (result: IndumentiIngresso[]) => {
          this.dataSource.data = result;
          this.dataSource.paginator = this.paginator;
        },
        (error) => {
          console.error('Error fetching data:', error);
        }
      );
  }

  AddIndumento() {
    const dialogRef = this.dialog.open(DialogIndumentiIngressoComponent, {
      data: {
        paziente: this.data
      },
      width: "512px",
      height: "382px"
    });

    dialogRef.afterClosed().subscribe(() => {
      this.loadIndumentiIngresso(); // Ricarica i dati dopo la chiusura del dialogo
    });
  }
}
