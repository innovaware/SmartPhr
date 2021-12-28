import { Component, Input, OnInit } from '@angular/core';
import { IADL } from 'src/app/models/IADL';

@Component({
  selector: 'app-scheda-iadl',
  templateUrl: './scheda-iadl.component.html',
  styleUrls: ['./scheda-iadl.component.css']
})
export class SchedaIADLComponent implements OnInit {
  @Input() data: IADL;
  constructor() { }

  ngOnInit() {
  }

}
