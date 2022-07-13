import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Farmaci } from 'src/app/models/farmaci';
import { GestFarmaciService } from 'src/app/service/gest-farmaci.service';

@Component({
  selector: 'app-dialog-farmaco-paziente',
  templateUrl: './dialog-farmaco-paziente.component.html',
  styleUrls: ['./dialog-farmaco-paziente.component.css']
})
export class DialogFarmacoPazienteComponent implements OnInit {
  farmaci: Farmaci[];
  selected = "";
  constructor(
    public dialogRef: MatDialogRef<DialogFarmacoPazienteComponent>,
    public farmaciService: GestFarmaciService,
    @Inject(MAT_DIALOG_DATA) public data: { row: Farmaci; title: string;  }) {
      console.log("item: ", this.data.row);
      this.selected = this.data.row._id != undefined ? this.data.row._id : "";
    }


  ngOnInit() {
    this.selected = this.data.row._id != undefined ? this.data.row._id : "";
    this.farmaciService.getFarmaci().then((result) => {
      this.farmaci = result;
    });
  }

  save() {

    const first = this.farmaci.find((obj) => {
      //return obj._id === this.data.row._id;
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
