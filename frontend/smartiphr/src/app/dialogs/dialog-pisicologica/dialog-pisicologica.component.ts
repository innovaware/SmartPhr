import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
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
    @Inject(MAT_DIALOG_DATA) public data: Paziente
  ) {


  }

  ngOnInit() {}
}
