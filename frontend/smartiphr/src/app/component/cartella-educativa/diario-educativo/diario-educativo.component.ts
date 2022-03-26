import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MatPaginator, MatTableDataSource } from '@angular/material';
import { DialogCartellaAssistenteSocialeComponent } from 'src/app/dialogs//dialog-cartella-assistente-sociale/dialog-cartella-assistente-sociale.component';
import { DialogCartellaEducativaComponent } from 'src/app/dialogs/dialog-cartella-educativa/dialog-cartella-educativa.component';
import { DialogDiarioEducativoComponent } from 'src/app/dialogs/dialog-diario-educativo/dialog-diario-educativo.component';
import { DialogMessageErrorComponent } from 'src/app/dialogs/dialog-message-error/dialog-message-error.component';
import { DiarioEducativo } from 'src/app/models/diarioEducativo';
import { Paziente } from 'src/app/models/paziente';
import { CartellaEducativaService } from 'src/app/service/cartella-educativa.service';
import { MessagesService } from 'src/app/service/messages.service';


@Component({
  selector: 'app-diario-educativo',
  templateUrl: './diario-educativo.component.html',
  styleUrls: ['./diario-educativo.component.css']
})
export class DiarioEducativoComponent implements OnInit {

  @Input() data: Paziente;
  public dataDiario : any[] = [];


  DisplayedColumns: string[] = ["data", "contenuto", "firma", "action"];

  @ViewChild("paginatorDC") diarioEducativoPaginator: MatPaginator;
  public diarioEducativoDataSource: MatTableDataSource<DiarioEducativo>;


  constructor(public dialogRef: MatDialogRef<DialogCartellaEducativaComponent>,
    public messageService: MessagesService,
    public cartellaService: CartellaEducativaService,
    public dialog: MatDialog,) { }

  ngOnInit() {
    this.getDataDiario();
  }



  async getDataDiario() {
    console.log(`get DataCartella paziente: ${this.data._id}`);
    this.cartellaService
      .getDiarioByUser( String(this.data._id) )
      .then((f) => {

        this.dataDiario = f;
        this.diarioEducativoDataSource = new MatTableDataSource<DiarioEducativo>(this.dataDiario);
        this.diarioEducativoDataSource.paginator = this.diarioEducativoPaginator;

      })
      .catch((err) => {
        this.messageService.showMessageError("Errore caricamento diario");
        console.error(err);
      });
  }



  async addDiario() {

    console.log("Show Add Diario:", this.data);
    var dialogRef = this.dialog.open(DialogDiarioEducativoComponent, {
      data: { paziente: this.data, readonly: false },
      width: "600px",
    });


    if (dialogRef != undefined)
      dialogRef.afterClosed().subscribe((result) => {
        if(result != null && result != undefined){
        this.dataDiario.push(result);
        this.diarioEducativoDataSource = new MatTableDataSource<DiarioEducativo>(this.dataDiario);
        }
      });
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.diarioEducativoDataSource.filter = filterValue
      .trim()
      .toLowerCase();
  }



  editItem(diario: DiarioEducativo) {
    console.log("Edit item (DiarioEducativo)");
    this.dialog
      .open(DialogDiarioEducativoComponent, {
        data: DiarioEducativo.clone(diario),
        width: "600px",
      })
      .afterClosed()
      .subscribe((result) => {
        console.log("result:", result);
        if (result != undefined ) {
          const data = this.dataDiario;

          const index = data.indexOf(diario, 0);
          if (index > -1) {
            data.splice(index, 1);
            console.log("Removed item");
          }

          data.push(result);
          this.diarioEducativoDataSource.data = this.dataDiario;
        }
      });
  }

}
