import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { CartellaClinica } from "src/app/models/cartellaClinica";
import { Paziente } from "src/app/models/paziente";
import { schedaPisico } from "src/app/models/schedaPisico";

@Component({
  selector: "app-dialog-pisicologica",
  templateUrl: "./dialog-pisicologica.component.html",
  styleUrls: ["./dialog-pisicologica.component.css"],
})
export class DialogPisicologicaComponent implements OnInit {
  schedaPisico: schedaPisico;

  constructor(
    public dialogRef: MatDialogRef<DialogPisicologicaComponent>,

    @Inject(MAT_DIALOG_DATA)
    public data: { paziente: Paziente; readonly: boolean; newItem: boolean }
  ) {
    console.log("Dialog psicologica. Data: ", data);

    if (data.paziente.schedaPisico == undefined) {
      this.schedaPisico = new schedaPisico();
    } else {
      this.schedaPisico = schedaPisico.clone(data.paziente.schedaPisico);
    }
  }

  ngOnInit() {}

  save() {
    this.dialogRef.close(this.schedaPisico);
   // this.data.paziente.schedaPisico.update(this.schedaPisico);
  }
}
