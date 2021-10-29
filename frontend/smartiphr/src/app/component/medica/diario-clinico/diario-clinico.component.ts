import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { DialogCartellaClinicaComponent } from 'src/app/dialogs/dialog-cartella-clinica/dialog-cartella-clinica.component';
import { DialogMessageErrorComponent } from 'src/app/dialogs/dialog-message-error/dialog-message-error.component';
import { CartellaClinica } from 'src/app/models/cartellaClinica';
import { Paziente } from 'src/app/models/paziente';
import { CartellaclinicaService } from 'src/app/service/cartellaclinica.service';

@Component({
  selector: 'app-diario-clinico',
  templateUrl: './diario-clinico.component.html',
  styleUrls: ['./diario-clinico.component.css']
})
export class DiarioClinicoComponent implements OnInit {

  @Input() data: Paziente;

  constructor(public dialogRef: MatDialogRef<DialogCartellaClinicaComponent>,
    public cartellaclinicaService: CartellaclinicaService,
    public dialog: MatDialog,) { }

  ngOnInit() {
  }


  async getDataDiario() {
    console.log(`get DataCartella paziente: ${this.data._id}`);
    this.cartellaclinicaService
      .getById( String(this.data._id) )
      .then((f) => {
        console.log(JSON.stringify(f));

        //this.cartella = f;
  
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



}
