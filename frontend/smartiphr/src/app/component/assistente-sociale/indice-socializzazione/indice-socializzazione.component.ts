import { Component, Input, OnInit } from '@angular/core';
import { IndiceSocializzazione } from 'src/app/models/indiceSocializzazione';

@Component({
  selector: 'app-indice-socializzazione',
  templateUrl: './indice-socializzazione.component.html',
  styleUrls: ['./indice-socializzazione.component.css']
})
export class IndiceSocializzazioneComponent implements OnInit {

  @Input() data: IndiceSocializzazione;

  constructor() {
    
   }

  ngOnInit() {
    this.data.data = new Date(this.data.data);
  }


  valChange(){
    console.log(this.data.totale);
    let A = isNaN(Number(this.data.adattamentoSociale)) == false ? Number(this.data.adattamentoSociale) : 0;
    let B = isNaN(Number(this.data.relAmicizia)) == false ? Number(this.data.relAmicizia) : 0;
    let C = isNaN(Number(this.data.integrazioneGruppo)) == false ? Number(this.data.integrazioneGruppo) : 0;
    let D = isNaN(Number(this.data.gradoDisp)) == false ? Number(this.data.gradoDisp) : 0;
    let E = isNaN(Number(this.data.rapportoFamiglia)) == false ? Number(this.data.rapportoFamiglia) : 0;
    let F = isNaN(Number(this.data.attivitaSociale)) == false ? Number(this.data.attivitaSociale) : 0;
    let G =isNaN(Number(this.data.attivitaRSA)) == false ? Number(this.data.attivitaRSA) : 0;


    this.data.totale = A + B + C + D + E + F + G;
  }

}
