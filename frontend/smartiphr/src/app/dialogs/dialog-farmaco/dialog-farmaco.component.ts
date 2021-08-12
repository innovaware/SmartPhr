import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Farmaci } from 'src/app/models/farmaci';

@Component({
  selector: 'app-dialog-farmaco',
  templateUrl: './dialog-farmaco.component.html',
  styleUrls: ['./dialog-farmaco.component.css']
})
export class DialogFarmacoComponent implements OnInit {
  @Input() disable : boolean;
  @Input() isNew: boolean;

  constructor(
    public dialogRef: MatDialogRef<DialogFarmacoComponent>,
    @Inject(MAT_DIALOG_DATA) public item: Farmaci) {

      console.log("item: ", item);
    }


  ngOnInit() {
  }

  save() {
    this.dialogRef.close(this.item);
  }

}
