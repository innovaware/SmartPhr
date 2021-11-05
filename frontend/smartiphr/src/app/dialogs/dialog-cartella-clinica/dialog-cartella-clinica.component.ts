import { AfterViewInit, Component, Inject, OnInit } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from "@angular/material";
import { CartellaClinica } from "src/app/models/cartellaClinica";
import { Paziente } from "src/app/models/paziente";
import { schedaAnamnesiFamigliare } from "src/app/models/schedaAnamnesiFamigliare";
import { schedaAnamnesiPatologica } from "src/app/models/schedaAnamnesiPatologica";
import { schedaEsameGenerale } from "src/app/models/schedaEsameGenerale";
import { schedaEsameNeurologia } from "src/app/models/schedaEsameNeurologia";
import { schedaMezziContenzione } from "src/app/models/schedaMezziContenzione";
import { schedaValutazioneTecniche } from "src/app/models/schedaValutazioneTecniche";
import { CartellaclinicaService } from "src/app/service/cartellaclinica.service";
import { PazienteService } from "src/app/service/paziente.service";
import { DialogMessageErrorComponent } from "../dialog-message-error/dialog-message-error.component";

@Component({
  selector: "app-dialog-cartella-clinica",
  templateUrl: "./dialog-cartella-clinica.component.html",
  styleUrls: ["./dialog-cartella-clinica.component.css"],
})
export class DialogCartellaClinicaComponent implements OnInit {


  schedaAnamnesiFamigliare: schedaAnamnesiFamigliare;
  schedaAnamnesiPatologica: schedaAnamnesiPatologica;
  schedaEsameNeurologia: schedaEsameNeurologia;
  schedaEsameGenerale: schedaEsameGenerale;
  schedaMezziContenzione: schedaMezziContenzione;
  schedaValutazioneTecniche: schedaValutazioneTecniche;


  paziente: Paziente;

  
  constructor(
    public dialogRef: MatDialogRef<DialogCartellaClinicaComponent>,
    public pazienteService: PazienteService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      paziente: Paziente;
      readonly: boolean
    }
  ) {
    console.log("Dialog Cartella Clinica");

    this.paziente = Paziente.clone(data.paziente);

    if (this.paziente.schedaClinica == undefined) {
      this.paziente.schedaClinica = new CartellaClinica();
    }

    if (this.paziente.schedaClinica.schedaAnamnesiFamigliare == undefined) {
      this.paziente.schedaClinica.schedaAnamnesiFamigliare = new schedaAnamnesiFamigliare();
    }

    if (this.paziente.schedaClinica.schedaAnamnesiPatologica == undefined) {
      this.paziente.schedaClinica.schedaAnamnesiPatologica = new schedaAnamnesiPatologica();
    }

    if (this.paziente.schedaClinica.schedaEsameGenerale == undefined) {
      this.paziente.schedaClinica.schedaEsameGenerale = new schedaEsameGenerale();
    }

    if (this.paziente.schedaClinica.schedaEsameNeurologia == undefined) {
      this.paziente.schedaClinica.schedaEsameNeurologia = new schedaEsameNeurologia();
    }

    if (this.paziente.schedaClinica.schedaMezziContenzione == undefined) {
      this.paziente.schedaClinica.schedaMezziContenzione = new schedaMezziContenzione();
    }

    if (this.paziente.schedaClinica.schedaValutazioneTecniche == undefined) {
      this.paziente.schedaClinica.schedaValutazioneTecniche = new schedaValutazioneTecniche();
    }



    this.schedaAnamnesiFamigliare = this.paziente.schedaClinica.schedaAnamnesiFamigliare as schedaAnamnesiFamigliare;
    this.schedaAnamnesiPatologica = this.paziente.schedaClinica.schedaAnamnesiPatologica as schedaAnamnesiPatologica;
    this.schedaEsameGenerale = this.paziente.schedaClinica.schedaEsameGenerale as schedaEsameGenerale;
    this.schedaEsameNeurologia = this.paziente.schedaClinica.schedaEsameNeurologia as schedaEsameNeurologia;
    this.schedaMezziContenzione = this.paziente.schedaClinica.schedaMezziContenzione as schedaMezziContenzione;
    this.schedaValutazioneTecniche = this.paziente.schedaClinica.schedaValutazioneTecniche as schedaValutazioneTecniche;

  }

  ngOnInit(){

  }



  async salva(){

    this.pazienteService.save(this.paziente).then(
      (value: Paziente) => {
        console.log(`Patient  saved`, value);
        this.dialogRef.close(this.paziente);
      }
    )

  }



}
