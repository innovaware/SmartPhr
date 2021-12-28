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
  }

}
