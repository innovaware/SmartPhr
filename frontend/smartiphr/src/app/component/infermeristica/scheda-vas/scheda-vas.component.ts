import { Component, Input, OnInit } from '@angular/core';
import { SchedaVas } from 'src/app/models/SchedaVas';

@Component({
  selector: 'app-scheda-vas',
  templateUrl: './scheda-vas.component.html',
  styleUrls: ['./scheda-vas.component.css']
})
export class SchedaVASComponent implements OnInit {
  @Input() data: SchedaVas;
  @Input() disable: boolean;

  constructor() { }

  ngOnInit() {
  }

}
