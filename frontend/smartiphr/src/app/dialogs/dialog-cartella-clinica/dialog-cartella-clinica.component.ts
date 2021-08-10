import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Paziente } from 'src/app/models/paziente';

@Component({
  selector: 'app-dialog-cartella-clinica',
  templateUrl: './dialog-cartella-clinica.component.html',
  styleUrls: ['./dialog-cartella-clinica.component.css']
})
export class DialogCartellaClinicaComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogCartellaClinicaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Paziente
  ) {

  }

  ngOnInit() {}
}
