import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Paziente } from 'src/app/models/paziente';

@Component({
  selector: 'app-dialog-pisicologica',
  templateUrl: './dialog-pisicologica.component.html',
  styleUrls: ['./dialog-pisicologica.component.css']
})
export class DialogPisicologicaComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogPisicologicaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Paziente) {

      console.log("Paziente: ", data);
    }


  ngOnInit() {
  }

}
