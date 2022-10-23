import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-menu-generale',
  templateUrl: './dialog-menu-generale.component.html',
  styleUrls: ['./dialog-menu-generale.component.css']
})
export class DialogMenuGeneraleComponent implements OnInit {

  arrayWeek: number[];
  weekRif: Date;


  constructor(
    public dialogRef: MatDialogRef<DialogMenuGeneraleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {}
  ) {
    this.arrayWeek = Array(7);
   }

  ngOnInit(): void {
  }

  getMonday(d) {
    d = new Date(d);
    var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
    return new Date(d.setDate(diff));
  }


  dateFilter: (date: Date | null) => boolean =
    (date: Date | null) => {
      const day = date.getDay();
      return day === 0;
  }


  save() {
    this.dialogRef.close(undefined);
  }
  cancel() {
    this.dialogRef.close(undefined);
  }
}
