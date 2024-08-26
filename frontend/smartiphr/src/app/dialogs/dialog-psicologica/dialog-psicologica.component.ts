import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { CartellaClinica } from "src/app/models/cartellaClinica";
import { Paziente } from "src/app/models/paziente";
import { schedaPsico } from "src/app/models/schedaPsico";

@Component({
  selector: "app-dialog-psicologica",
  templateUrl: "./dialog-psicologica.component.html",
  styleUrls: ["./dialog-psicologica.component.css"],
})
export class DialogPisicologicaComponent implements OnInit {
  schedaPsico: schedaPsico;

  constructor(
    public dialogRef: MatDialogRef<DialogPisicologicaComponent>,

    @Inject(MAT_DIALOG_DATA)
    public data: { paziente: Paziente; readonly: boolean; newItem: boolean }
  ) {
    console.log("Dialog psicologica. Data: ", data);

    if (data.paziente.schedaPsico == undefined) {
      this.schedaPsico = new schedaPsico();
    } else {
      this.schedaPsico = schedaPsico.clone(data.paziente.schedaPsico);
    }
  }

  ngOnInit() {}

  save() {
    this.dialogRef.close(this.schedaPsico);
   // this.data.paziente.schedaPsico.update(this.schedaPsico);
  }
}
