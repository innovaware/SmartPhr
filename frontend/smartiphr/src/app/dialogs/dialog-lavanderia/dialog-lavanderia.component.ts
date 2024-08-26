import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Dipendenti } from 'src/app/models/dipendenti';
import { TypeOperationLavanderia } from 'src/app/models/lavanderia';
import { Paziente } from 'src/app/models/paziente';

@Component({
  selector: 'app-dialog-lavanderia',
  templateUrl: './dialog-lavanderia.component.html',
  styleUrls: ['./dialog-lavanderia.component.css']
})
export class DialogLavanderiaComponent implements OnInit {

  note: string;
  date: Date;

  constructor(
    public dialogRef: MatDialogRef<DialogLavanderiaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      typeOperation: TypeOperationLavanderia
    }) {

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

