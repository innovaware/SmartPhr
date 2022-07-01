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
  constructor(
    public dialogRef: MatDialogRef<DialogFarmacoPazienteComponent>,
    public farmaciService: GestFarmaciService,
    @Inject(MAT_DIALOG_DATA) public data: { row: Farmaci; title: string;  }) {
      console.log("item: ", this.data.row);
    }


  ngOnInit() {
    this.farmaciService.getFarmaci().then((result) => {
      this.farmaci = result;
    });
  }

  save() {
    this.dialogRef.close(this.data.row);
  }

}
