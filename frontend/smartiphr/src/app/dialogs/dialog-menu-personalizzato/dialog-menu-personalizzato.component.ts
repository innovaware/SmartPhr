import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-menu-personalizzato',
  templateUrl: './dialog-menu-personalizzato.component.html',
  styleUrls: ['./dialog-menu-personalizzato.component.css']
})
export class DialogMenuPersonalizzatoComponent implements OnInit {

  note: string;
  date: Date;

  colazione: string;
  pranzo: string;
  cena: string;

  paziente: {
        nome: string,
        cognome: string,
        codiceFiscale: string
      };

  constructor(
    public dialogRef: MatDialogRef<DialogMenuPersonalizzatoComponent>,
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
        colazione: this.colazione,
        pranzo: this.pranzo,
        cena: this.cena,
      };
      console.log("Dialog Menu personalizzato Save item", item);
      this.dialogRef.close(item);
  }

}


