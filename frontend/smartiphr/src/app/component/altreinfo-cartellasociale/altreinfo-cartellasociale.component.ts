import { Component, Input, OnInit } from '@angular/core';
import { AltroCartellaSociale } from 'src/app/models/altroCartellaSociale';

@Component({
  selector: 'app-altreinfo-cartellasociale',
  templateUrl: './altreinfo-cartellasociale.component.html',
  styleUrls: ['./altreinfo-cartellasociale.component.css']
})
export class AltreinfoCartellasocialeComponent implements OnInit {

  @Input() data: AltroCartellaSociale;
  
  constructor() { }

  ngOnInit() {
  }



  change(){
    this.data.invaliditacivile = Boolean(this.data.invaliditacivile);

    this.data.esenzioneticket = Boolean(this.data.esenzioneticket);
    this.data.ausili = Boolean(this.data.ausili);
    this.data.interdizione = Boolean(this.data.interdizione);
    this.data.inabilitazione = Boolean(this.data.inabilitazione);
    this.data.ammsostesgno = Boolean(this.data.ammsostesgno);
    this.data.dispvisite = Boolean(this.data.dispvisite);
    this.data.ospiteperperiodi = Boolean(this.data.ospiteperperiodi);
    this.data.accpervisite = Boolean(this.data.accpervisite);
    this.data.bagno = Boolean(this.data.bagno);
    this.data.telefono = Boolean(this.data.telefono);
    this.data.riscaldamento = Boolean(this.data.riscaldamento);
    this.data.cambiospessoresidenza = Boolean(this.data.cambiospessoresidenza);


  }
}
