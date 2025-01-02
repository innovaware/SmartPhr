import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DialogCartellaAssistenteSocialeComponent } from 'src/app/dialogs//dialog-cartella-assistente-sociale/dialog-cartella-assistente-sociale.component';
import { DialogDiarioAsssocialeComponent } from 'src/app/dialogs/dialog-diario-asssociale/dialog-diario-asssociale.component';
import { DialogMessageErrorComponent } from 'src/app/dialogs/dialog-message-error/dialog-message-error.component';
import { DiarioAssSociale } from 'src/app/models/diarioAssSociale';
import { Paziente } from 'src/app/models/paziente';
import { CartellaAssSocialeService } from 'src/app/service/cartella-ass-sociale.service';
import { MessagesService } from 'src/app/service/messages.service';


@Component({
  selector: 'app-diario-sociale',
  templateUrl: './diario-sociale.component.html',
  styleUrls: ['./diario-sociale.component.css']
})
export class DiarioSocialeComponent implements OnInit {

  @Input() data: Paziente;
  public dataDiario: any[] = [];


  DisplayedColumns: string[] = ["data", "contenuto", "firma", "action"];


  @ViewChild("paginatorDC", { static: false }) diarioAssSocialePaginator: MatPaginator;
  public diarioAssSocialeDataSource: MatTableDataSource<DiarioAssSociale>;

  constructor(public dialogRef: MatDialogRef<DialogCartellaAssistenteSocialeComponent>,
    public messageService: MessagesService,
    public cartellaService: CartellaAssSocialeService,
    public dialog: MatDialog,) { }

  ngOnInit() {
    this.getDataDiario();
  }



  async getDataDiario() {
    this.cartellaService
      .getDiarioByUser(String(this.data._id))
      .then((f) => {

        this.dataDiario = f;
        this.diarioAssSocialeDataSource = new MatTableDataSource<DiarioAssSociale>(this.dataDiario);
        this.diarioAssSocialeDataSource.paginator = this.diarioAssSocialePaginator;

      })
      .catch((err) => {
        this.messageService.showMessageError("Errore caricamento diario");
        console.error(err);
      });
  }



  async addDiario() {

    var dialogRef = this.dialog.open(DialogDiarioAsssocialeComponent, {
      data: { paziente: this.data, readonly: false },
      width: "600px",
    });


    if (dialogRef != undefined)
      dialogRef.afterClosed().subscribe((result) => {
        if (result != null && result != undefined) {
          this.getDataDiario();
        }
      });
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.diarioAssSocialeDataSource.filter = filterValue
      .trim()
      .toLowerCase();
  }


  editItem(diario: DiarioAssSociale) {
    this.dialog
      .open(DialogDiarioAsssocialeComponent, {
        data: DiarioAssSociale.clone(diario),
        width: "600px",
      })
      .afterClosed()
      .subscribe((result) => {
        if (result != undefined) {
          this.getDataDiario();
        }
      });
  }

}
