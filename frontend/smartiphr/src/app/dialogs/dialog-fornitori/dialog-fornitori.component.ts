import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Fornitori } from 'src/app/models/fornitori';

@Component({
  selector: 'app-dialog-fornitori',
  templateUrl: './dialog-fornitori.component.html',
  styleUrls: ['./dialog-fornitori.component.css']
})
export class DialogFornitoriComponent implements OnInit {
  disable : boolean;

  constructor(
    public dialogRef: MatDialogRef<DialogFornitoriComponent>,
    @Inject(MAT_DIALOG_DATA) public item: {
      fornitore: Fornitori, readonly: boolean
    }) {

      this.disable = item.readonly;
    }


  ngOnInit() {
  }

  saveDiario() {
    this.dialogRef.close(this.item);
  }

}
