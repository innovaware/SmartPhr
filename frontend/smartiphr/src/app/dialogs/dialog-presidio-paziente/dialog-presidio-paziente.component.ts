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
  constructor(
    public dialogRef: MatDialogRef<DialogPresidioPazienteComponent>,
    public service: GestPresidiService,
    @Inject(MAT_DIALOG_DATA) public data: { row: Presidi; title: string;  }) {
      console.log("item: ", this.data.row);
    }


  ngOnInit() {
    this.service.getPresidi().then((result) => {
      this.presidi = result;
    });
  }

  save() {
    this.dialogRef.close(this.data.row);
  }

}
