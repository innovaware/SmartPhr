import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Dipendenti } from 'src/app/models/dipendenti';

@Component({
  selector: 'app-dialog-dipendente',
  templateUrl: './dialog-dipendente.component.html',
  styleUrls: ['./dialog-dipendente.component.css']
})
export class DialogDipendenteComponent implements OnInit {
  disable : boolean;

  constructor(
    public dialogRef: MatDialogRef<DialogDipendenteComponent>,
    @Inject(MAT_DIALOG_DATA) public item: {
      dipendente: Dipendenti, readonly: boolean
    }) {

      this.disable = item.readonly;
    }


  ngOnInit() {
  }

  saveDiario() {
    this.dialogRef.close(this.item);
  }

}
