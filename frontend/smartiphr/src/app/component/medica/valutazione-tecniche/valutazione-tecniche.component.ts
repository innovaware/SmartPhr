import { Component, Input, OnInit} from '@angular/core';
import { Paziente } from 'src/app/models/paziente';
import { CartellaEducativa } from '../../../models/cartellaEducativa';
import { ValutazioneMotoria } from '../../../models/ValutazioneMotoria';

@Component({
  selector: 'app-valutazione-tecniche',
  templateUrl: './valutazione-tecniche.component.html',
  styleUrls: ['./valutazione-tecniche.component.css']
})
export class ValutazioneTecnicheComponent implements OnInit {

  @Input() data: Paziente;

  constructor() {
    if (this.data.schedaEducativa == undefined || this.data.schedaEducativa == null) {
      this.data.schedaEducativa = new CartellaEducativa();
    }

    if (this.data.valutazioneMotoria == undefined || this.data.valutazioneMotoria == null) {
      this.data.valutazioneMotoria = new ValutazioneMotoria();
    }
  }

  ngOnInit() {
  }


}
