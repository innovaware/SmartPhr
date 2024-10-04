import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Farmaci } from 'src/app/models/farmaci';

@Component({
  selector: 'app-dialog-farmaco',
  templateUrl: './dialog-farmaco.component.html',
  styleUrls: ['./dialog-farmaco.component.css']
})
export class DialogFarmacoComponent implements OnInit {
  disabled: Boolean
  constructor(
    public dialogRef: MatDialogRef<DialogFarmacoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { row: Farmaci; title: string; readOnly: Boolean; }) {
    if (data.readOnly) {
      this.disabled = true;
    }
    else {
      this.disabled = false;
    }
      console.log("item: ", this.data.row);
    }


  ngOnInit() {
  }

  save() {
    if (this.data.row.quantitaOccupata !== undefined && this.data.row.quantitaOccupata !== null && this.data.row.quantitaOccupata != 0) {
      this.data.row.quantitaDisponibile = (this.data.row.qty * this.data.row.qtyTot) - this.data.row.quantitaOccupata.valueOf();
    }
    else {
      this.data.row.quantitaDisponibile = this.data.row.qty * this.data.row.qtyTot;
    }
    this.dialogRef.close(this.data.row);
  }

}
