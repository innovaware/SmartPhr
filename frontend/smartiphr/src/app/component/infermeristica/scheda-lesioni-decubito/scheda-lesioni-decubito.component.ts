import { Component, Input, OnInit } from '@angular/core';
import { SchedaLesioniDecubito } from 'src/app/models/SchedaLesioniDecubito';

@Component({
  selector: 'app-scheda-lesioni-decubito',
  templateUrl: './scheda-lesioni-decubito.component.html',
  styleUrls: ['./scheda-lesioni-decubito.component.css']
})
export class SchedaLesioniDecubitoComponent implements OnInit {
  @Input() data: SchedaLesioniDecubito;
  @Input() disable: boolean;

  constructor() { }

  ngOnInit() {
  }

}
