import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Presidi } from 'src/app/models/presidi';

@Component({
  selector: 'app-dialog-presidio',
  templateUrl: './dialog-presidio.component.html',
  styleUrls: ['./dialog-presidio.component.css']
})
export class DialogPresidioComponent implements OnInit {

  @Input() disable : boolean;
  @Input() isNew: boolean;

  constructor(
    public dialogRef: MatDialogRef<DialogPresidioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { row: Presidi; title: string;  }) {

      console.log("item: ", this.data.row);
    }


  ngOnInit() {
  }

  save() {
    this.dialogRef.close(this.data.row);
  }

}
