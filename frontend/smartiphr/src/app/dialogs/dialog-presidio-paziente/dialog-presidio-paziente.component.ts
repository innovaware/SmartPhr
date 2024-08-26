import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Presidi } from 'src/app/models/presidi';
import { GestPresidiService } from 'src/app/service/gest-presidi.service';

@Component({
  selector: 'app-dialog-presidio-paziente',
  templateUrl: './dialog-presidio-paziente.component.html',
  styleUrls: ['./dialog-presidio-paziente.component.css']
})
export class DialogPresidioPazienteComponent implements OnInit {

  presidi: Presidi[];
  selected = "";
  constructor(
    public dialogRef: MatDialogRef<DialogPresidioPazienteComponent>,
    public service: GestPresidiService,
    @Inject(MAT_DIALOG_DATA) public data: { row: Presidi; title: string;  }) {
      console.log("item: ", this.data.row);
      this.selected = this.data.row._id != undefined ? this.data.row._id : "";
    }


  ngOnInit() {
    this.selected = this.data.row._id != undefined ? this.data.row._id : "";
    this.service.getPresidi().then((result) => {
      this.presidi = result;
    });
  }

  save() {
    const first = this.presidi.find((obj) => {
      return obj._id === this.data.row.rif_id;
    });

    if(first != null){
      if(first.qty < this.data.row.qty){
        alert('La quantità inserita supera il limite disponibile!');
        return;
      }

      if(first.giacenza < this.data.row.giacenza){
        alert('La giacenza inserita supera il limite disponibile!');
        return;
      }
    }

    this.data.row.rif_id = this.data.row.rif_id != "" ? this.data.row.rif_id : this.data.row._id;
    console.log(this.data.row);
    this.dialogRef.close(this.data.row);
  }

}
