import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MatPaginator, MatTableDataSource } from '@angular/material';
import { DialogCartellaClinicaComponent } from 'src/app/dialogs/dialog-cartella-clinica/dialog-cartella-clinica.component';
import { DialogDiarioClinicoComponent } from 'src/app/dialogs/dialog-diario-clinico/dialog-diario-clinico.component';
import { DialogMessageErrorComponent } from 'src/app/dialogs/dialog-message-error/dialog-message-error.component';
import { CartellaClinica } from 'src/app/models/cartellaClinica';
import { DiarioClinico } from 'src/app/models/diarioClinico';
import { Paziente } from 'src/app/models/paziente';
import { CartellaclinicaService } from 'src/app/service/cartellaclinica.service';

@Component({
  selector: 'app-diario-clinico',
  templateUrl: './diario-clinico.component.html',
  styleUrls: ['./diario-clinico.component.css']
})
export class DiarioClinicoComponent implements OnInit {

  @Input() data: Paziente;
  public dataDiario : any[] = [];


  DisplayedColumns: string[] = ["data", "contenuto", "terapia", "action"];


  @ViewChild("paginatorDC", { static: false }) diarioClinicoPaginator: MatPaginator;
  public diarioClinicoDataSource: MatTableDataSource<DiarioClinico>;

  constructor(public dialogRef: MatDialogRef<DialogCartellaClinicaComponent>,
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
        console.log(JSON.stringify(f));

        this.dataDiario = f;
        this.diarioClinicoDataSource = new MatTableDataSource<DiarioClinico>(this.dataDiario);
        this.diarioClinicoDataSource.paginator = this.diarioClinicoPaginator;
  
      })
      .catch((err) => {
        this.showMessageError("Errore caricamento diario");
        console.error(err);
      });
  }



  async showMessageError(messageError: string) {
    var dialogRef = this.dialog.open(DialogMessageErrorComponent, {
      panelClass: "custom-modalbox",
      data: messageError,
    });

    if (dialogRef != undefined)
      dialogRef.afterClosed().subscribe((result) => {
        console.log("The dialog was closed", result);
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
        this.diarioClinicoDataSource = new MatTableDataSource<DiarioClinico>(this.dataDiario);
        }
      });
  }



}
