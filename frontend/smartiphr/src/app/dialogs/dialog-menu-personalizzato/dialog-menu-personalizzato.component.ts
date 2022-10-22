import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CucinaMenuPersonalizzato } from 'src/app/models/CucinaMenuPersonalizzato';

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
        codiceFiscale: string,
        menuPersonalizzato: CucinaMenuPersonalizzato
      };

  constructor(
    public dialogRef: MatDialogRef<DialogMenuPersonalizzatoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      paziente: {
        nome: string,
        cognome: string,
        codiceFiscale: string,
        menuPersonalizzato: CucinaMenuPersonalizzato
      };
    }) {
      console.log("Dialog", data.paziente);
      this.paziente = data.paziente;
    }

  ngOnInit(): void {
    this.date = new Date();
    if (this.paziente.menuPersonalizzato !== undefined) {
        // Visualizzazione delle variabili colazione; pranzo; cena; note, data
        console.log("Setting variables");

        this.colazione = this.paziente.menuPersonalizzato.menuColazione;
        this.pranzo = this.paziente.menuPersonalizzato.menuPranzo;
        this.cena = this.paziente.menuPersonalizzato.menuCena;
        this.note = this.paziente.menuPersonalizzato.descrizione;
        this.date = new Date(this.paziente.menuPersonalizzato.data);
    }
  }

  newRecord() {
    this.colazione = "";
    this.pranzo =  "";
    this.cena =  "";
    this.note = "";
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


