import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Evento } from 'src/app/models/evento';

@Component({
  selector: 'app-dialog-event',
  templateUrl: './dialog-event.component.html',
  styleUrls: ['./dialog-event.component.css']
})
export class DialogEventComponent implements OnInit {
  @Input() disable : boolean;
  @Input() isNew: boolean;

  constructor(
    public dialogRef: MatDialogRef<DialogEventComponent>,
    @Inject(MAT_DIALOG_DATA) public item: Evento) {

      console.log("item: ", item);
    }


  ngOnInit() {
  }

  save() {
    this.dialogRef.close(this.item);
  }

}
