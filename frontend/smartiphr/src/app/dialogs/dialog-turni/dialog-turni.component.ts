import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-turni',
  templateUrl: './dialog-turni.component.html',
  styleUrls: ['./dialog-turni.component.css']
})
export class DialogTurniComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogTurniComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    }


  ngOnInit() {
  }

  Close() {
    this.dialogRef.close();
  }

}
