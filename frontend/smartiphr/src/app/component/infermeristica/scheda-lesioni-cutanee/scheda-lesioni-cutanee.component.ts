import { Component, Input, OnInit } from '@angular/core';
import { SchedaLesioniCutanee } from 'src/app/models/SchedaLesioniCutanee';

@Component({
  selector: 'app-scheda-lesioni-cutanee',
  templateUrl: './scheda-lesioni-cutanee.component.html',
  styleUrls: ['./scheda-lesioni-cutanee.component.css']
})
export class SchedaLesioniCutaneeComponent implements OnInit {
  @Input() data: SchedaLesioniCutanee;
  @Input() disable: boolean;

  constructor() { }

  ngOnInit() {
  }

}
