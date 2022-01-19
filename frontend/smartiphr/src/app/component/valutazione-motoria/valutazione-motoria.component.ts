import { Component, Input, OnInit } from '@angular/core';
import { ValutazioneMotoria } from 'src/app/models/ValutazioneMotoria';

@Component({
  selector: 'app-valutazione-motoria',
  templateUrl: './valutazione-motoria.component.html',
  styleUrls: ['./valutazione-motoria.component.css']
})
export class ValutazioneMotoriaComponent implements OnInit {
  @Input() data: ValutazioneMotoria;
  @Input() disable: boolean;

  constructor() { }

  ngOnInit() {
  }

}
