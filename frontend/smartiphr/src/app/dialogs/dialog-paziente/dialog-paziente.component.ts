import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { PazienteGeneraleComponent } from "src/app/component/paziente-generale/paziente-generale.component";
import { Paziente } from "src/app/models/paziente";

@Component({
  selector: "app-dialog-paziente",
  templateUrl: "./dialog-paziente.component.html",
  styleUrls: ["./dialog-paziente.component.css"],
})
export class DialogPazienteComponent implements OnInit {
  public paziente: Paziente;

  constructor(
    public dialogRef: MatDialogRef<PazienteGeneraleComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { paziente: Paziente; readonly: boolean }
  ) {
    this.paziente = JSON.parse(JSON.stringify(this.data.paziente));
    console.log("Dialog paziente generale", this.data);
  }

  async save() {
    // this.data.paziente = this.paziente;
    console.log("update paziente");
    this.data.paziente.cognome = this.paziente.cognome;
    this.data.paziente.nome = this.paziente.nome;
    this.data.paziente.sesso = this.paziente.sesso;
    this.data.paziente.luogoNascita = this.paziente.luogoNascita;
    this.data.paziente.dataNascita = this.paziente.dataNascita;
    this.data.paziente.residenza = this.paziente.residenza;
    this.data.paziente.statoCivile = this.paziente.statoCivile;
    this.data.paziente.figli = this.paziente.figli;
    this.data.paziente.scolarita = this.paziente.scolarita;
    this.data.paziente.situazioneLavorativa = this.paziente.situazioneLavorativa;
    this.data.paziente.personeRiferimento = this.paziente.personeRiferimento;
    this.data.paziente.telefono = this.paziente.telefono;
    this.data.paziente.dataIngresso = this.paziente.dataIngresso;
    this.data.paziente.provincia = this.paziente.provincia;
    this.data.paziente.localita = this.paziente.localita;
    this.data.paziente.provenienza = this.paziente.provenienza;



    this.dialogRef.close(this.data.paziente);
  }

  ngOnInit() {}
}
