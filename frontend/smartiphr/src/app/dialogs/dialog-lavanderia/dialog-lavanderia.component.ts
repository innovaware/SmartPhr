import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Paziente } from 'src/app/models/paziente';

@Component({
  selector: 'app-dialog-lavanderia',
  templateUrl: './dialog-lavanderia.component.html',
  styleUrls: ['./dialog-lavanderia.component.css']
})
export class DialogLavanderiaComponent implements OnInit {

  note: string;
  date: Date;
  paziente: {
        nome: string,
        cognome: string,
        codiceFiscale: string
      };

  constructor(
    public dialogRef: MatDialogRef<DialogLavanderiaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      paziente: {
        nome: string,
        cognome: string,
        codiceFiscale: string
      };
    }) {
      console.log("Dialog", data.paziente);

      this.paziente = data.paziente;
    }

  ngOnInit(): void {
    this.date = new Date();
  }

  cancel() {
    this.dialogRef.close(undefined);
  }

  save() {
      const item = {
        note: this.note,
        date: this.date,
      };
      console.log("Dialog Lavanderia Save item", item);
      this.dialogRef.close(item);
  }

}

