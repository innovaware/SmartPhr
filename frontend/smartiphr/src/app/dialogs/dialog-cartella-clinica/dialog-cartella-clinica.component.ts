import { Component, Inject, OnInit } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MatPaginator,
  MatTableDataSource,
  MAT_DIALOG_DATA,
} from "@angular/material";
import { CartellaClinica } from "src/app/models/cartellaClinica";
import { Paziente } from "src/app/models/paziente";
import { CartellaclinicaService } from "src/app/service/cartellaclinica.service";
import { DialogMessageErrorComponent } from "../dialog-message-error/dialog-message-error.component";

@Component({
  selector: "app-dialog-cartella-clinica",
  templateUrl: "./dialog-cartella-clinica.component.html",
  styleUrls: ["./dialog-cartella-clinica.component.css"],
})
export class DialogCartellaClinicaComponent implements OnInit {


public cartella: CartellaClinica;

  constructor(
    public dialogRef: MatDialogRef<DialogCartellaClinicaComponent>,
    public cartellaclinicaService: CartellaclinicaService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      paziente: Paziente;
      readonly: boolean    
    }
  ) {
  }

  ngOnInit() {
    this.getDataCartella();
  }



  async getDataCartella() {
    console.log(`get DataCartella paziente: ${this.data.paziente._id}`);
    this.cartellaclinicaService
      .getById(this.data.paziente._id )
      .then((f) => {
        console.log(Object.keys(f).length);
    if(Object.keys(f).length > 0)
        this.cartella = f;
    else
    this.cartella = new CartellaClinica();

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



  salva(){
    console.log('this.cartella: ' + this.cartella == 'undefined');
    if(Object.keys(this.cartella).length == 0 ){

      this.cartella.user = this.data.paziente._id;
    this.cartellaclinicaService
      .insert(this.cartella )
      .then((f: CartellaClinica) => {
        this.cartella = f;

      })
      .catch((err) => {
        this.showMessageError("Errore creazione cartella");
        console.error(err);
      });
    }
  }



}
