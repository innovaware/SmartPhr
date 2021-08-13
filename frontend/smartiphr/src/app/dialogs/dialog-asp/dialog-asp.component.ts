import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Asp } from 'src/app/models/asp';

@Component({
  selector: 'app-dialog-asp',
  templateUrl: './dialog-asp.component.html',
  styleUrls: ['./dialog-asp.component.css']
})
export class DialogAspComponent implements OnInit {
  disable : boolean;

  constructor(
    public dialogRef: MatDialogRef<DialogAspComponent>,
    @Inject(MAT_DIALOG_DATA) public item: {
      asp: Asp, readonly: boolean
    }) {

      this.disable = item.readonly;
    }


  ngOnInit() {
  }

  saveDiario() {
    this.dialogRef.close(this.item);
  }

}
