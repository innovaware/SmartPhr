import { Component, Input, OnInit} from '@angular/core';
import { schedaValutazioneTecniche } from 'src/app/models/schedaValutazioneTecniche';


@Component({
  selector: 'app-valutazione-tecniche',
  templateUrl: './valutazione-tecniche.component.html',
  styleUrls: ['./valutazione-tecniche.component.css']
})
export class ValutazioneTecnicheComponent implements OnInit {

  @Input() data: schedaValutazioneTecniche;

  constructor() {}

  ngOnInit() {
  }


}
