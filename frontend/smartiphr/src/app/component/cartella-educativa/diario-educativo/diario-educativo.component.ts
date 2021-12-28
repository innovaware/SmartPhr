import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MatPaginator, MatTableDataSource } from '@angular/material';
import { DialogCartellaClinicaComponent } from 'src/app/dialogs/dialog-cartella-clinica/dialog-cartella-clinica.component';
import { DialogDiarioClinicoComponent } from 'src/app/dialogs/dialog-diario-clinico/dialog-diario-clinico.component';
import { DialogMessageErrorComponent } from 'src/app/dialogs/dialog-message-error/dialog-message-error.component';
import { CartellaClinica } from 'src/app/models/cartellaClinica';
import { DiarioEducativo } from 'src/app/models/diarioEducativo';
import { Paziente } from 'src/app/models/paziente';
import { CartellaclinicaService } from 'src/app/service/cartellaclinica.service';
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

  @ViewChild("paginatorDC", { static: false }) diarioEducativoPaginator: MatPaginator;
  public diarioEducativoDataSource: MatTableDataSource<DiarioEducativo>;


  constructor(public dialogRef: MatDialogRef<DialogCartellaClinicaComponent>,
    public messageService: MessagesService,
    public cartellaclinicaService: CartellaclinicaService,
    public dialog: MatDialog,) { }

  ngOnInit() {
    this.getDataDiario();
  }



  async getDataDiario() {
    console.log(`get DataCartella paziente: ${this.data._id}`);
    this.cartellaclinicaService
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
    var dialogRef = this.dialog.open(DialogDiarioClinicoComponent, {
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


}
