import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { Subject } from "rxjs";
import { SchedaUlcereDiabeteComponent } from "src/app/component/infermeristica/scheda-ulcere-diabete/scheda-ulcere-diabete.component";
import { Paziente } from "src/app/models/paziente";
import { SchedaBAI } from "src/app/models/SchedaBAI";
import { SchedaDiario } from 'src/app/models/SchedaDiario';
import { SchedaInfermeristica } from "src/app/models/SchedaInfermeristica";
import { SchedaInterventi } from "src/app/models/SchedaInterventi";
import { SchedaLesioniCutanee } from "src/app/models/SchedaLesioniCutanee";
import { SchedaLesioniDecubito } from "src/app/models/SchedaLesioniDecubito";
import { SchedaMnar } from 'src/app/models/SchedaMnar';
import { SchedaUlcere } from 'src/app/models/schedaUlcere';
import { SchedaUlcereDiabete } from 'src/app/models/SchedaUlcereDiabete';
import { SchedaVas } from 'src/app/models/SchedaVas';
import { PazienteService } from 'src/app/service/paziente.service';

@Component({
  selector: "app-dialog-cartella-infermeristica",
  templateUrl: "./dialog-cartella-infermeristica.component.html",
  styleUrls: ["./dialog-cartella-infermeristica.component.css"],
})
export class DialogCartellaInfermeristicaComponent implements OnInit {
  schedaBAI: SchedaBAI;
  schedaInterventi: SchedaInterventi;
  schedaLesioni: SchedaLesioniCutanee;
  schedaLesioniDecubito: SchedaLesioniDecubito;
  schedaMnar: SchedaMnar;
  schedaUlcere: SchedaUlcere;

  schedaVas: SchedaVas;
  schedaUlcereDiabete: SchedaUlcereDiabete;
  schedaDiario: SchedaDiario;

  paziente: Paziente;

  constructor(
    public pazienteService: PazienteService,
    public dialogRef: MatDialogRef<DialogCartellaInfermeristicaComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      paziente: Paziente;
      readonly: boolean;
    }
  ) {
    console.log("Dialog Cartella Infermeristica");

    this.paziente = JSON.parse(JSON.stringify(data.paziente))

    if (this.paziente.schedaInfermeristica == undefined) {
      this.paziente.schedaInfermeristica = new SchedaInfermeristica();
    }

    if (this.paziente.schedaInfermeristica.schedaBAI == undefined) {
      this.paziente.schedaInfermeristica.schedaBAI = new SchedaBAI();
    }

    if (this.paziente.schedaInfermeristica.schedaInterventi == undefined) {
      this.paziente.schedaInfermeristica.schedaInterventi = new SchedaInterventi();
    }

    if (this.paziente.schedaInfermeristica.schedaLesioni == undefined) {
      this.paziente.schedaInfermeristica.schedaLesioni = new SchedaLesioniCutanee();
    }

    if (this.paziente.schedaInfermeristica.schedaLesioniDecubito == undefined) {
      this.paziente.schedaInfermeristica.schedaLesioniDecubito = new SchedaLesioniDecubito();
    }

    if (this.paziente.schedaInfermeristica.schedaMnar == undefined) {
      this.paziente.schedaInfermeristica.schedaMnar = new SchedaMnar();
    }

    if (this.paziente.schedaInfermeristica.schedaUlcere == undefined) {
      this.paziente.schedaInfermeristica.schedaUlcere = new SchedaUlcere();
    }

    if (this.paziente.schedaInfermeristica.schedaVas == undefined) {
      this.paziente.schedaInfermeristica.schedaVas = new SchedaVas();
    }

    if (this.paziente.schedaInfermeristica.schedaUlcereDiabete == undefined) {
      this.paziente.schedaInfermeristica.schedaUlcereDiabete = new SchedaUlcereDiabete();
    }

    if (this.paziente.schedaInfermeristica.schedaDiario == undefined) {
      this.paziente.schedaInfermeristica.schedaDiario = new SchedaDiario();
    }

    this.schedaBAI = this.paziente.schedaInfermeristica.schedaBAI;
    this.schedaInterventi = this.paziente.schedaInfermeristica.schedaInterventi;
    this.schedaLesioni = this.paziente.schedaInfermeristica.schedaLesioni;
    this.schedaLesioniDecubito = this.paziente.schedaInfermeristica.schedaLesioniDecubito;
    this.schedaMnar = this.paziente.schedaInfermeristica.schedaMnar;
    this.schedaUlcere = this.paziente.schedaInfermeristica.schedaUlcere;
    this.schedaVas = this.paziente.schedaInfermeristica.schedaVas;
    this.schedaUlcereDiabete = this.paziente.schedaInfermeristica.schedaUlcereDiabete;
    this.schedaDiario = this.paziente.schedaInfermeristica.schedaDiario;
  }

  ngOnInit() {}

  async save() {

    this.pazienteService.save(this.paziente).then(
      (value: Paziente) => {
        console.log(`Patient  saved`, value);
        this.dialogRef.close(this.paziente);
      }
    )
  }

}
