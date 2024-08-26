import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Farmaci } from 'src/app/models/farmaci';

@Component({
  selector: 'app-dialog-farmaco',
  templateUrl: './dialog-farmaco.component.html',
  styleUrls: ['./dialog-farmaco.component.css']
})
export class DialogFarmacoComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogFarmacoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { row: Farmaci; title: string;  }) {

      console.log("item: ", this.data.row);
    }


  ngOnInit() {
  }

  save() {
    this.dialogRef.close(this.data.row);
  }

}
