import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AreaRiabilitativa } from 'src/app/models/AreaRiabilitativa';
import { Paziente } from 'src/app/models/paziente';
import { ValutazioneMotoria } from 'src/app/models/ValutazioneMotoria';
import { PazienteService } from 'src/app/service/paziente.service';

@Component({
  selector: 'app-dialog-riabilitazione',
  templateUrl: './dialog-riabilitazione.component.html',
  styleUrls: ['./dialog-riabilitazione.component.css']
})
export class DialogRiabilitazioneComponent implements OnInit {

  paziente: Paziente;
  valutazioneMotoria: ValutazioneMotoria;
  areaRiabilitativa: AreaRiabilitativa;

  constructor(
    public pazienteService: PazienteService,
    public dialogRef: MatDialogRef<DialogRiabilitazioneComponent>,

    @Inject(MAT_DIALOG_DATA)
    public data: { paziente: Paziente; readonly: boolean; newItem: boolean }
  ) {
    console.log("Dialog riabilitazione Data: ", data);
    this.paziente = Paziente.clone(data.paziente);

    if (this.paziente.valutazioneMotoria == undefined || data.newItem == true) {
      this.paziente.valutazioneMotoria = new ValutazioneMotoria();
    }

    if (this.paziente.areaRiabilitativa == undefined || data.newItem == true) {
      this.paziente.areaRiabilitativa = new AreaRiabilitativa();
    }

    this.valutazioneMotoria = this.paziente.valutazioneMotoria as ValutazioneMotoria;
    this.areaRiabilitativa = this.paziente.areaRiabilitativa as AreaRiabilitativa;
  }

  ngOnInit() {}

  save() {
    this.pazienteService.save(this.paziente).then(
      (value: Paziente) => {
        console.log(`Patient  saved`, value);
        this.dialogRef.close(this.paziente);
      }
    )
  }
}
