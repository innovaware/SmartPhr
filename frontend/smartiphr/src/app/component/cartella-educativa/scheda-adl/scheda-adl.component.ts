import { Component, Input, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
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

  valADLChange(event){

    let A = Number(this.data.A.split('-')[1]);
    let B = Number(this.data.B.split('-')[1]);
    let C = Number(this.data.C.split('-')[1]);
    let D = Number(this.data.D.split('-')[1]);
    let E = Number(this.data.E.split('-')[1]);
    let F = Number(this.data.F.split('-')[1]);

    this.data.totale = A + B + C + D + E + F;
  }
}
