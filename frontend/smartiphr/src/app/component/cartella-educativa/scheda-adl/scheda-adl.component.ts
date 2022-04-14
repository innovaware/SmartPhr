import { Component, Input, OnInit } from '@angular/core';
import { ADL } from 'src/app/models/ADL';

@Component({
  selector: 'app-scheda-adl',
  templateUrl: './scheda-adl.component.html',
  styleUrls: ['./scheda-adl.component.css']
})
export class SchedaADLComponent implements OnInit {

  @Input() data: ADL;

  constructor() {

   }

  ngOnInit() {
  }

}
