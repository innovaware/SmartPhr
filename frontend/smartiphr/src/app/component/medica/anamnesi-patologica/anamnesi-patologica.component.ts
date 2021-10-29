import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { DialogCartellaClinicaComponent } from 'src/app/dialogs/dialog-cartella-clinica/dialog-cartella-clinica.component';
import { DialogMessageErrorComponent } from 'src/app/dialogs/dialog-message-error/dialog-message-error.component';
import { CartellaClinica } from 'src/app/models/cartellaClinica';
import { Paziente } from 'src/app/models/paziente';
import { CartellaclinicaService } from 'src/app/service/cartellaclinica.service';

@Component({
  selector: 'app-anamnesi-patologica',
  templateUrl: './anamnesi-patologica.component.html',
  styleUrls: ['./anamnesi-patologica.component.css']
})
export class AnamnesiPatologicaComponent implements  OnInit {
  @Input() data: Paziente;
  @Input() cartella : CartellaClinica;
  @Output() cartellaChange = new EventEmitter<CartellaClinica>();


  constructor( public dialogRef: MatDialogRef<DialogCartellaClinicaComponent>,
    public cartellaclinicaService: CartellaclinicaService,
    public dialog: MatDialog,) { 
    
  }
  ngOnInit() {
    this.getDataCartella();
  }

 



  async getDataCartella() {
    console.log(`get DataCartella paziente: ${this.data._id}`);
    this.cartellaclinicaService
      .getById( String(this.data._id) )
      .then((f) => {
        console.log(JSON.stringify(f));

        this.cartella = f;
  
      })
      .catch((err) => {
        this.showMessageError("Errore caricamento cartella");
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




  async change() {
    console.log("change: ", this.cartella);
    this.cartellaChange.emit(this.cartella);
  }


}
