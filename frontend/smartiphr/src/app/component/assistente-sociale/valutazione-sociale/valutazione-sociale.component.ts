import { Component, Input, OnInit } from '@angular/core';
import { valutazioneSociale } from 'src/app/models/valutazioneSociale';

@Component({
  selector: 'app-valutazione-sociale',
  templateUrl: './valutazione-sociale.component.html',
  styleUrls: ['./valutazione-sociale.component.css']
})
export class ValutazioneSocialeComponent implements OnInit {

  @Input() data: valutazioneSociale;
  constructor() { }

  ngOnInit() {
  }

}
