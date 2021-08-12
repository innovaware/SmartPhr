import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Paziente } from 'src/app/models/paziente';

@Component({
  selector: 'app-dialog-cartella-infermeristica',
  templateUrl: './dialog-cartella-infermeristica.component.html',
  styleUrls: ['./dialog-cartella-infermeristica.component.css']
})
export class DialogCartellaInfermeristicaComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogCartellaInfermeristicaComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      paziente: Paziente;
      readonly: boolean;
    }
  ) {
    console.log("Dialog Cartella Infermeristica")
  }

  ngOnInit() {}
}
