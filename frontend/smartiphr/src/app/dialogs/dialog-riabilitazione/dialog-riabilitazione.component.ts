import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Paziente } from 'src/app/models/paziente';

@Component({
  selector: 'app-dialog-riabilitazione',
  templateUrl: './dialog-riabilitazione.component.html',
  styleUrls: ['./dialog-riabilitazione.component.css']
})
export class DialogRiabilitazioneComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogRiabilitazioneComponent>,

    @Inject(MAT_DIALOG_DATA)
    public data: { paziente: Paziente; readonly: boolean; newItem: boolean }
  ) {
    console.log("Dialog psicologica. Data: ", data);

  }

  ngOnInit() {}

  save() {

   // this.data.paziente.schedaPisico.update(this.schedaPisico);
  }
}
