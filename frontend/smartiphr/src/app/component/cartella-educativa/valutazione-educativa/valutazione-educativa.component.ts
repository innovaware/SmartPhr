import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { valutazioneEducativa } from 'src/app/models/valutazioneEducativa';

@Component({
  selector: 'app-valutazione-educativa',
  templateUrl: './valutazione-educativa.component.html',
  styleUrls: ['./valutazione-educativa.component.css']
})
export class ValutazioneEducativaComponent implements OnInit {

  @Input() data: valutazioneEducativa;
  @Input() disable: boolean;
  constructor() { }
  @Output() dataChange = new EventEmitter<valutazioneEducativa>();
  @Output() saveEmiter = new EventEmitter<valutazioneEducativa>();

  ngOnInit() {
  }

  async save() {
    console.log("save: ", this.data);
    this.saveEmiter.emit(this.data);
  }

  async change() {
    console.log("change: ", this.data);
    this.dataChange.emit(this.data);
  }
}
