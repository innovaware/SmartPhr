import { Component, Input, OnInit } from '@angular/core';
import { valutazioneEducativa } from 'src/app/models/valutazioneEducativa';

@Component({
  selector: 'app-valutazione-educativa',
  templateUrl: './valutazione-educativa.component.html',
  styleUrls: ['./valutazione-educativa.component.css']
})
export class ValutazioneEducativaComponent implements OnInit {

  @Input() data: valutazioneEducativa;
  constructor() { }

  ngOnInit() {
  }

}
