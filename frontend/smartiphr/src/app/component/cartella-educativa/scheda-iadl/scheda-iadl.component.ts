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
    if(this.data.totale == null)
    this.data.totale = 0;
  }


  valIADLChange(event){
    console.log(this.data.totale);
    let A = isNaN(Number(this.data.A.split('-')[1])) == false ? Number(this.data.A.split('-')[1]) : 0;
    let B = isNaN(Number(this.data.B.split('-')[1])) == false ? Number(this.data.B.split('-')[1]) : 0;
    let C = isNaN(Number(this.data.C.split('-')[1])) == false ? Number(this.data.C.split('-')[1]) : 0;
    let D = isNaN(Number(this.data.D.split('-')[1])) == false ? Number(this.data.D.split('-')[1]) : 0;
    let E = isNaN(Number(this.data.E.split('-')[1])) == false ? Number(this.data.E.split('-')[1]) : 0;
    console.log(E);
    let F = isNaN(Number(this.data.F.split('-')[1])) == false ? Number(this.data.F.split('-')[1]) : 0;
    let G =isNaN(Number(this.data.G.split('-')[1])) == false ? Number(this.data.G.split('-')[1]) : 0;
    let H = isNaN(Number(this.data.H.split('-')[1])) == false ? Number(this.data.H.split('-')[1]) : 0;

    this.data.totale = A + B + C + D + E + F + G + H;
  }
}
