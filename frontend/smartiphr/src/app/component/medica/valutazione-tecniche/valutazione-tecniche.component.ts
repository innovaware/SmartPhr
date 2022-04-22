import { Component, Input, OnInit} from '@angular/core';
import { Paziente } from 'src/app/models/paziente';

@Component({
  selector: 'app-valutazione-tecniche',
  templateUrl: './valutazione-tecniche.component.html',
  styleUrls: ['./valutazione-tecniche.component.css']
})
export class ValutazioneTecnicheComponent implements OnInit {

  @Input() data: Paziente;

  constructor() {}

  ngOnInit() {
  }


}
